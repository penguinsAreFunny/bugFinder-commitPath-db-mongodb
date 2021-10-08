import {inject, injectable} from "inversify";
import {MongoClient} from "mongodb";
import {MongoDBConfig} from "./mongoDBConfig";
import {DB} from "bugfinder-framework/dist/00-shared/db/DB";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {BUGFINDER_DB_COMMITPATH_MONGODB_TYPES} from "../TYPES";
import {Commit} from "bugfinder-localityrecorder-commit";
import {LocalityMap, DatasetAP, DatasetAFE} from "bugfinder-framework";
import {Logger} from "ts-logger"

const COMMIT_LOCATION_PREFIX = "__COMMITS__";

@injectable()
export class CommitPathsMongoDB<Annotation, Quantification> implements DB<CommitPath, Annotation, Quantification> {

    constructor(@inject(BUGFINDER_DB_COMMITPATH_MONGODB_TYPES.logger) private logger: Logger,
                @inject(BUGFINDER_DB_COMMITPATH_MONGODB_TYPES.mongoDBConfig) public dbConfig: MongoDBConfig) {
    }

    /**
     * Reads CommitPaths from DB configured with mongoDBConfig while considering this.pathsHandling-configuration
     */
    async readLocalities(fromID: string, skip?: number, n?: number): Promise<CommitPath[]> {
        this.logger?.info(`Reading localities from collection ${fromID} using database ${this.dbConfig.dbName} ` +
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

        this.logger?.info(`Found ${commitPaths.length} localities in database`);
        return commitPaths;
    }

    /**
     * Writes localities to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param localities
     * @param toID
     */
    async writeLocalities(localities: CommitPath[], toID: string, mode = "w") {
        this.logger?.info(`Writing ${localities.length} localities to collection ${toID} into database...`)
        // normalize CommitPath into 2 collections: Commit, CommitPath
        await this.writeMany(CommitPath.getCommits(localities), COMMIT_LOCATION_PREFIX + toID, mode);
        await this.writeMany(localities, toID, mode);
    }

    async readAnnotations(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Annotation>> {
        this.logger?.info(`Reading annotations from collection ${fromID} using database ${this.dbConfig.dbName} ` +
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

        this.logger?.info(`Found ${annotations.length} annotations in database`);
        return locMap;
    }

    /**
     * Writes annotation to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param annotations
     * @param toID
     * @param mode
     */
    async writeAnnotations(annotations: LocalityMap<CommitPath, Annotation>, toID: string, mode = "w"): Promise<void> {
        this.logger?.info(`Writing ${annotations.size()} annotations to collection ${toID} using database ` +
            `${this.dbConfig.dbName} from ${this.dbConfig.url}...`)
        const annosArray = annotations.toArray();
        const cps: CommitPath[] = annosArray.map(el => {
            return el.key
        });
        const normalizedCPs = CommitPath.normalize(cps);

        await this.writeMany(normalizedCPs.commits, COMMIT_LOCATION_PREFIX + toID, mode);
        await this.writeMany(annosArray, toID, mode);
    }

    async readQuantifications(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Quantification>> {
        this.logger?.info(`Reading quantifications from collection ${fromID} using database ${this.dbConfig.dbName} ` +
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

        this.logger?.info(`Found ${quantifications.length} quantifications in database`);
        return locMap;
    }

    /**
     * Writes quantifications to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param quantifications
     * @param toID
     */
    async writeQuantifications(quantifications: LocalityMap<CommitPath, Quantification>, toID: string, mode = "w"): Promise<void> {
        this.logger?.info(`Writing ${quantifications.size()} quantifications to collection ${toID} using database ` +
            `${this.dbConfig.dbName} from ${this.dbConfig.url}...`)
        const quantiArray = quantifications.toArray();
        const cps: CommitPath[] = quantiArray.map(el => {
            return el.key
        });
        const normalizedCPs = CommitPath.normalize(cps);

        await this.writeMany(normalizedCPs.commits, COMMIT_LOCATION_PREFIX + toID, mode);
        await this.writeMany(quantiArray, toID, mode);
    }

    async readDatasetAP(fromID: string): Promise<DatasetAP> {
        const dataset = (await this.read(fromID))[0]
        return dataset[0]
    }

    /**
     * Writes DatasetAP to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param toID
     * @param dataset
     */
    async writeDatasetAP(toID: string, dataset: DatasetAP, mode = "w"): Promise<void> {
        await this.write(dataset, toID, mode)
    }

    async readDatasetAFE(fromID: string): Promise<DatasetAFE> {
        const dataset = (await this.read(fromID))[0]
        return dataset[0]
    }

    /**
     * Writes DatasetAFE to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param toID
     * @param dataset
     */
    async writeDatasetAFE(toID: string, dataset: DatasetAFE, mode = "w"): Promise<void> {
        await this.write(dataset, toID, mode)
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

    async write(obj: any, toID: string, mode: string = "w") {
        if (mode != "a") {
            // do not write to collection if there are already elements!
            const emptyCol = await this.empty(toID, true)
            if (emptyCol) return
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

    async writeMany(objs: any[], toID: string, mode: string = "w") {
        if (mode != "a") {
            // do not write to collection if there are already elements!
            const emptyCol = await this.empty(toID, true)
            if (emptyCol)
                return
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
     * Returns true if collection is empty. Logs error if error is set to true
     * @param toID
     * @param error
     * @private
     */
    private async empty(toID: string, error: boolean): Promise<boolean> {
        const elementsInCollection = await this.read(toID);
        const numberElInCol = elementsInCollection.length
        if (numberElInCol > 0) {
            if (error) {
                this.logger?.error(`Found ${numberElInCol} elements in database collection ${toID}.
                Database collection commits should be empty! Aborting Writing to DB. Please delete all elements 
                in collection ${toID} to prevent redundancy.`)
            }
            return false
        }
        return true
    }

    /**
     * Set Methods to CommitPath-Objects as only DTOs are saved in database
     * @param commitPath
     * @private
     */
    private setMethods(commitPath: CommitPath) {
        // TODO: implement generic method of this. Changes to CommitPath should not affect this method!
        commitPath.key = CommitPath.prototype.key;
        commitPath.is = CommitPath.prototype.is;
    }

}