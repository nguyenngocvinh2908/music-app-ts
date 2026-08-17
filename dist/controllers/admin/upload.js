"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const index = async (req, res) => {
    res.status(200).json({
        location: req.body.file
    });
};
exports.index = index;
