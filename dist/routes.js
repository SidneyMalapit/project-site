"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const routes = [];
fs_1.default.readdirSync('views').forEach((file) => {
    if (file.startsWith('.')) {
        return;
    }
    if (fs_1.default.lstatSync(`views/${file}`).isDirectory()) {
        return;
    }
    routes.push(file.split('.')[0]);
});
exports.default = routes;
