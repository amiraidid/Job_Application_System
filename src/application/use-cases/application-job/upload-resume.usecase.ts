/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { IFileStorageService } from 'src/domain/services/IFileStorageService';

export class UploadResumeUseCase {
  constructor(private readonly fileStorage: IFileStorageService) {}

  async execute(
    file: Express.Multer.File,
  ): Promise<{ url: string; public_id: string }> {
    const resumeUploadResult = await this.fileStorage.uploadFile(file, {
      folder: 'resumes',
      fileName: `resume-${Date.now()}-resume.pdf`,
    });

    if (!resumeUploadResult) {
      throw new NotFoundError('Failed to Upload Resume, Please try again');
    }

    // Normalize result whether uploadFile returns a string URL or an object with url/public_id
    if (typeof resumeUploadResult === 'string') {
      return { url: resumeUploadResult, public_id: '' };
    }

    // resumeUploadResult is an object; use its properties (cast to any because uploadFile signature may vary)
    const result: any = resumeUploadResult;
    return {
      url: result.url ?? String(result),
      public_id: result.public_id ?? '',
    };
  }
}
