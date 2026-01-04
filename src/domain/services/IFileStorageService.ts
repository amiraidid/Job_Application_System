export interface IFileStorageService {
  uploadFile(
    file: Express.Multer.File,
    options: {
      folder?: string;
      fileName?: string;
    },
  ): Promise<{ url: string; public_id: string }>;

  deleteFile(public_id: string): Promise<string>;
}

export const IFileStorageService = Symbol('IFileStorageService');
