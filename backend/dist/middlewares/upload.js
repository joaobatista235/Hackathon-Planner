"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const UPLOAD_DIR = path_1.default.resolve(process.cwd(), "uploads");
// Ensure uploads directory exists
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${(0, crypto_1.randomUUID)()}${ext}`);
    },
});
function fileFilter(_req, file, cb) {
    const allowed = [
        "application/pdf",
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Tipo de arquivo não permitido. Use PDF ou vídeo (mp4, webm)."));
    }
}
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});
