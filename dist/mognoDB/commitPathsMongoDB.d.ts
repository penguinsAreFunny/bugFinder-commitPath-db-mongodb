import { MongoDBConfig } from "./mongoDBConfig";
import { DB } from "bugfinder-framework/dist/00-shared/db/DB";
import { CommitPath } from "bugfinder-localityrecorder-commitpath";
import { LocalityMap } from "bugfinder-framework";
export declare class CommitPathsMongoDB<Annotation, Quantification> implements DB<CommitPath, Annotation, Quantification> {
    dbConfig: MongoDBConfig;
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
    private read;
    write(obj: any, toID: string): Promise<void>;
    writeMany(objs: any[], toID: string): Promise<void>;
    /**
     * Set Methods to CommitPath-Objects as only DTOs are saved in database
     * @param commitPath
     * @private
     */
    private setMethods;
}
