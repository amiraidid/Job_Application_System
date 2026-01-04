import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { IFileStorageService } from 'src/domain/services/IFileStorageService';

export class RemoveResumeUseCase {
  constructor(private readonly fileStorage: IFileStorageService) {}

  async execute(id: string): Promise<string> {
    const deleteResume = await this.fileStorage.deleteFile(id);
    if (!deleteResume) {
      throw new NotFoundError('Failed to delete this application');
    }
    return 'the resume successfully is been deleted';
  }
}
