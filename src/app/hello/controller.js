import LoggerFactory from "utils/logger"
import HelloSrv from "./service"

let Logger = new LoggerFactory("app.hello.controller")

export default class HelloController {
    constructor() {
        let logger = Logger.create("constructor")
        logger.info("enter")

        this.srv = new HelloSrv()
    }

    async hello(req, res) {
        let result, logger = Logger.create("hello")
        logger.info("enter")

        try {
            result = await this.srv.doSomethingAsync()
            logger.info("doSomethingAsync success", result)
        }
        catch(error) {
            logger.error("doSomethingAsync error", error)
            res.serverError(error)
        }

        res.success(result)
    }
}