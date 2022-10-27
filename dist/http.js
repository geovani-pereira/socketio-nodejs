"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require("dotenv/config");
var path_1 = __importDefault(require("path"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
var httpServer = http_1.createServer(app);
exports.httpServer = httpServer;
var io = new socket_io_1.Server(httpServer);
exports.io = io;
