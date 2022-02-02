require("dotenv").config();

let http = require("http")
let express = require("express")
let bodyParser = require("body-parser")
let cors = require("cors");

import { process_entry_file } from "./src/file";

const app = express();
const jsonParser = bodyParser.json();
const port = process.env.PORT || 3335;

const server = http.createServer(app);

app.use(cors());

/**
 * Rota padrão.
 */
app.get("/", jsonParser, (req, res) => {
    return res.send("Backend Trabalho IA - 01");
});

/**
 * Rota para leitura do arquivo de entrada.
 */
app.post("/read-file", jsonParser, (req, res) => {
    try {
        return res.status(200).send(process_entry_file(req.body.file_content, req.body.file_content_h));
    } catch (error) {
        console.log(error);
        return res.status(400);
    }
})

/**
 * Server listener.
 */
server.listen(port, () => {
    console.log(`...\n...\n\tServer running at port ${port}\n...\n...`);
});