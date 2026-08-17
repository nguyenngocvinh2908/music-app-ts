"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = require("./topic");
const song_1 = require("./song");
const favorite_song_1 = require("./favorite-song");
const search_1 = require("./search");
const clientRoutes = (app) => {
    app.use('/topics', topic_1.TopicRouter);
    app.use('/songs', song_1.SongRouter);
    app.use('/favorite-songs', favorite_song_1.FavoriteSongRouter);
    app.use('/search', search_1.SearchRouter);
};
exports.default = clientRoutes;
