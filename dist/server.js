"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var http_1 = require("./http");
require("./websocket");
//app.listen(process.env.PORT,()=>console.log(`Servidor rodando na porta ${process.env.PORT}`))
http_1.httpServer.listen(process.env.PORT, function () { return console.log("Servidor rodando na porta " + process.env.PORT); });
