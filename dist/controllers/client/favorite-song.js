"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const song_1 = __importDefault(require("../../models/song"));
const singer_1 = __importDefault(require("../../models/singer"));
const favourite_songs_1 = __importDefault(require("../../models/favourite-songs"));
const index = async (req, res) => {
    const favoriteSongs = await favourite_songs_1.default.find({ deleted: false });
    const record = await Promise.all(favoriteSongs.map(async (item) => {
        const inforSong = await song_1.default.findOne({ _id: item.songId, deleted: false });
        const inforSinger = await singer_1.default.findOne({ _id: inforSong?.singerId, deleted: false });
        return {
            ...favoriteSongs,
            inforSong: inforSong,
            inforSinger: inforSinger
        };
    }));
    res.render('client/pages/favorite-song/index', {
        titlePage: "Favorite Songs",
        favoriteSongs: record
    });
};
exports.index = index;
