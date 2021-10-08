import {FileAndConsoleLogger, LogConfig, SHARED_TYPES} from "bugfinder-framework";
import {sharedContainer} from "bugfinder-framework-defaultContainer";
import {Logger} from "ts-logger";

export * from "./mognoDB"
export * from "./TYPES"

const logOptions: LogConfig = {
    debugToConsole: true,
    errorToConsole: true,
    infoToConsole: true,
    traceToConsole: true,
    warnToConsole: true,
    logFile: "./log.txt",
}

sharedContainer.bind<Logger>(SHARED_TYPES.logger).to(FileAndConsoleLogger)
sharedContainer.bind<LogConfig>(SHARED_TYPES.logConfig).toConstantValue(logOptions)
