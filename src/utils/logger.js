import winston from "winston"
import "winston-daily-rotate-file"

class Logger {
    constructor({
        moduleName="global",
        scopeName=""
    }={}) {
        this.moduleName = moduleName
        this.scopeName = scopeName
        this.level = (process.env.ENV === "development" ? "debug" : "info")

        // Instantiate base static logger
        if(!Logger.winstonLogger) {
            Logger.winstonLogger = new (winston.Logger)({
                transports: [
                    new (winston.transports.Console)({
                        level: this.level,
                        colorize: true,
                        timestamp: true,
                        handleExceptions: true,
                        humanReadableUnhandledException: true
                    }),
                    new (winston.transports.DailyRotateFile)({
                        name: "info",
                        filename: "logs/info.log",
                        level: "info",
                        datePattern: "yyyy-MM-dd.",
                        prepend: true
                    }),
                    new (winston.transports.DailyRotateFile)({
                        name: "error",
                        filename: "logs/error.log",
                        level: "error",
                        datePattern: "yyyy-MM-dd.",
                        prepend: true
                    })
                ]
            })
        }
    }

    // Private function.
    // @WARNING : This should not be used directly. 
    // Use the specific logging methods bellow.
    _log(level, message, rest) {
        Logger.winstonLogger.log(
            level, 
            `[${this.moduleName}] ${this.scopeName} : ${message}`,
            ...rest
        )
    }

    // Specific level log
    debug(message, ...rest) {this._log("debug", message, rest)}
    info(message, ...rest) {this._log("info", message, rest)}
    warning(message, ...rest) {this._log("warning", message, rest)}
    error(message, ...rest) {this._log("error", message, rest)}
}

// Logger factory
export default class LoggerFactory {
    constructor(moduleName) {
        this.moduleName = moduleName
    }

    create(scopeName) {
        return new Logger({
            moduleName: this.moduleName, 
            scopeName
        })
    }
}