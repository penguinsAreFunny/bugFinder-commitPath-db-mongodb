import { MongoDBConfig } from "./mongoDBConfig";
import { DB } from "bugfinder-framework/dist/00-shared/db/DB";
import { CommitPath } from "bugfinder-localityrecorder-commitpath";
import { LocalityMap, DatasetAP, DatasetAFE } from "bugfinder-framework";
import { Logger } from "ts-logger";
export declare class CommitPathsMongoDB<Annotation, Quantification> implements DB<CommitPath, Annotation, Quantification> {
    dbConfig: MongoDBConfig;
    logger: Logger;
    /**
     *
     * @param dbConfig
     */
    constructor(dbConfig: MongoDBConfig);
    /**
     * Reads CommitPaths from DB configured with mongoDBConfig while considering this.pathsHandling-configuration
     */
    readLocalities(fromID: string, skip?: number, n?: number): Promise<CommitPath[]>;
    writeLocalities(localities: CommitPath[], toID: string): Promise<void>;
    readAnnotations(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Annotation>>;
    writeAnnotations(annotations: LocalityMap<CommitPath, Annotation>, toID: string): Promise<void>;
    readQuantifications(fromID: string, skip?: number, n?: number): Promise<LocalityMap<CommitPath, Quantification>>;
    writeQuantifications(quantifications: LocalityMap<CommitPath, Quantification>, toID: string): Promise<void>;
    readDatasetAP(fromID: string): Promise<DatasetAP>;
    writeDatasetAP(toID: string, dataset: DatasetAP): Promise<void>;
    readDatasetAFE(fromID: string): Promise<DatasetAFE>;
    writeDatasetAFE(toID: string, dataset: DatasetAFE): Promise<void>;
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
