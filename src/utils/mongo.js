import MongoClient from "mongodb"
import LoggerFactory from "utils/logger"

let Logger = new LoggerFactory("mongo")

export default class Mongo {

    // Static properties
    static ObjectID = MongoClient.ObjectID;

    /**
     * This function creates a connection to a remote mongo database.
     * 
     * @param {String} url Database url
     */
    static async connect(url="mongodb://localhost:27017", {
        shared=false,
        opts={}
    }={}) {
        let db, logger = Logger.create("connect")
        logger.info("enter", {url})

        try {
            db = await MongoClient.connect(url, opts)
            logger.info("mongo client connect success")
        }
        catch(error) {
            logger.error("mongo client connect error", error)
        }

        // Set as shared
        if(shared) {Mongo.db = db}

        return db
    }
}