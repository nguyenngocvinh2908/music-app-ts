"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFields = exports.uploadArray = exports.uploadSingle = exports.uploadBufferToCloudinary = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const storage = multer_1.default.memoryStorage();
const uploadBufferToCloudinary = (buffer, folder, resourceType = 'auto') => {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: resourceType }, (error, result) => {
            if (error || !result)
                return reject(error);
            resolve(result);
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
const uploadSingle = (fieldName, folder, resourceType = 'image') => {
    const upload = (0, multer_1.default)({ storage, limits: { fileSize: 10 * 1024 * 1024 } }).single(fieldName);
    return [
        upload,
        async (req, res, next) => {
            try {
                if (!req.file)
                    return next();
                const result = await (0, exports.uploadBufferToCloudinary)(req.file.buffer, folder, resourceType);
                req.body[fieldName] = result.secure_url;
                req.body[`${fieldName}PublicId`] = result.public_id;
                next();
            }
            catch (error) {
                next(error);
            }
        }
    ];
};
exports.uploadSingle = uploadSingle;
const uploadArray = (fieldName, folder, maxCount = 5, resourceType = 'image') => {
    const upload = (0, multer_1.default)({ storage, limits: { fileSize: 10 * 1024 * 1024 } }).array(fieldName, maxCount);
    return [
        upload,
        async (req, res, next) => {
            try {
                const files = req.files;
                if (!files || files.length === 0)
                    return next();
                const uploadPromises = files.map(file => (0, exports.uploadBufferToCloudinary)(file.buffer, folder, resourceType));
                const results = await Promise.all(uploadPromises);
                req.body[fieldName] = results.map(r => r.secure_url);
                req.body[`${fieldName}PublicIds`] = results.map(r => r.public_id);
                next();
            }
            catch (error) {
                next(error);
            }
        }
    ];
};
exports.uploadArray = uploadArray;
const uploadFields = (fieldsConfig) => {
    const multerFields = fieldsConfig.map(f => ({ name: f.name, maxCount: f.maxCount || 1 }));
    const upload = (0, multer_1.default)({ storage, limits: { fileSize: 20 * 1024 * 1024 } }).fields(multerFields);
    return [
        upload,
        async (req, res, next) => {
            try {
                if (!req.files)
                    return next();
                const filesMap = req.files;
                for (const config of fieldsConfig) {
                    const fileArray = filesMap[config.name];
                    if (fileArray && fileArray[0]) {
                        const result = await (0, exports.uploadBufferToCloudinary)(fileArray[0].buffer, config.folder, config.resourceType);
                        req.body[config.name] = result.secure_url;
                        req.body[`${config.name}PublicId`] = result.public_id;
                    }
                }
                next();
            }
            catch (error) {
                next(error);
            }
        }
    ];
};
exports.uploadFields = uploadFields;
