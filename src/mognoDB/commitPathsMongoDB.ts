import {inject, injectable} from "inversify";
import {MongoClient, MongoError} from "mongodb";
import {MongoDBConfig} from "./mongoDBConfig";
import {DB} from "bugfinder-framework/dist/00-shared/db/DB";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {BUGFINDER_DB_COMMITPATH_MONGODB_TYPES} from "../TYPES";
import {Commit} from "bugfinder-localityrecorder-commit";
import {Dataset, LocalityMap} from "bugfinder-framework";

const COMMIT_LOCATION_PREFIX = "__COMMITS__";

@injectable()
export class CommitPathsMongoDB<Annotation, Quantification> implements DB<CommitPath, Annotation, Quantification> {

    /**
     *
     * @param dbConfig
     */
    constructor(@inject(BUGFINDER_DB_COMMITPATH_MONGODB_TYPES.mongoDBConfig) public dbConfig: MongoDBConfig) {
    }

    /**
     * Reads CommitPaths from DB configured with mongoDBConfig while considering this.pathsHandling-configuration
     */
    async readLocalities(fromID: string, skip?: number, n?: number): Promise<CommitPath[]> {
        console.log(`Reading localities from collection ${fromID} using database ${this.dbConfig.dbName} ` +
            `from ${this.dbConfig.url}...`)

        const commitPaths: CommitPath[] = await this.read(fromID, skip, n);
        const commits: Commit[] = await this.read(COMMIT_LOCATION_PREFIX + fromID);

        // apply prototype functions to DTO
        commits.forEach(commit => {
            Commit.prototype.setMethods(commit);
        })

        commitPaths.forEach(commitPath => {
            CommitPath.prototype.setMethods(commitPath);
        })

        // set all commits in CommitPath
        commits.forEach(commit => {
            CommitPath.pushCommit(commit)
        })

        console.log(`Found ${commitPaths.length} localities in database`);
        return commitPaths;
    }

    async writeLocalities(localities: CommitPath[], toID: string) {
        console.log(`Writing ${localities.length} localities to collection ${toID} into database...`)
        // normalize CommitPath into 2 collections: Commit, CommitPath
        await this.writeMany(CommitPath.getCommits(localities), COMMIT_LOCATION_PREFIX + toID);
        await this.writeMany(localities, toID);
    }

