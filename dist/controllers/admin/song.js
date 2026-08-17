"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const song_1 = __importDefault(require("../../models/song"));
const topic_1 = __importDefault(require("../../models/topic"));
const singer_1 = __importDefault(require("../../models/singer"));
const slugify_1 = __importDefault(require("slugify"));
const index = async (req, res) => {
    const songs = await song_1.default.find({ deleted: false });
    res.render('admin/pages/songs/index.pug', {
        songs: songs
    });
};
exports.index = index;
const create = async (req, res) => {
    const topics = await topic_1.default.find({ status: "active", deleted: false }).select("title");
    const singers = await singer_1.default.find({ status: "active", deleted: false }).select("fullName");
    res.render('admin/pages/songs/create.pug', {
        topics: topics,
        singers: singers
    });
};
exports.create = create;
const createPost = async (req, res) => {
    const { title, topicId, singerId, description, status, avatar, audio, lyrics } = req.body;
    const newSong = new song_1.default({ title, topicId, singerId, description, status, avatar, audio, lyrics, slug: (0, slugify_1.default)(title, { lower: true, strict: true }) });
    await newSong.save();
    res.redirect(`/${req.prefixAdmin || 'admin'}/songs`);
};
exports.createPost = createPost;
const edit = async (req, res) => {
    const idSong = req.params.idSong;
    const song = await song_1.default.findOne({ _id: idSong, status: "active", deleted: false });
    const topics = await topic_1.default.find({ status: "active", deleted: false }).select("title");
    const singers = await singer_1.default.find({ status: "active", deleted: false }).select("fullName");
    res.render('admin/pages/songs/edit.pug', {
        song: song,
        topics: topics,
        singers: singers
    });
};
exports.edit = edit;
const editPatch = async (req, res) => {
    const idSong = req.params.idSong;
    const { title, topicId, singerId, description, status, avatar, audio, lyrics } = req.body;
    await song_1.default.updateOne({ _id: idSong }, { title, topicId, singerId, description, status, avatar, audio, lyrics });
    res.redirect(`/${req.prefixAdmin || 'admin'}/songs/edit/${idSong}`);
};
exports.editPatch = editPatch;
