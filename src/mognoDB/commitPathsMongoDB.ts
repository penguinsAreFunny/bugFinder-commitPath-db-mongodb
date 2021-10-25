import {inject, injectable} from "inversify";
import {MongoClient, GridFSBucket} from "mongodb";
import {MongoDBConfig} from "./mongoDBConfig";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";
import {BUGFINDER_DB_COMMITPATH_MONGODB_TYPES} from "../TYPES";
import {Commit} from "bugfinder-localityrecorder-commit";
import {DatasetAFE, DatasetAP, LocalityMap, DB, WriteMode, SHARED_TYPES} from "bugfinder-framework";
import {Logger} from "ts-log"
import {Readable} from "stream";

const COLLECTION_FILES_APPENDIX = ".files"
const COMMIT_LOCATION_PREFIX = "__COMMITS__";

@injectable()
export class CommitPathsMongoDB<Annotation, Quantification> implements DB<CommitPath, Annotation, Quantification> {

    constructor(@inject(SHARED_TYPES.logger) private logger: Logger,
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
     * @param mode
     */
    async writeLocalities(localities: CommitPath[], toID: string, mode?: WriteMode) {
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
    async writeAnnotations(annotations: LocalityMap<CommitPath, Annotation>, toID: string, mode?: WriteMode): Promise<void> {
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
     * @param mode
     */
    async writeQuantifications(quantifications: LocalityMap<CommitPath, Quantification>, toID: string, mode?: WriteMode): Promise<void> {
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
        this.logger?.info(`Reading datasetAP from collection ${fromID} using database ${this.dbConfig.dbName} ` +
            `from ${this.dbConfig.url}...`)
        return await this.readLarge(fromID)
    }

    /**
     * Writes DatasetAP to DB at location (collection/table/file/...) toID.
     * @param toID
     * @param dataset
     * @param mode
     */
    async writeDatasetAP(toID: string, dataset: DatasetAP): Promise<void> {
        this.logger?.info(`Writing datasetAP to collection ${toID} using database ` +
            `${this.dbConfig.dbName} from ${this.dbConfig.url}...`)
        if (!await this.empty(toID + COLLECTION_FILES_APPENDIX, true))
            return
        await this.writeLarge(dataset, toID)
    }

    async readDatasetAFE(fromID: string): Promise<DatasetAFE> {
        return await this.readLarge(fromID)
    }

    /**
     * Writes DatasetAFE to DB at location (collection/table/file/...) toID.
     * @param toID
     * @param dataset
     */
    async writeDatasetAFE(toID: string, dataset: DatasetAFE): Promise<void> {
        this.logger?.info(`Writing datasetAFE to collection ${toID} using database ` +
            `${this.dbConfig.dbName} from ${this.dbConfig.url}...`)
        if (!await this.empty(toID + COLLECTION_FILES_APPENDIX, true))
            return
        await this.writeLarge(dataset, toID)
    }

    private async read(fromID: string, skip?: number, n?: number): Promise<any[]> {
        // @formatter:off
        const client: MongoClient   = await MongoClient.connect(this.dbConfig.url);
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

    /**
     * Writes a large (> 16 MB) obj to Database.
     * @see http://mongodb.github.io/node-mongodb-native/3.0/tutorials/gridfs/
     * @param obj
     * @param toID
     */
    async writeLarge(obj: any, toID: string) {
        // examples: https://www.tabnine.com/code/javascript/classes/mongodb/GridFSBucket
        // @formatter:off
        const client: MongoClient   = await MongoClient.connect(this.dbConfig.url);
        const db                    = client.db(this.dbConfig.dbName);
        //const collectionName        = toID;
        //const collection            = db.collection(collectionName);
        // @formatter:on


        const readable = Readable.from(JSON.stringify(obj))
        const bucket = new GridFSBucket(db, {bucketName: toID});
        return new Promise((resolve, reject) => {
            readable.pipe(bucket.openUploadStream(toID))
                .on('finish', () => {
                    client.close()
                    resolve(true)
                })
                .on("error", (error) => {
                    reject(error)
                })
        })
    }

    async readLarge(fromID: string): Promise<any> {
        // examples: https://www.tabnine.com/code/javascript/classes/mongodb/GridFSBucket
        // @formatter:off
        const client: MongoClient   = await MongoClient.connect(this.dbConfig.url);
        const db                    = client.db(this.dbConfig.dbName);
        // @formatter:on

        const bucket = new GridFSBucket(db, {bucketName: fromID});
        const stream = bucket.openDownloadStreamByName(fromID)
        return new Promise((resolve, reject) => {
            const chunks = []
            stream.on("data", data => {
                chunks.push(data)
            })
            stream.on("end", () => {
                const data = Buffer.concat(chunks)
                const dataset = JSON.parse(data.toString("utf-8"))
                client.close()
                resolve(dataset)
            })
            stream.on("error", err => {
                reject(err)
            })
            stream.read()
        })
    }

    async write(obj: any, toID: string, mode?: WriteMode) {
        if (mode == null) mode = WriteMode.write

        if (mode != WriteMode.append) {
            // do not write to collection if there are already elements!
            const emptyCol = await this.empty(toID, true)
            if (!emptyCol) {
                this.logger?.warn(`Collection ${toID} is not empty. Not writing to Database.` +
                    `Consider using DB.write with WriteMode.append to write to not empty collection`)
                return
            }
        }

        // @formatter:off
        const client: MongoClient   = await MongoClient.connect(this.dbConfig.url);
        const db                    = client.db(this.dbConfig.dbName);
        const collectionName        = toID;
        const collection            = db.collection(collectionName);
        // @formatter:on

        await collection.insertOne(obj);
        await client.close();
    }

    async writeMany(objs: any[], toID: string, mode?: WriteMode) {
        if (mode == null) mode = WriteMode.write

        if (mode != WriteMode.append) {
            // do not write to collection if there are already elements!
            const emptyCol = await this.empty(toID, true)
            if (!emptyCol) {
                this.logger?.warn(`Collection ${toID} is not empty. Not writing to Database.` +
                    `Consider using DB.write with WriteMode.append to write to not empty collection`)
                return
            }
        }

        // @formatter:off
        const client: MongoClient   = await MongoClient.connect(this.dbConfig.url);
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