    async readAnnotations(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Annotation>> {
        console.log(`Reading annotations from collection ${fromID} using database ${this.dbConfig.dbName} ` +
            `from ${this.dbConfig.url}...`)

        const commits: Commit[] = await this.read(COMMIT_LOCATION_PREFIX + fromID);
        const annotations = await this.read(fromID, skip, n);

        commits.forEach(commit => {
            Commit.prototype.setMethods(commit);
        })

        annotations.forEach(annotation => {
            const commitPath = annotation.key;
            CommitPath.prototype.setMethods(commitPath)
        })

        commits.forEach(commit => {
            CommitPath.pushCommit(commit);
        })
        const locMap = new LocalityMap<CommitPath, Annotation>();
        locMap.fromArray(annotations);

        console.log(`Found ${annotations.length} annotations in database`);
        return locMap;
    }

    async writeAnnotations(annotations: LocalityMap<CommitPath, Annotation>, toID: string): Promise<void> {
        console.log(`Writing ${annotations.size()} annotations to collection ${toID} using database ` +
            `${this.dbConfig.dbName} from ${this.dbConfig.url}...`)
        const annosArray = annotations.toArray();
        const cps: CommitPath[] = annosArray.map(el => {
            return el.key
        });
        const normalizedCPs = CommitPath.normalize(cps);

        await this.writeMany(normalizedCPs.commits, COMMIT_LOCATION_PREFIX + toID);
        await this.writeMany(annosArray, toID);
    }

    async readQuantifications(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Quantification>> {
        console.log(`Reading quantifications from collection ${fromID} using database ${this.dbConfig.dbName} ` +
            `from ${this.dbConfig.url}...`)

        const commits: Commit[] = await this.read(COMMIT_LOCATION_PREFIX + fromID);
        const quantifications = await this.read(fromID, skip, n);

        commits.forEach(commit => {
            Commit.prototype.setMethods(commit);
        })

        quantifications.forEach(quantification => {
            const commitPath = quantification.key;
            CommitPath.prototype.setMethods(commitPath)
        })

        commits.forEach(commit => {
            CommitPath.pushCommit(commit);
        })

        const locMap = new LocalityMap<CommitPath, Quantification>();
        locMap.fromArray(quantifications);

        console.log(`Found ${quantifications.length} quantifications in database`);
        return locMap;
    }

    async writeQuantifications(quantifications: LocalityMap<CommitPath, Quantification>, toID: string): Promise<void> {
        console.log(`Writing ${quantifications.size()} quantifications to collection ${toID} using database ` +
            `${this.dbConfig.dbName} from ${this.dbConfig.url}...`)
        const quantiArray = quantifications.toArray();
        const cps: CommitPath[] = quantiArray.map(el => {
            return el.key
        });
        const normalizedCPs = CommitPath.normalize(cps);

        /*
        const quantisWithReferencesCommits = quantiArray.map(el => {
            return {
                key: {
                    parentKey: el.key.commit.key(),
                    path: el.key.path
                },
                val: el.val
            }
        })
        */

        await this.writeMany(normalizedCPs.commits, COMMIT_LOCATION_PREFIX + toID);
        await this.writeMany(quantiArray, toID);
    }

    async readDataset(fromID: string): Promise<Dataset> {
        const dataset = (await this.read(fromID))[0]
        return dataset[0]
    }

    async writeDataset(toID: string, dataset: Dataset): Promise<void> {
        await this.write(dataset, toID)
    }

    private async read(fromID: string, skip?: number, n?: number): Promise<any[]> {
        // @formatter:off
        const client: MongoClient   = await MongoClient.connect(this.dbConfig.url, {useUnifiedTopology: true});
        const db                    = client.db(this.dbConfig.dbName);
        const collectionName        = fromID;
        const collection            = db.collection(collectionName);


        const dbContent             = (skip == null && n == null)?
            await collection.find({}).toArray()
            : await collection.find({}).skip(skip).limit(n).toArray()
        // @formatter:on

        await client.close();
        return dbContent;
    }

    async write(obj: any, toID: string) {
        const elementsInCollection = await this.read(toID);

        if (elementsInCollection.length > 0) {
            const err = new MongoError(`Found ${elementsInCollection.length} elements in database collection ${toID}.
                Database collection commits should be empty! Aborting Writing to DB. Please delete all elements 
                in collection ${toID} to prevent redundancy.`);
            throw(err);
        }

        // @formatter:off
        const client: MongoClient   = await MongoClient.connect(this.dbConfig.url, {useUnifiedTopology: true});
        const db                    = client.db(this.dbConfig.dbName);
        const collectionName        = toID;
        const collection            = db.collection(collectionName);
        // @formatter:on

        await collection.insertOne(obj);
        await client.close();
    }

    async writeMany(objs: any[], toID: string) {

        const elementsInCollection = await this.read(toID);

        if (elementsInCollection.length > 0) {
            const err = new MongoError(`Found ${elementsInCollection.length} elements in database collection ${toID}.
                Database collection commits should be empty! Aborting Writing to DB. Please delete all elements 
                in collection ${toID} to prevent redundancy.`);
            throw(err);
        }

        // @formatter:off
        const client: MongoClient   = await MongoClient.connect(this.dbConfig.url, {useUnifiedTopology: true});
        const db                    = client.db(this.dbConfig.dbName);
        const collectionName        = toID;
        const collection            = db.collection(collectionName);
        // @formatter:on

        await collection.insertMany(objs);
        await client.close();
    }

    /**
     * Set Methods to CommitPath-Objects as only DTOs are saved in database
     * @param commitPath
     * @private
     */
    private setMethods(commitPath: CommitPath) {
        // TODO iterate over all method-attributes and set the right prototypes (generic) => if you add CommitPath Methods this
        // TODO function should still work finde
        // TODO: delete me
        commitPath.key = CommitPath.prototype.key;
        commitPath.is = CommitPath.prototype.is;
    }

}