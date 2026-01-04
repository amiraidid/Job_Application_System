import { ApplicationEntity } from '../entities/application.entity';

export interface IApplicationRepository {
  ApplyToJob(
    application: ApplicationEntity,
    file?: Express.Multer.File,
  ): Promise<ApplicationEntity>;
  UpdateApplicationStatus(
    id: string,
    status: string,
  ): Promise<ApplicationEntity>;
  FindApplicationById(id: string): Promise<ApplicationEntity>;
  RemoveApplicationById(id: string, public_id: string): Promise<void>;
  GetApplicationsForJob(id: string): Promise<ApplicationEntity[]>;
}

export const APPLICATION_REPO = Symbol('APPLICATION_REPO');
