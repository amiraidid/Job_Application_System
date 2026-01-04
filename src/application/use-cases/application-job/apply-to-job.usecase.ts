import { ApplicationEntity } from 'src/domain/entities/application.entity';
import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { UploadResumeUseCase } from './upload-resume.usecase';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ValidationError } from 'src/domain/core/errors/ValidationError';
import { IEventBus } from 'src/domain/services/event-bus.intetface';
import { ApplicationSubmittedEvent } from 'src/domain/events/application-submitted.event';

export class ApplyToJobUseCase {
  constructor(
    private readonly applicationJob: IApplicationRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly uploadResume: UploadResumeUseCase,
    private readonly userRepo: IUserRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    dto: { jobId: string },
    userId: string,
    companyId: string,
    file: Express.Multer.File,
  ): Promise<ApplicationEntity> {
    const company = await this.companyRepo.GetCompanyById(companyId);
    if (!company) {
      throw new NotFoundError(`Not found a company with this ${companyId}`);
    }

    const user = await this.userRepo.FindUserById(userId);
    if (!user) {
      throw new NotFoundError(`Not found any User with this ${userId}`);
    }

    const resume = await this.uploadResume.execute(file);
    if (!resume) {
      throw new NotFoundError('Failed to upload the resume, Please try again');
    }

    const job = new ApplicationEntity(
      dto.jobId,
      user.id,
      resume.url,
      resume.public_id,
      company.id,
    );

    if (!job.isValid()) {
      throw new ValidationError('The Inserted Data is invalid');
    }

    const application = await this.applicationJob.ApplyToJob(job);

    // emit notifications to hr/ admin
    this.eventBus.publish(
      new ApplicationSubmittedEvent(
        application.companyId,
        application.id,
        job.id,
      ),
    );

    return application;
  }
}
