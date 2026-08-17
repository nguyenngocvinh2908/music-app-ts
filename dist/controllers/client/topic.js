"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topics = void 0;
const topic_1 = __importDefault(require("../../models/topic"));
const topics = async (req, res) => {
    const topics = await topic_1.default.find({ deleted: false });
    res.render('client/pages/topics/index', {
        titlePage: 'Topics Music',
        topics: topics
    });
};
exports.topics = topics;
