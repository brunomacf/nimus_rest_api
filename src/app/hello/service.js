import LoggerFactory from "utils/logger"
import Mongo from "utils/mongo"

// Instantiate a logger for this module
let Logger = new LoggerFactory("app.hello.service")

export default class Service {
    /**
     * This class function handles global service setup 
     * (database collection setup, for example)
     *
     * @WARNING : All service classes must implement a setup 
     * function. If this function is not required, then implement
     * a empty one.
     */
    static async setup(
        db=Mongo.db
    ) {
        // Local variables
        let logger = Logger.create("setup")
        logger.info("enter")

        // Try to create the collection
        try {
            await db.createCollection("hello")
            logger.info("collection create success")
        }
        catch(error) {
            logger.error("collection create error", error)
        }

        // Try to create index on nameId
        /*try {
            await collection.createIndex("nameId", {
                unique: true,
                background: true,
                w:1,
                //partialFilterExpression: { deletedAt: {$type: "null"} }
            })

            logger.info("collection createIndex on nameId success")
        }
        catch(error) {
            logger.error("collection createIndex on nameId error", error)
        }*/
    }

    constructor({
        db=Mongo.db
    }={}) {
        let logger = Logger.create("constructor")
        logger.info("enter")

        // Setup collection
        this.collection = db.collection("hello")
    }

    /**
     * This function do something
     */
    doSomethingAsync() {
        let logger = Logger.create("doSomethingAsync")
        logger.info("enter")

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({hello: "world"})
            }, 3000)
        })
    }
}