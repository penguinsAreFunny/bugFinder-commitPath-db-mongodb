"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitPathsMongoDB = void 0;
var inversify_1 = require("inversify");
var mongodb_1 = require("mongodb");
var bugfinder_localityrecorder_commitpath_1 = require("bugfinder-localityrecorder-commitpath");
var TYPES_1 = require("../TYPES");
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var bugfinder_framework_1 = require("bugfinder-framework");
var stream_1 = require("stream");
var COLLECTION_FILES_APPENDIX = ".files";
var COMMIT_LOCATION_PREFIX = "__COMMITS__";
var CommitPathsMongoDB = /** @class */ (function () {
    function CommitPathsMongoDB(logger, dbConfig) {
        this.logger = logger;
        this.dbConfig = dbConfig;
    }
    /**
     * Reads CommitPaths from DB configured with mongoDBConfig while considering this.pathsHandling-configuration
     */
    CommitPathsMongoDB.prototype.readLocalities = function (fromID, skip, n) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var commitPaths, commits;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Reading localities from collection " + fromID + " using database " + this.dbConfig.dbName + " " +
                            ("from " + this.dbConfig.url + "..."));
                        return [4 /*yield*/, this.read(fromID, skip, n)];
                    case 1:
                        commitPaths = _c.sent();
                        return [4 /*yield*/, this.read(COMMIT_LOCATION_PREFIX + fromID)];
                    case 2:
                        commits = _c.sent();
                        // apply prototype functions to DTO
                        commits.forEach(function (commit) {
                            bugfinder_localityrecorder_commit_1.Commit.prototype.setMethods(commit);
                        });
                        commitPaths.forEach(function (commitPath) {
                            bugfinder_localityrecorder_commitpath_1.CommitPath.prototype.setMethods(commitPath);
                        });
                        // set all commits in CommitPath
                        commits.forEach(function (commit) {
                            bugfinder_localityrecorder_commitpath_1.CommitPath.pushCommit(commit);
                        });
                        (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info("Found " + commitPaths.length + " localities in database");
                        return [2 /*return*/, commitPaths];
                }
            });
        });
    };
    /**
     * Writes localities to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param localities
     * @param toID
     * @param mode
     */
    CommitPathsMongoDB.prototype.writeLocalities = function (localities, toID, mode) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Writing " + localities.length + " localities to collection " + toID + " into database...");
                        // normalize CommitPath into 2 collections: Commit, CommitPath
                        return [4 /*yield*/, this.writeMany(bugfinder_localityrecorder_commitpath_1.CommitPath.getCommits(localities), COMMIT_LOCATION_PREFIX + toID, mode)];
                    case 1:
                        // normalize CommitPath into 2 collections: Commit, CommitPath
                        _b.sent();
                        return [4 /*yield*/, this.writeMany(localities, toID, mode)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.readAnnotations = function (fromID, skip, n) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var commits, annotations, locMap;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Reading annotations from collection " + fromID + " using database " + this.dbConfig.dbName + " " +
                            ("from " + this.dbConfig.url + "..."));
                        return [4 /*yield*/, this.read(COMMIT_LOCATION_PREFIX + fromID)];
                    case 1:
                        commits = _c.sent();
                        return [4 /*yield*/, this.read(fromID, skip, n)];
                    case 2:
                        annotations = _c.sent();
                        commits.forEach(function (commit) {
                            bugfinder_localityrecorder_commit_1.Commit.prototype.setMethods(commit);
                        });
                        annotations.forEach(function (annotation) {
                            var commitPath = annotation.key;
                            bugfinder_localityrecorder_commitpath_1.CommitPath.prototype.setMethods(commitPath);
                        });
                        commits.forEach(function (commit) {
                            bugfinder_localityrecorder_commitpath_1.CommitPath.pushCommit(commit);
                        });
                        locMap = new bugfinder_framework_1.LocalityMap();
                        locMap.fromArray(annotations);
                        (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info("Found " + annotations.length + " annotations in database");
                        return [2 /*return*/, locMap];
                }
            });
        });
    };
    /**
     * Writes annotation to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param annotations
     * @param toID
     * @param mode
     */
    CommitPathsMongoDB.prototype.writeAnnotations = function (annotations, toID, mode) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var annosArray, cps, normalizedCPs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Writing " + annotations.size() + " annotations to collection " + toID + " using database " +
                            (this.dbConfig.dbName + " from " + this.dbConfig.url + "..."));
                        annosArray = annotations.toArray();
                        cps = annosArray.map(function (el) {
                            return el.key;
                        });
                        normalizedCPs = bugfinder_localityrecorder_commitpath_1.CommitPath.normalize(cps);
                        return [4 /*yield*/, this.writeMany(normalizedCPs.commits, COMMIT_LOCATION_PREFIX + toID, mode)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.writeMany(annosArray, toID, mode)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.readQuantifications = function (fromID, skip, n) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var commits, quantifications, locMap;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Reading quantifications from collection " + fromID + " using database " + this.dbConfig.dbName + " " +
                            ("from " + this.dbConfig.url + "..."));
                        return [4 /*yield*/, this.read(COMMIT_LOCATION_PREFIX + fromID)];
                    case 1:
                        commits = _c.sent();
                        return [4 /*yield*/, this.read(fromID, skip, n)];
                    case 2:
                        quantifications = _c.sent();
                        commits.forEach(function (commit) {
                            bugfinder_localityrecorder_commit_1.Commit.prototype.setMethods(commit);
                        });
                        quantifications.forEach(function (quantification) {
                            var commitPath = quantification.key;
                            bugfinder_localityrecorder_commitpath_1.CommitPath.prototype.setMethods(commitPath);
                        });
                        commits.forEach(function (commit) {
                            bugfinder_localityrecorder_commitpath_1.CommitPath.pushCommit(commit);
                        });
                        locMap = new bugfinder_framework_1.LocalityMap();
                        locMap.fromArray(quantifications);
                        (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info("Found " + quantifications.length + " quantifications in database");
                        return [2 /*return*/, locMap];
                }
            });
        });
    };
    /**
     * Writes quantifications to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param quantifications
     * @param toID
     * @param mode
     */
    CommitPathsMongoDB.prototype.writeQuantifications = function (quantifications, toID, mode) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var quantiArray, cps, normalizedCPs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Writing " + quantifications.size() + " quantifications to collection " + toID + " using database " +
                            (this.dbConfig.dbName + " from " + this.dbConfig.url + "..."));
                        quantiArray = quantifications.toArray();
                        cps = quantiArray.map(function (el) {
                            return el.key;
                        });
                        normalizedCPs = bugfinder_localityrecorder_commitpath_1.CommitPath.normalize(cps);
                        return [4 /*yield*/, this.writeMany(normalizedCPs.commits, COMMIT_LOCATION_PREFIX + toID, mode)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.writeMany(quantiArray, toID, mode)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.readDatasetAP = function (fromID) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Reading datasetAP from collection " + fromID + " using database " + this.dbConfig.dbName + " " +
                            ("from " + this.dbConfig.url + "..."));
                        return [4 /*yield*/, this.readLarge(fromID)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     * Writes DatasetAP to DB at location (collection/table/file/...) toID.
     * @param toID
     * @param dataset
     * @param mode
     */
    CommitPathsMongoDB.prototype.writeDatasetAP = function (toID, dataset) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Writing datasetAP to collection " + toID + " using database " +
                            (this.dbConfig.dbName + " from " + this.dbConfig.url + "..."));
                        return [4 /*yield*/, this.empty(toID + COLLECTION_FILES_APPENDIX, true)];
                    case 1:
                        if (!(_b.sent()))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.writeLarge(dataset, toID)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.readDatasetAFE = function (fromID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readLarge(fromID)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Writes DatasetAFE to DB at location (collection/table/file/...) toID.
     * @param toID
     * @param dataset
     */
    CommitPathsMongoDB.prototype.writeDatasetAFE = function (toID, dataset) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Writing datasetAFE to collection " + toID + " using database " +
                            (this.dbConfig.dbName + " from " + this.dbConfig.url + "..."));
                        return [4 /*yield*/, this.empty(toID + COLLECTION_FILES_APPENDIX, true)];
                    case 1:
                        if (!(_b.sent()))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.writeLarge(dataset, toID)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.read = function (fromID, skip, n) {
        return __awaiter(this, void 0, void 0, function () {
            var client, db, collectionName, collection, dbContent, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url)];
                    case 1:
                        client = _b.sent();
                        db = client.db(this.dbConfig.dbName);
                        collectionName = fromID;
                        collection = db.collection(collectionName);
                        if (!(skip == null && n == null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, collection.find({}).toArray()];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, collection.find({}).skip(skip).limit(n).toArray()
                        // @formatter:on
                    ];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        dbContent = _a;
                        // @formatter:on
                        return [4 /*yield*/, client.close()];
                    case 6:
                        // @formatter:on
                        _b.sent();
                        return [2 /*return*/, dbContent];
                }
            });
        });
    };
    /**
     * Writes a large (> 16 MB) obj to Database.
     * @see http://mongodb.github.io/node-mongodb-native/3.0/tutorials/gridfs/
     * @param obj
     * @param toID
     */
    CommitPathsMongoDB.prototype.writeLarge = function (obj, toID) {
        return __awaiter(this, void 0, void 0, function () {
            var client, db, readable, bucket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url)];
                    case 1:
                        client = _a.sent();
                        db = client.db(this.dbConfig.dbName);
                        readable = stream_1.Readable.from(JSON.stringify(obj));
                        bucket = new mongodb_1.GridFSBucket(db, { bucketName: toID });
                        console.log("Writing to db");
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                readable.pipe(bucket.openUploadStream(toID))
                                    .on('finish', function () {
                                    console.log('done!');
                                    client.close();
                                    resolve(true);
                                })
                                    .on("error", function (error) {
                                    reject(error);
                                });
                            })];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.readLarge = function (fromID) {
        return __awaiter(this, void 0, void 0, function () {
            var client, db, bucket, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url)];
                    case 1:
                        client = _a.sent();
                        db = client.db(this.dbConfig.dbName);
                        bucket = new mongodb_1.GridFSBucket(db, { bucketName: fromID });
                        stream = bucket.openDownloadStreamByName(fromID);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var chunks = [];
                                stream.on("data", function (data) {
                                    chunks.push(data);
                                });
                                stream.on("end", function () {
                                    var data = Buffer.concat(chunks);
                                    var dataset = JSON.parse(data.toString("utf-8"));
                                    client.close();
                                    resolve(dataset);
                                });
                                stream.on("error", function (err) {
                                    reject(err);
                                });
                                stream.read();
                            })];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.write = function (obj, toID, mode) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var emptyCol, client, db, collectionName, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (mode == null)
                            mode = bugfinder_framework_1.WriteMode.write;
                        if (!(mode != bugfinder_framework_1.WriteMode.append)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.empty(toID, true)];
                    case 1:
                        emptyCol = _b.sent();
                        if (!emptyCol) {
                            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.warn("Collection " + toID + " is not empty. Not writing to Database." +
                                "Consider using DB.write with WriteMode.append to write to not empty collection");
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2: return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url)];
                    case 3:
                        client = _b.sent();
                        db = client.db(this.dbConfig.dbName);
                        collectionName = toID;
                        collection = db.collection(collectionName);
                        // @formatter:on
                        return [4 /*yield*/, collection.insertOne(obj)];
                    case 4:
                        // @formatter:on
                        _b.sent();
                        return [4 /*yield*/, client.close()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.writeMany = function (objs, toID, mode) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var emptyCol, client, db, collectionName, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (mode == null)
                            mode = bugfinder_framework_1.WriteMode.write;
                        if (!(mode != bugfinder_framework_1.WriteMode.append)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.empty(toID, true)];
                    case 1:
                        emptyCol = _b.sent();
                        if (!emptyCol) {
                            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.warn("Collection " + toID + " is not empty. Not writing to Database." +
                                "Consider using DB.write with WriteMode.append to write to not empty collection");
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2: return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url)];
                    case 3:
                        client = _b.sent();
                        db = client.db(this.dbConfig.dbName);
                        collectionName = toID;
                        collection = db.collection(collectionName);
                        // @formatter:on
                        return [4 /*yield*/, collection.insertMany(objs)];
                    case 4:
                        // @formatter:on
                        _b.sent();
                        return [4 /*yield*/, client.close()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns true if collection is empty. Logs error if error is set to true
     * @param toID
     * @param error
     * @private
     */
    CommitPathsMongoDB.prototype.empty = function (toID, error) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var elementsInCollection, numberElInCol;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.read(toID)];
                    case 1:
                        elementsInCollection = _b.sent();
                        numberElInCol = elementsInCollection.length;
                        console.log("JUP", numberElInCol, " ", toID);
                        if (numberElInCol > 0) {
                            if (error) {
                                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error("Found " + numberElInCol + " elements in database collection " + toID + ".\n                Database collection commits should be empty! Aborting Writing to DB. Please delete all elements \n                in collection " + toID + " to prevent redundancy.");
                            }
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Set Methods to CommitPath-Objects as only DTOs are saved in database
     * @param commitPath
     * @private
     */
    CommitPathsMongoDB.prototype.setMethods = function (commitPath) {
        // TODO: implement generic method of this. Changes to CommitPath should not affect this method!
        commitPath.key = bugfinder_localityrecorder_commitpath_1.CommitPath.prototype.key;
        commitPath.is = bugfinder_localityrecorder_commitpath_1.CommitPath.prototype.is;
    };
    CommitPathsMongoDB = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(bugfinder_framework_1.SHARED_TYPES.logger)),
        __param(1, (0, inversify_1.inject)(TYPES_1.BUGFINDER_DB_COMMITPATH_MONGODB_TYPES.mongoDBConfig)),
        __metadata("design:paramtypes", [Object, Object])
    ], CommitPathsMongoDB);
    return CommitPathsMongoDB;
}());
exports.CommitPathsMongoDB = CommitPathsMongoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aHNNb25nb0RCLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZ25vREIvY29tbWl0UGF0aHNNb25nb0RCLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUE2QztBQUM3QyxtQ0FBa0Q7QUFFbEQsK0ZBQWlFO0FBQ2pFLGtDQUErRDtBQUMvRCx1RkFBeUQ7QUFDekQsMkRBQW9HO0FBRXBHLGlDQUFnQztBQUVoQyxJQUFNLHlCQUF5QixHQUFHLFFBQVEsQ0FBQTtBQUMxQyxJQUFNLHNCQUFzQixHQUFHLGFBQWEsQ0FBQztBQUc3QztJQUVJLDRCQUFpRCxNQUFjLEVBQ2lCLFFBQXVCO1FBRHRELFdBQU0sR0FBTixNQUFNLENBQVE7UUFDaUIsYUFBUSxHQUFSLFFBQVEsQ0FBZTtJQUN2RyxDQUFDO0lBRUQ7O09BRUc7SUFDRywyQ0FBYyxHQUFwQixVQUFxQixNQUFjLEVBQUUsSUFBYSxFQUFFLENBQVU7Ozs7Ozs7d0JBQzFELE1BQUEsSUFBSSxDQUFDLE1BQU0sMENBQUUsSUFBSSxDQUFDLHdDQUFzQyxNQUFNLHdCQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sTUFBRzs2QkFDcEcsVUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBSyxDQUFBLENBQUMsQ0FBQTt3QkFFRCxxQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUE7O3dCQUE1RCxXQUFXLEdBQWlCLFNBQWdDO3dCQUN4QyxxQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxFQUFBOzt3QkFBcEUsT0FBTyxHQUFhLFNBQWdEO3dCQUUxRSxtQ0FBbUM7d0JBQ25DLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNOzRCQUNsQiwwQ0FBTSxDQUFD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