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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const koa_1 = __importDefault(require("koa"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_json_1 = __importDefault(require("koa-json"));
const koa_static_1 = __importDefault(require("koa-static"));
const serve_views_1 = __importDefault(require("./serve-views"));
const app = new koa_1.default();
app
    .use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield next();
    const accepts = ctx.accepts('js', 'css');
    // serve empty js and css files if not found
    if (accepts && ctx.status === 404) {
        ctx.body = '';
        ctx.type = accepts;
    }
}))
    .use((0, koa_json_1.default)())
    .use((0, koa_logger_1.default)())
    .use((0, koa_static_1.default)('public'));
// serve views
app.use(serve_views_1.default.routes()).use(serve_views_1.default.allowedMethods());
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
module.exports = app;
