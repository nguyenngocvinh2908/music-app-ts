"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./../../config/config");
const dashboard_1 = require("./dashboard");
const topic_1 = require("./topic");
const song_1 = require("./song");
const upload_1 = require("./upload");
const adminRoutes = (app) => {
    const PATCH_ADMIN = `${config_1.systemConfig.prefixAdmin}`;
    app.use(`/${PATCH_ADMIN}/dashboard`, dashboard_1.DashboardRouter);
    app.use(`/${PATCH_ADMIN}/topics`, topic_1.TopicRouter);
    app.use(`/${PATCH_ADMIN}/songs`, song_1.SongRouter);
    app.use(`/${PATCH_ADMIN}/upload`, upload_1.UploadRouter);
};
exports.default = adminRoutes;
