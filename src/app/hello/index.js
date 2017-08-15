import express from "express"
import Ctrl from "./controller"

export default function() {
    let router = new express.Router()
    let ctrl = new Ctrl()

    /**
     * Config router
     */
    router.get("/", ctrl.hello)

    return router
}