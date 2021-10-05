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
var COMMIT_LOCATION_PREFIX = "__COMMITS__";
var CommitPathsMongoDB = /** @class */ (function () {
    /**
     *
     * @param dbConfig
     */
    function CommitPathsMongoDB(dbConfig) {
        this.dbConfig = dbConfig;
    }
    /**
     * Reads CommitPaths from DB configured with mongoDBConfig while considering this.pathsHandling-configuration
     */
    CommitPathsMongoDB.prototype.readLocalities = function (fromID, skip, n) {
        return __awaiter(this, void 0, void 0, function () {
            var commitPaths, commits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Reading localities from collection " + fromID + " using database " + this.dbConfig.dbName + " " +
                            ("from " + this.dbConfig.url + "..."));
                        return [4 /*yield*/, this.read(fromID, skip, n)];
                    case 1:
                        commitPaths = _a.sent();
                        return [4 /*yield*/, this.read(COMMIT_LOCATION_PREFIX + fromID)];
                    case 2:
                        commits = _a.sent();
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
                        console.log("Found " + commitPaths.length + " localities in database");
                        return [2 /*return*/, commitPaths];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.writeLocalities = function (localities, toID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Writing " + localities.length + " localities to collection " + toID + " into database...");
                        // normalize CommitPath into 2 collections: Commit, CommitPath
                        return [4 /*yield*/, this.writeMany(bugfinder_localityrecorder_commitpath_1.CommitPath.getCommits(localities), COMMIT_LOCATION_PREFIX + toID)];
                    case 1:
                        // normalize CommitPath into 2 collections: Commit, CommitPath
                        _a.sent();
                        return [4 /*yield*/, this.writeMany(localities, toID)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.readAnnotations = function (fromID, skip, n) {
        return __awaiter(this, void 0, void 0, function () {
            var commits, annotations, locMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Reading annotations from collection " + fromID + " using database " + this.dbConfig.dbName + " " +
                            ("from " + this.dbConfig.url + "..."));
                        return [4 /*yield*/, this.read(COMMIT_LOCATION_PREFIX + fromID)];
                    case 1:
                        commits = _a.sent();
                        return [4 /*yield*/, this.read(fromID, skip, n)];
                    case 2:
                        annotations = _a.sent();
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
                        console.log("Found " + annotations.length + " annotations in database");
                        return [2 /*return*/, locMap];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.writeAnnotations = function (annotations, toID) {
        return __awaiter(this, void 0, void 0, function () {
            var annosArray, cps, normalizedCPs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Writing " + annotations.size() + " annotations to collection " + toID + " using database " +
                            (this.dbConfig.dbName + " from " + this.dbConfig.url + "..."));
                        annosArray = annotations.toArray();
                        cps = annosArray.map(function (el) {
                            return el.key;
                        });
                        normalizedCPs = bugfinder_localityrecorder_commitpath_1.CommitPath.normalize(cps);
                        return [4 /*yield*/, this.writeMany(normalizedCPs.commits, COMMIT_LOCATION_PREFIX + toID)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.writeMany(annosArray, toID)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.readQuantifications = function (fromID, skip, n) {
        return __awaiter(this, void 0, void 0, function () {
            var commits, quantifications, locMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Reading quantifications from collection " + fromID + " using database " + this.dbConfig.dbName + " " +
                            ("from " + this.dbConfig.url + "..."));
                        return [4 /*yield*/, this.read(COMMIT_LOCATION_PREFIX + fromID)];
                    case 1:
                        commits = _a.sent();
                        return [4 /*yield*/, this.read(fromID, skip, n)];
                    case 2:
                        quantifications = _a.sent();
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
                        console.log("Found " + quantifications.length + " quantifications in database");
                        return [2 /*return*/, locMap];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.writeQuantifications = function (quantifications, toID) {
        return __awaiter(this, void 0, void 0, function () {
            var quantiArray, cps, normalizedCPs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Writing " + quantifications.size() + " quantifications to collection " + toID + " using database " +
                            (this.dbConfig.dbName + " from " + this.dbConfig.url + "..."));
                        quantiArray = quantifications.toArray();
                        cps = quantiArray.map(function (el) {
                            return el.key;
                        });
                        normalizedCPs = bugfinder_localityrecorder_commitpath_1.CommitPath.normalize(cps);
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
                        return [4 /*yield*/, this.writeMany(normalizedCPs.commits, COMMIT_LOCATION_PREFIX + toID)];
                    case 1:
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
                        _a.sent();
                        return [4 /*yield*/, this.writeMany(quantiArray, toID)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.readDataset = function (fromID) {
        return __awaiter(this, void 0, void 0, function () {
            var dataset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.read(fromID)];
                    case 1:
                        dataset = (_a.sent())[0];
                        return [2 /*return*/, dataset[0]];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.writeDataset = function (toID, dataset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.write(dataset, toID)];
                    case 1:
                        _a.sent();
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
                    case 0: return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url, { useUnifiedTopology: true })];
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
    CommitPathsMongoDB.prototype.write = function (obj, toID) {
        return __awaiter(this, void 0, void 0, function () {
            var elementsInCollection, err, client, db, collectionName, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.read(toID)];
                    case 1:
                        elementsInCollection = _a.sent();
                        if (elementsInCollection.length > 0) {
                            err = new mongodb_1.MongoError("Found " + elementsInCollection.length + " elements in database collection " + toID + ".\n                Database collection commits should be empty! Aborting Writing to DB. Please delete all elements \n                in collection " + toID + " to prevent redundancy.");
                            throw (err);
                        }
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url, { useUnifiedTopology: true })];
                    case 2:
                        client = _a.sent();
                        db = client.db(this.dbConfig.dbName);
                        collectionName = toID;
                        collection = db.collection(collectionName);
                        // @formatter:on
                        return [4 /*yield*/, collection.insertOne(obj)];
                    case 3:
                        // @formatter:on
                        _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.writeMany = function (objs, toID) {
        return __awaiter(this, void 0, void 0, function () {
            var elementsInCollection, err, client, db, collectionName, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.read(toID)];
                    case 1:
                        elementsInCollection = _a.sent();
                        if (elementsInCollection.length > 0) {
                            err = new mongodb_1.MongoError("Found " + elementsInCollection.length + " elements in database collection " + toID + ".\n                Database collection commits should be empty! Aborting Writing to DB. Please delete all elements \n                in collection " + toID + " to prevent redundancy.");
                            throw (err);
                        }
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url, { useUnifiedTopology: true })];
                    case 2:
                        client = _a.sent();
                        db = client.db(this.dbConfig.dbName);
                        collectionName = toID;
                        collection = db.collection(collectionName);
                        // @formatter:on
                        return [4 /*yield*/, collection.insertMany(objs)];
                    case 3:
                        // @formatter:on
                        _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
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
        // TODO iterate over all method-attributes and set the right prototypes (generic) => if you add CommitPath Methods this
        // TODO function should still work finde
        // TODO: delete me
        commitPath.key = bugfinder_localityrecorder_commitpath_1.CommitPath.prototype.key;
        commitPath.is = bugfinder_localityrecorder_commitpath_1.CommitPath.prototype.is;
    };
    CommitPathsMongoDB = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(TYPES_1.BUGFINDER_DB_COMMITPATH_MONGODB_TYPES.mongoDBConfig)),
        __metadata("design:paramtypes", [Object])
    ], CommitPathsMongoDB);
    return CommitPathsMongoDB;
}());
exports.CommitPathsMongoDB = CommitPathsMongoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aHNNb25nb0RCLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZ25vREIvY29tbWl0UGF0aHNNb25nb0RCLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUE2QztBQUM3QyxtQ0FBZ0Q7QUFHaEQsK0ZBQWlFO0FBQ2pFLGtDQUErRDtBQUMvRCx1RkFBeUQ7QUFDekQsMkRBQXlEO0FBRXpELElBQU0sc0JBQXNCLEdBQUcsYUFBYSxDQUFDO0FBRzdDO0lBRUk7OztPQUdHO0lBQ0gsNEJBQWdGLFFBQXVCO1FBQXZCLGFBQVEsR0FBUixRQUFRLENBQWU7SUFDdkcsQ0FBQztJQUVEOztPQUVHO0lBQ0csMkNBQWMsR0FBcEIsVUFBcUIsTUFBYyxFQUFFLElBQWEsRUFBRSxDQUFVOzs7Ozs7d0JBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXNDLE1BQU0sd0JBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxNQUFHOzZCQUM5RixVQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFLLENBQUEsQ0FBQyxDQUFBO3dCQUVELHFCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBQTs7d0JBQTVELFdBQVcsR0FBaUIsU0FBZ0M7d0JBQ3hDLHFCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLEVBQUE7O3dCQUFwRSxPQUFPLEdBQWEsU0FBZ0Q7d0JBRTFFLG1DQUFtQzt3QkFDbkMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07NEJBQ2xCLDBDQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDeEMsQ0FBQyxDQUFDLENBQUE7d0JBRUYsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFB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