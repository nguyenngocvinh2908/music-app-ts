import multer from 'multer'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import streamifier from 'streamifier'
import { Readable } from 'stream'
import { Request, Response, NextFunction } from 'express'

// Storage dùng chung trong RAM
const storage = multer.memoryStorage();

// Config Cloudinary & Hàm Upload Core
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
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      }
    );
    (streamifier.createReadStream(buffer) as Readable).pipe(uploadStream);
  });
};

// ============================================
// 1. TÁCH: Upload 1 file/ảnh (Dùng cho TinyMCE, Single Avatar)
// ============================================
export const uploadSingle = (
  fieldName: string, 
  folder: string, 
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image'
) => {
  const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }).single(fieldName);

  return [
    upload,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.file) return next();
        const result = await uploadBufferToCloudinary(req.file.buffer, folder, resourceType);
        
        req.body[fieldName] = result.secure_url;
        req.body[`${fieldName}PublicId`] = result.public_id;
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
};

// ============================================
// 2. TÁCH: Upload MẢNG nhiều file cùng 1 trường (Dùng cho Album ảnh, Gallery)
// ============================================
export const uploadArray = (
  fieldName: string, 
  folder: string, 
  maxCount: number = 5,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image'
) => {
  const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }).array(fieldName, maxCount);

  return [
    upload,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) return next();

        const uploadPromises = files.map(file => uploadBufferToCloudinary(file.buffer, folder, resourceType));
        const results = await Promise.all(uploadPromises);

        // Trả về mảng các URL và Public ID
        req.body[fieldName] = results.map(r => r.secure_url);
        req.body[`${fieldName}PublicIds`] = results.map(r => r.public_id);
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
};

// ============================================
// 3. TÁCH: Upload NHIỀU TRƯỜNG khác nhau (Dùng cho Song: avatar + audio)
// ============================================
export interface FieldConfig {
  name: string;
  folder: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
  maxCount?: number;
}

export const uploadFields = (fieldsConfig: FieldConfig[]) => {
  const multerFields = fieldsConfig.map(f => ({ name: f.name, maxCount: f.maxCount || 1 }));
  const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }).fields(multerFields);

  return [
    upload,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.files) return next();
        const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };

        for (const config of fieldsConfig) {
          const fileArray = filesMap[config.name];
          if (fileArray && fileArray[0]) {
            const result = await uploadBufferToCloudinary(fileArray[0].buffer, config.folder, config.resourceType);
            req.body[config.name] = result.secure_url;
            req.body[`${config.name}PublicId`] = result.public_id;
          }
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
};