"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
var bugfinder_framework_1 = require("bugfinder-framework");
var bugfinder_framework_defaultContainer_1 = require("bugfinder-framework-defaultContainer");
__exportStar(require("./mognoDB"), exports);
__exportStar(require("./TYPES"), exports);
var logOptions = {
    debugToConsole: true,
    errorToConsole: true,
    infoToConsole: true,
    traceToConsole: true,
    warnToConsole: true,
    logFile: "./log.txt",
};
bugfinder_framework_defaultContainer_1.sharedContainer.bind(bugfinder_framework_1.SHARED_TYPES.logger).to(bugfinder_framework_1.FileAndConsoleLogger);
bugfinder_framework_defaultContainer_1.sharedContainer.bind(bugfinder_framework_1.SHARED_TYPES.logConfig).toConstantValue(logOptions);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkRBQWtGO0FBQ2xGLDZGQUFxRTtBQUdyRSw0Q0FBeUI7QUFDekIsMENBQXVCO0FBRXZCLElBQU0sVUFBVSxHQUFjO0lBQzFCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLE9BQU8sRUFBRSxXQUFXO0NBQ3ZCLENBQUE7QUFFRCxzREFBZSxDQUFDLElBQUksQ0FBUyxrQ0FBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQywwQ0FBb0IsQ0FBQyxDQUFBO0FBQzFFLHNEQUFlLENBQUMsSUFBSSxDQUFZLGtDQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFBIn0=