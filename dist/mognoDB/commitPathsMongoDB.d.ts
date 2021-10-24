import { MongoDBConfig } from "./mongoDBConfig";
import { CommitPath } from "bugfinder-localityrecorder-commitpath";
import { DatasetAFE, DatasetAP, LocalityMap, DB, WriteMode } from "bugfinder-framework";
import { Logger } from "ts-log";
export declare class CommitPathsMongoDB<Annotation, Quantification> implements DB<CommitPath, Annotation, Quantification> {
    private logger;
    dbConfig: MongoDBConfig;
    constructor(logger: Logger, dbConfig: MongoDBConfig);
    /**
     * Reads CommitPaths from DB configured with mongoDBConfig while considering this.pathsHandling-configuration
     */
    readLocalities(fromID: string, skip?: number, n?: number): Promise<CommitPath[]>;
    /**
     * Writes localities to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param localities
     * @param toID
     * @param mode
     */
    writeLocalities(localities: CommitPath[], toID: string, mode?: WriteMode): Promise<void>;
    readAnnotations(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Annotation>>;
    /**
     * Writes annotation to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param annotations
     * @param toID
     * @param mode
     */
    writeAnnotations(annotations: LocalityMap<CommitPath, Annotation>, toID: string, mode?: WriteMode): Promise<void>;
    readQuantifications(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Quantification>>;
    /**
     * Writes quantifications to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param quantifications
     * @param toID
     * @param mode
     */
    writeQuantifications(quantifications: LocalityMap<CommitPath, Quantification>, toID: string, mode?: WriteMode): Promise<void>;
    readDatasetAP(fromID: string): Promise<DatasetAP>;
    /**
     * Writes DatasetAP to DB at location (collection/table/file/...) toID.
     * @param toID
     * @param dataset
     * @param mode
     */
    writeDatasetAP(toID: string, dataset: DatasetAP): Promise<void>;
    readDatasetAFE(fromID: string): Promise<DatasetAFE>;
    /**
     * Writes DatasetAFE to DB at location (collection/table/file/...) toID.
     * @param toID
     * @param dataset
     */
    writeDatasetAFE(toID: string, dataset: DatasetAFE): Promise<void>;
    private read;
    /**
     * Writes a large (> 16 MB) obj to Database.
     * @see http://mongodb.github.io/node-mongodb-native/3.0/tutorials/gridfs/
     * @param obj
     * @param toID
     */
    writeLarge(obj: any, toID: string): Promise<unknown>;
    readLarge(fromID: string): Promise<any>;
    write(obj: any, toID: string, mode?: WriteMode): Promise<void>;
    writeMany(objs: any[], toID: string, mode?: WriteMode): Promise<void>;
    /**
     * Returns true if collection is empty. Logs error if error is set to true
     * @param toID
     * @param error
     * @private
     */
    private empty;
    /**
     * Set Methods to CommitPath-Objects as only DTOs are saved in database
     * @param commitPath
     * @private
     */
    private setMethods;
}
