/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject, Injectable } from '@nestjs/common';
import { IFileStorageService } from 'src/domain/services/IFileStorageService';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService implements IFileStorageService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: any,
  ) {}

  uploadFile(
    file: Express.Multer.File,
    options: { folder?: string; fileName?: string },
  ): Promise<{ url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Empty result from Cloudinary'));
          resolve({ url: result.secure_url, public_id: result.public_id });
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(public_id: string): Promise<string> {
    const resumeRl = await this.cloudinary.uploader.destroy(public_id, {
      resource_type: 'image',
    });
    if (!resumeRl) {
      throw new Error('failed to delete the resume.');
    }
    return 'Removed Successfully';
  }
}
