# Description
This package is used as a DB for different phases of the machine learning pipeline of the
[bugfinder-framework](https://github.com/penguinsAreFunny/bugFinder-framework#readme) or 
([npm:bugfinder-framework](https://www.npmjs.com/package/bugfinder-framework)). You can read and write
CommitPaths as Localities, LocalityMaps of Annotations and LocalityMaps of Quantifications with this package to a MongoDB.
# Prerequisites
You need to begin with understanding the [bugfinder-framework](https://github.com/penguinsAreFunny/bugFinder-framework#readme)
and installing it:

    npm i bugfinder-framework
    
[MongoDB](https://www.mongodb.com/) installed. Used version:

    4.4.1 2008R2Plus SSL (64 bit)
    
[Optional] You might also want to install [MongoDB Compass](https://www.mongodb.com/products/compass)

# Usage
    npm i -D bugfinder-commitpath-db-mongodb
    
This package is not intended to be used independently, but feel free to do so.
It is used in its phases of the machine-learning-pipeline of the bugfinder-framework. 
inversify.config.ts
```
import path = require("path");
import {
    BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES, Commit, CommitRecorder, GitOptions
} from "bugfinder-localityrecorder-commit";
import {DB, LOCALITY_A_TYPES, LocalityRecorder} from "bugfinder-framework";
import {MongoDBConfig} from "bugfinder-commit-db-mongodb";
import {
    BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES,
    CommitPath,
    CommitPathRecorder
} from "bugfinder-localityrecorder-commitpath";
import {BUGFINDER_DB_COMMITPATH_MONGODB_TYPES, CommitPathsMongoDB} from "bugfinder-commitpath-db-mongodb";
import {localityAContainer} from "bugfinder-framework-defaultcontainer";

const container = localityAContainer;
const projectRoot: string = path.join(process.cwd(), "../repositories/TypeScript")

const gitOptions: GitOptions = {
    baseDir: projectRoot,
    maxConcurrentProcesses: 4
}

const mongoDBConfig: MongoDBConfig = {
    url: "mongodb://localhost:27017",
    dbName: "TEST"
}

// binding localityRecorder and its dependencies
container.bind<LocalityRecorder<CommitPath>>(LOCALITY_A_TYPES.localityRecorder).to(CommitPathRecorder)
container.bind<LocalityRecorder<Commit>>(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitRecorder).to(CommitRecorder)
// bindings used in CommitRecorder
container.bind<GitOptions>(BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitOptions).toConstantValue(gitOptions)

// binding db and its dependencies
container.bind<DB<CommitPath, any, any>>(LOCALITY_A_TYPES.db).to(CommitPathsMongoDB);
container.bind<MongoDBConfig>(BUGFINDER_DB_COMMITPATH_MONGODB_TYPES.mongoDBConfig).toConstantValue(mongoDBConfig);

export {container}
```
main.ts
```
import "reflect-metadata";
import {container} from "./inversify.config"
import {DB, LOCALITY_A_TYPES, LocalityRecorder} from "bugfinder-framework";
import {CommitPath} from "bugfinder-localityrecorder-commitpath";

async function topLevelAwaitWrapper() {
    const localityRecorder = container.get<LocalityRecorder<CommitPath>>(LOCALITY_A_TYPES.localityRecorder);
    const db = container.get<DB<CommitPath, any, any>>(LOCALITY_A_TYPES.db);
    const localities = await localityRecorder.getLocalities();
    await db.writeLocalities(localities, "CommitPaths");
}

topLevelAwaitWrapper();
```

