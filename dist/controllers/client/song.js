"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.favourite = exports.likeSong = exports.songDetail = exports.songsOfTopic = void 0;
const topic_1 = __importDefault(require("../../models/topic"));
const song_1 = __importDefault(require("../../models/song"));
const singer_1 = __importDefault(require("../../models/singer"));
const favourite_songs_1 = __importDefault(require("../../models/favourite-songs"));
const songsOfTopic = async (req, res) => {
    try {
        const slugTopic = req.params.slugTopic;
        const topic = await topic_1.default.findOne({ slug: slugTopic, status: "active", deleted: false });
        if (!topic) {
            return res.status(404).render('client/pages/errors/index', {
                errorCode: "404",
                errorTitle: "My Page Search Not Found",
                errorMessage: "The link may be broken, or this page has been removed."
            });
        }
        const songs = await song_1.default.find({ topicId: topic._id.toString(), status: "active", deleted: false }).select("avatar title slug singerId like").lean();
        const songsWidthSinger = await Promise.all(songs.map(async (song) => {
            const inforSinger = await singer_1.default.findOne({ _id: song.singerId, status: "active", deleted: false }).select("fullName avatar").lean();
            return {
                ...song,
                inforSinger: inforSinger
            };
        }));
        res.render('client/pages/songs/index', {
            titlePage: `Songs Music Of Topic ${topic.title}`,
            songs: songsWidthSinger
        });
    }
    catch (e) {
        return res.status(500).render('client/pages/errors/index', {
            errorCode: "500",
            errorTitle: "A server error occurred.",
            errorMessage: "The system is experiencing an interruption. Please try again in a few minutes."
        });
    }
};
exports.songsOfTopic = songsOfTopic;
const songDetail = async (req, res) => {
    const slugSong = req.params.slugSong;
    const song = await song_1.default.findOne({ slug: slugSong.toString(), status: "active", deleted: false }).lean();
    const singerOfSong = await singer_1.default.findOne({ _id: song.singerId, status: "active", deleted: false }).select('fullName');
    const topicOfSong = await topic_1.default.findOne({ _id: song.topicId, status: "active", deleted: false });
    const favourite = await favourite_songs_1.default.findOne({ songId: song._id, deleted: false });
    if (song)
        song.favourite = Boolean(favourite);
    try {
        res.render('client/pages/songs/detail', {
            titlePage: song.title,
            song: song,
            singer: singerOfSong,
            topic: topicOfSong
        });
    }
    catch (e) {
        return res.status(500).render('client/pages/errors/index', {
            errorCode: "500",
            errorTitle: "A server error occurred.",
            errorMessage: "The system is experiencing an interruption. Please try again in a few minutes."
        });
    }
};
exports.songDetail = songDetail;
const likeSong = async (req, res) => {
    const idSong = req.params.idSong;
    const typeLike = req.params.typeLike;
    const song = await song_1.default.findOne({ _id: idSong, deleted: false, status: "active" });
    const newLike = typeLike === "like" ? song.like + 1 : song.like - 1;
    await song_1.default.updateOne({ _id: idSong, deleted: false, status: "active" }, { like: newLike });
    res.json({
        code: 200,
        message: "Success",
        like: newLike
    });
};
exports.likeSong = likeSong;
const favourite = async (req, res) => {
    const idSong = req.params.idSong;
    const typeFavourite = req.params.typeFavourite;
    switch (typeFavourite) {
        case "unfavourite":
            await favourite_songs_1.default.deleteOne({ songId: idSong });
            break;
        case "favourite":
            const record = new favourite_songs_1.default({ songId: idSong });
            await record.save();
            break;
        default:
            break;
    }
    res.json({
        code: 200,
        message: "Success",
    });
};
exports.favourite = favourite;
const listen = async (req, res) => {
    const idSong = req.params.idSong;
    const song = await song_1.default.findOne({ _id: idSong, deleted: false, status: "active" });
    const listen = song.listened + 1;
    await song.updateOne({ _id: idSong }, { listened: listen });
    const songNew = await song_1.default.findOne({ _id: idSong, deleted: false, status: "active" });
    res.json({
        code: 200,
        message: "Sucessful",
        listen: songNew.listened
    });
};
exports.listen = listen;
