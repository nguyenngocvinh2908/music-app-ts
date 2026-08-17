"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const topic_1 = __importDefault(require("../../models/topic"));
const slugify_1 = __importDefault(require("slugify"));
const index = async (req, res) => {
    const topics = await topic_1.default.find({ deleted: false });
    res.render('admin/pages/topics/index.pug', {
        titlePage: 'Topics Music Management',
        topics: topics
    });
};
exports.index = index;
const create = async (req, res) => {
    res.render('admin/pages/topics/create.pug', {
        titlePage: 'Create Topic',
    });
};
exports.create = create;
const createPost = async (req, res) => {
    const { title, avatar, description, status } = req.body;
    const newTopic = new topic_1.default({
        title,
        avatar,
        description,
        status,
        slug: (0, slugify_1.default)(title, { lower: true, strict: true }),
    });
    await newTopic.save();
    res.redirect(`/${req.prefixAdmin || 'admin'}/topics`);
};
exports.createPost = createPost;
const edit = async (req, res) => {
    try {
        const { idTopic } = req.params;
        const topic = await topic_1.default.findOne({
            _id: idTopic,
            deleted: false,
        });
        if (!topic) {
            res.status(404).render('client/pages/errors/index.pug', {
                errorCode: 404,
                errorTitle: 'Không tìm thấy Topic',
                errorMessage: 'Topic này không tồn tại hoặc đã bị xoá.',
            });
            return;
        }
        res.render('admin/pages/topics/edit.pug', {
            titlePage: 'Edit Topic',
            topic: topic,
        });
    }
    catch (error) {
        res.status(400).render('client/pages/errors/index.pug', {
            errorCode: 400,
            errorTitle: 'Đường dẫn không hợp lệ',
            errorMessage: 'ID của Topic không đúng định dạng.',
        });
    }
};
exports.edit = edit;
const editPatch = async (req, res) => {
    try {
        const { idTopic } = req.params;
        const { title, avatar, description, status } = req.body;
        await topic_1.default.updateOne({ _id: idTopic }, {
            title,
            avatar,
            description,
            status,
            slug: (0, slugify_1.default)(title, { lower: true, strict: true }),
        });
        res.redirect(`/${req.prefixAdmin || 'admin'}/topics`);
    }
    catch (error) {
        res.status(500).render('client/pages/errors/index.pug', {
            errorCode: 500,
            errorTitle: 'Cập nhật thất bại',
            errorMessage: 'Đã có lỗi xảy ra trong quá trình cập nhật, vui lòng thử lại.',
        });
    }
};
exports.editPatch = editPatch;
