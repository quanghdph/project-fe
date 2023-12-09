import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2, DeleteApiResponse } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    public async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            toStream(file.buffer).pipe(upload);
        });
    }

    public async deleteImage(publicId: string): Promise<DeleteApiResponse> {
        return v2.uploader.destroy(publicId)
    }
}
