"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getView = getView;
exports.render = render;
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
function getView(viewName) {
    return fs_1.default.readFileSync(`views/${viewName}.hbs`, 'utf8');
}
function render(template, data) {
    const compiledTemplate = handlebars_1.default.compile(template);
    return compiledTemplate(data);
}
