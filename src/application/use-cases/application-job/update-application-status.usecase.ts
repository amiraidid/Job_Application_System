import { ForbiddenError } from 'src/domain/core/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/core/errors/NotFoundError';
import { ApplicationEntity } from 'src/domain/entities/application.entity';
import { ApplicationStatusChangedEvent } from 'src/domain/events/application-status-changed.event';
import { IApplicationRepository } from 'src/domain/repositories/application.repository';
import { ICompanyRepository } from 'src/domain/repositories/company.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IEventBus } from 'src/domain/services/event-bus.intetface';

export class UpdateApplicationStatusUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    id: string,
    status: string,
    tenantId: string,
    userId: string,
  ): Promise<ApplicationEntity> {
    const company = await this.companyRepo.GetCompanyById(tenantId);
    if (!company) {
      throw new NotFoundError(`Not found any Company with this ${tenantId}`);
    }

    const user = await this.userRepo.FindUserById(userId);
    if (!user) {
      throw new NotFoundError(`Not found any User with this ${userId}`);
    }

    const co_user = user?.companyUsers?.find((usr) => {
      return (
        usr.companyId == company.id &&
        (usr.role == 'HR' || usr.role == 'ADMIN' || usr.role == 'INTERVIEWER')
      );
    });
    if (company.id !== co_user?.companyId) {
      throw new ForbiddenError(
        'Sorry, you don`t have the permissions to perform this action',
      );
    }
    const singleApp = await this.applicationRepo.FindApplicationById(id);
    if (!singleApp) {
      throw new NotFoundError("Sorry, Didn't find the application");
    }
    const updated = await this.applicationRepo.UpdateApplicationStatus(
      singleApp.id,
      status,
    );

    this.eventBus.publish(
      new ApplicationStatusChangedEvent(
        updated.userId,
        updated.id,
        updated.jobId,
      ),
    );

    return updated;
  }
}
