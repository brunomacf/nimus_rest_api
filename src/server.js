import express from "express"
import lodash from "lodash"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import methodOverride from "method-override"
import config from "common-config"
import LoggerFactory from "utils/logger"
import Mongo from "utils/mongo"

// Services
import HelloSrv from "app/hello/service"

// Logger
let Logger = new LoggerFactory("server")

/**
 * Server class
 */
class Server {

    /**
     * Construct an instance.
     * @constructor
     */
    constructor() {
        let logger = Logger.create("constructor")
        logger.info("enter")

        /** @private */
        this.app = express()

        this.init()
    }

    /**
     * This function initializes the server (calling setup functions)
     */
    async init() {
        await this.setupDatabases()
        await this.setupServices()

        this.setupExpressApp()
        this.setupRoutes()
    }

    /**
     * This function opens an setup connection with databases.
     */
    async setupDatabases() {
        let logger = Logger.create("setupDatabases")
        logger.info("enter")

        await Mongo.connect(config.db.mongo.url, {shared: true})
    }

    /**
     * This function setup all module services, which includes
     * config database collections and stuff.
     */
    async setupServices() {
        let logger = Logger.create("setupServices")
        logger.info("enter")

        return await Promise.all([
            HelloSrv.setup()
        ])
    }

    /**
     * This function setup default middlewares for express.
     */
    setupExpressApp() {
        // Method override (to enable CORS)
        this.app.use(methodOverride())

        // Set headers (enable CORS)
        this.app.use(function(req, res, next) {
            // @TODO : strict allowed origins
            res.header("Access-Control-Allow-Origin", req.headers.origin)
            res.header("Access-Control-Allow-Credentials", true)
            res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
            res.header("Access-Control-Allow-Headers", "Keep-Alive,User-Agent,Cache-Control,Content-Type,Authorization")

            // intercept OPTIONS method
            if ("OPTIONS" == req.method) { res.sendStatus(200) }
            else { next() }
        })

        // Setup a middleware to parse the request"s body.
        this.app.use(bodyParser.urlencoded({extended: true}))

        // Setup a middleware to parse body json.
        this.app.use(bodyParser.json({
            limit: "1mb"
        }))

        // Setup a middleware to parse cookies on request.
        this.app.use(cookieParser(config.secrets.cookie))

        // Log the request
        this.app.use(function(req, res, next) {
            let logger = Logger.create("constructor")
            
            logger.info("enter", {
                method: req.method,
                protocol: req.protocol,
                originalUrl: req.originalUrl,
                hostname: req.hostname,
                ip: req.ip
            })

            next()
        })

        // Normalize responses
        this.app.use(function(req, res, next) {
            res.badRequest = function(message) {
                res.status(400).json({message: message})
            }

            res.unauthorized = function(message) {
                res.status(401).json({message: message})
            }

            res.forbidden = function(message) {
                res.status(403).json({message: message})
            }

            res.notFound = function(message) {
                res.status(404).json({message: message})
            }

            res.serverError = function(error) {
                res.status(500).json(error)
            }

            res.success = function(data, opts={}) {
                let sendObj = lodash.isArray(data)?
                    {results: lodash.map(data, (item) => {return !lodash.isNull(item) ? item : undefined})} : 
                    {result: lodash.isObject(data)?lodash.omitBy(data, lodash.isNull):data}

                sendObj = Object.assign({}, opts, sendObj)

                res.status(200).json(sendObj)
            }

            next()
        })
    }

    setupRoutes() {
        this.app.use("/hello", require("app/hello")())
    }

    listen(port=config.port) {
        let logger = Logger.create("listen")

        this.app.listen(port, () => {
            logger.info("app listening", {port})
        })
    }
}

// Export
export default Server