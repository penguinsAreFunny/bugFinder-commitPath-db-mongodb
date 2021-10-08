import { MongoDBConfig } from "./mongoDBConfig";
import { DB } from "bugfinder-framework/dist/00-shared/db/DB";
import { CommitPath } from "bugfinder-localityrecorder-commitpath";
import { LocalityMap, DatasetAP, DatasetAFE } from "bugfinder-framework";
import { Logger } from "ts-logger";
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
     */
    writeLocalities(localities: CommitPath[], toID: string, mode?: string): Promise<void>;
    readAnnotations(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Annotation>>;
    /**
     * Writes annotation to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param annotations
     * @param toID
     * @param mode
     */
    writeAnnotations(annotations: LocalityMap<CommitPath, Annotation>, toID: string, mode?: string): Promise<void>;
    readQuantifications(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Quantification>>;
    /**
     * Writes quantifications to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param quantifications
     * @param toID
     */
    writeQuantifications(quantifications: LocalityMap<CommitPath, Quantification>, toID: string, mode?: string): Promise<void>;
    readDatasetAP(fromID: string): Promise<DatasetAP>;
    /**
     * Writes DatasetAP to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param toID
     * @param dataset
     */
    writeDatasetAP(toID: string, dataset: DatasetAP, mode?: string): Promise<void>;
    readDatasetAFE(fromID: string): Promise<DatasetAFE>;
    /**
     * Writes DatasetAFE to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param toID
     * @param dataset
     */
    writeDatasetAFE(toID: string, dataset: DatasetAFE, mode?: string): Promise<void>;
    private read;
    write(obj: any, toID: string, mode?: string): Promise<void>;
    writeMany(objs: any[], toID: string, mode?: string): Promise<void>;
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
