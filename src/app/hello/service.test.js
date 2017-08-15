/* global describe,before,after,it */

import chai from "chai"
import chaiAsPromised from "chai-as-promised"
import config from "common-config"
import Mongo from "utils/mongo"
import LoggerFactory from "utils/logger"
import Srv from "./service"
//import types from "./types"

// Setup chai
chai.should()
chai.use(chaiAsPromised)

// Instantiate the logger
let Logger = new LoggerFactory("hello service tests")

describe("hello service tests", function() {
    let db, srv

    // Initilize test environment.
    before(async function(){
        let logger = Logger.create("before")
        logger.info("enter")

        // Connect mongo
        db = await Mongo.connect(config.db.mongo.url)
        
        // Setup service
        await Srv.setup(db)

        // Instantiate the service
        srv = new Srv({db})
    })

    // Finalize test environment.
    after(function(done) {
        let logger = Logger.create("after")
        logger.info("enter")

        // Close database connection.
        db.close(done)
    })

    describe("doSomethingAsync function", function() {
        it("should return hello world", function() {
            return srv.doSomethingAsync()
                .should.be.fulfilled    // .should.be.rejected
                .and.should.eventually.be.an("object")
                .and.eventually.have.property("hello", "world")
        })
    })
})
