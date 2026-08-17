"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const song_1 = __importDefault(require("../../models/song"));
const singer_1 = __importDefault(require("../../models/singer"));
const convert_slug_1 = require("../../helpers/convert-slug");
const index = async (req, res) => {
    const type = req.params.type;
    const rawKeyword = req.query.keyword;
    const keyword = typeof rawKeyword === 'string' ? rawKeyword.trim() : '';
    let newRecords = [];
    if (keyword) {
        const keywordRegex = new RegExp(keyword, "i");
        const keywordSlug = (0, convert_slug_1.convertToSlug)(keyword);
        const keywordSlugRegex = new RegExp(keywordSlug, 'i');
        const searchSongs = await song_1.default.find({
            $or: [
                { title: keywordRegex },
                { slug: keywordSlugRegex },
            ],
            deleted: false
        });
        if (searchSongs.length > 0) {
            newRecords = await Promise.all(searchSongs.map(async (song) => {
                const inforSinger = await singer_1.default.findOne({ _id: song.singerId, deleted: false });
                return {
                    ...song,
                    inforSinger: inforSinger
                };
            }));
        }
    }
    switch (type) {
        case "result":
            res.render('client/pages/search/index', {
                titlePage: keyword ? `Search Music: ${keyword}` : "Search Music",
                keyword: keyword,
                records: newRecords
            });
            break;
        case "suggest":
            res.json({
                code: 200,
                message: "Successful",
                records: newRecords
            });
            break;
        default:
            break;
    }
};
exports.index = index;
