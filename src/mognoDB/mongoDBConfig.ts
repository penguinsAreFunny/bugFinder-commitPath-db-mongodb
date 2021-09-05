export interface MongoDBConfig {
    /**
     * URL of the mongodb
     * Example: mongodb://localhost:27017
     */
    url: string;

    /**
     * Name of the database under the url @MongoDBConfig.URL to operate on
     */
    dbName: string;
}
