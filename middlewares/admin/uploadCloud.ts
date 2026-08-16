import multer from 'multer'
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import streamifier from 'streamifier'
import { Readable } from 'stream'
import { Request, Response, NextFunction } from 'express'

// ============================================
// 1. Cấu hình Multer (lưu tạm trong RAM dạng buffer)
// ============================================
const storage = multer.memoryStorage();

// fileFilter phân biệt theo tên field (fieldname)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.fieldname === 'avatar') {
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Trường avatar chỉ chấp nhận file ảnh!'));
  }

  if (file.fieldname === 'audio') {
    if (file.mimetype.startsWith('audio/')) {
      return cb(null, true);
    }
    return cb(new Error('Trường audio chỉ chấp nhận file âm thanh!'));
  }

  cb(new Error('Field không hợp lệ!'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB, audio thường nặng hơn ảnh
});

// Middleware nhận nhiều field khác nhau, mỗi field 1 file
export const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]);

// ============================================
// 2. Hàm upload buffer lên Cloudinary (lazy config)
// ============================================
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<UploadApiResponse> => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result);
      }
    );
    (streamifier.createReadStream(buffer) as Readable).pipe(uploadStream);
  });
};

// ============================================
// 3. Middleware "gộp": upload nhiều field + tự đẩy lên Cloudinary
// ============================================
export const uploadSongFilesToCloud = [
  uploadFields,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as {
        avatar?: Express.Multer.File[];
        audio?: Express.Multer.File[];
      };

      // Upload avatar (nếu có)
      if (files?.avatar?.[0]) {
        const avatarResult = await uploadBufferToCloudinary(
          files.avatar[0].buffer,
          'songs/avatars',
          'image'
        );
        req.body.avatar = avatarResult.secure_url;
        req.body.avatarPublicId = avatarResult.public_id;
      }

      // Upload audio (nếu có)
      if (files?.audio?.[0]) {
        const audioResult = await uploadBufferToCloudinary(
          files.audio[0].buffer,
          'songs/audio',
          'video'
        );
        req.body.audio = audioResult.secure_url;
        req.body.audioPublicId = audioResult.public_id;
      }

      next();
    } catch (error) {
      next(error);
    }
  }
];