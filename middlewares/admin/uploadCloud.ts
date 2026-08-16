import multer from 'multer'
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import streamifier from 'streamifier'
import { Readable } from 'stream'
import { Request, Response, NextFunction } from 'express'

// ============================================
// 1. Cấu hình Multer (lưu tạm trong RAM dạng buffer)
// ============================================
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadSingleImage = upload.single('avatar');
export const uploadMultipleImages = upload.array('images', 5);

// ============================================
// 2. Hàm upload buffer lên Cloudinary (config LAZY, chỉ chạy khi thực sự upload)
// ============================================
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string = 'songs'
): Promise<UploadApiResponse> => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
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
// 3. Middleware "gộp": upload file + tự đẩy lên Cloudinary
// ============================================
export const uploadSingleImageToCloud = [
  uploadSingleImage,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next();
      }

      const result = await uploadBufferToCloudinary(req.file.buffer, 'songs');

      req.body.avatar = result.secure_url;
      req.body.avatarPublicId = result.public_id;

      next();
    } catch (error) {
      next(error);
    }
  }
];