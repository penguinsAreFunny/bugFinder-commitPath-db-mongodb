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
var DB_1 = require("bugfinder-framework/dist/00-shared/db/DB");
var bugfinder_localityrecorder_commitpath_1 = require("bugfinder-localityrecorder-commitpath");
var TYPES_1 = require("../TYPES");
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var bugfinder_framework_1 = require("bugfinder-framework");
var ts_logger_1 = require("ts-logger");
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
    /**
     * Writes DatasetAP to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param toID
     * @param dataset
     * @param mode
     */
    CommitPathsMongoDB.prototype.writeDatasetAP = function (toID, dataset, mode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.write(dataset, toID, mode)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitPathsMongoDB.prototype.readDatasetAFE = function (fromID) {
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
    /**
     * Writes DatasetAFE to DB at location (collection/table/file/...) toID. With mode = "a" data will be appended.
     * @param toID
     * @param dataset
     * @param mode
     */
    CommitPathsMongoDB.prototype.writeDatasetAFE = function (toID, dataset, mode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.write(dataset, toID, mode)];
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
    CommitPathsMongoDB.prototype.write = function (obj, toID, mode) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var emptyCol, client, db, collectionName, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (mode == null)
                            mode = DB_1.WriteMode.write;
                        if (!(mode != DB_1.WriteMode.append)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.empty(toID, true)];
                    case 1:
                        emptyCol = _b.sent();
                        if (!emptyCol) {
                            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.warn("Collection " + toID + " is not empty. Not writing to Database." +
                                "Consider using DB.write with WriteMode.append to write to not empty collection");
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2: return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url, { useUnifiedTopology: true })];
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
                            mode = DB_1.WriteMode.write;
                        if (!(mode != DB_1.WriteMode.append)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.empty(toID, true)];
                    case 1:
                        emptyCol = _b.sent();
                        if (!emptyCol) {
                            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.warn("Collection " + toID + " is not empty. Not writing to Database." +
                                "Consider using DB.write with WriteMode.append to write to not empty collection");
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2: return [4 /*yield*/, mongodb_1.MongoClient.connect(this.dbConfig.url, { useUnifiedTopology: true })];
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
    var _a;
    CommitPathsMongoDB = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(bugfinder_framework_1.SHARED_TYPES.logger)),
        __param(1, (0, inversify_1.inject)(TYPES_1.BUGFINDER_DB_COMMITPATH_MONGODB_TYPES.mongoDBConfig)),
        __metadata("design:paramtypes", [typeof (_a = typeof ts_logger_1.Logger !== "undefined" && ts_logger_1.Logger) === "function" ? _a : Object, Object])
    ], CommitPathsMongoDB);
    return CommitPathsMongoDB;
}());
exports.CommitPathsMongoDB = CommitPathsMongoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aHNNb25nb0RCLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZ25vREIvY29tbWl0UGF0aHNNb25nb0RCLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUE2QztBQUM3QyxtQ0FBb0M7QUFFcEMsK0RBQXVFO0FBQ3ZFLCtGQUFpRTtBQUNqRSxrQ0FBK0Q7QUFDL0QsdUZBQXlEO0FBQ3pELDJEQUFxRjtBQUNyRix1Q0FBZ0M7QUFFaEMsSUFBTSxzQkFBc0IsR0FBRyxhQUFhLENBQUM7QUFHN0M7SUFFSSw0QkFBaUQsTUFBYyxFQUNpQixRQUF1QjtRQUR0RCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2lCLGFBQVEsR0FBUixRQUFRLENBQWU7SUFDdkcsQ0FBQztJQUVEOztPQUVHO0lBQ0csMkNBQWMsR0FBcEIsVUFBcUIsTUFBYyxFQUFFLElBQWEsRUFBRSxDQUFVOzs7Ozs7O3dCQUMxRCxNQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLElBQUksQ0FBQyx3Q0FBc0MsTUFBTSx3QkFBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLE1BQUc7NkJBQ3BHLFVBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQUssQ0FBQSxDQUFDLENBQUE7d0JBRUQscUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFBOzt3QkFBNUQsV0FBVyxHQUFpQixTQUFnQzt3QkFDeEMscUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLENBQUMsRUFBQTs7d0JBQXBFLE9BQU8sR0FBYSxTQUFnRDt3QkFFMUUsbUNBQW1DO3dCQUNuQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTs0QkFDbEIsMENBQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFD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