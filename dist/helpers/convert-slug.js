"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToSlug = void 0;
const unidecode_1 = __importDefault(require("unidecode"));
const convertToSlug = (text) => {
    const textUnidecode = (0, unidecode_1.default)(text);
    const textToSlug = textUnidecode.trim().replace(/\s+/g, '-');
    return textToSlug;
};
exports.convertToSlug = convertToSlug;
