"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
const database_1 = __importDefault(require("./utils/database"));
dotenv_1.default.config();
async function init() {
    try {
        const dbConnection = await (0, database_1.default)();
        console.log(`Database status: ${dbConnection}`);
        const app = (0, express_1.default)();
        const PORT = process.env.PORT;
        app.use((0, cors_1.default)());
        app.use((0, compression_1.default)());
        app.use(express_1.default.json({ limit: "1mb" }));
        app.use("/api", api_1.default);
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        console.log(error);
    }
}
init();
