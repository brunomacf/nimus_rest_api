import mkdirp from "mkdirp"
import path from "path"
import Server from "./src/server"

// Setup required dirs
mkdirp.sync(path.resolve(__dirname, "logs"))

// Instantiate the server
let server = new Server()
server.listen("3000")