"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
const server = new mcp_js_1.McpServer({
    name: "Echo",
    version: "1.0.0"
});
server.tool("echo", { message: zod_1.z.string() }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ message }) {
    return ({
        content: [{ type: "text", text: `Tool echo: ${message}` }]
    });
}));
const app = (0, express_1.default)();
let transport;
app.get("/sse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    transport = new sse_js_1.SSEServerTransport("/messages", res);
    yield server.connect(transport);
}));
app.post("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Note: to support multiple simultaneous connections, these messages will
    // need to be routed to a specific matching transport. (This logic isn't
    // implemented here, for simplicity.)
    yield transport.handlePostMessage(req, res);
}));
app.listen(3001);
