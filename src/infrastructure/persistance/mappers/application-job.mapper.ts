import { ApplicationEntity } from 'src/domain/entities/application.entity';

export class ApplicationJobPersistenceMapper {
  static toDomain(raw: {
    id: string;
    jobId: string;
    userId: string;
    user: { name: string; email: string; role: string };
    resumeUrl: string;
    publicId: string;
    status: string;
    companyId: string;
  }) {
    const app = new ApplicationEntity(
      raw.jobId,
      raw.userId,
      raw.resumeUrl,
      raw.publicId,
      raw.companyId,
    );
    (app.id as any) = raw.id;
    (app.status as any) = raw.status;
    (app.user as any) = raw.user;
    return app;
  }

  static toPersistence(application: ApplicationEntity) {
    return {
      id: application.id,
      jobId: application.jobId,
      userId: application.userId,
      user: application.user
        ? {
            name: application.user.name,
            email: application.user.email,
            role: application.user.role,
          }
        : undefined,
      resumeUrl: application.resumeUrl,
      publicId: application.publicId,
      status: application.status,
      companyId: application.companyId,
    };
  }

  static toDto(entity: ApplicationEntity) {
    return {
      jobId: entity.jobId,
      userId: entity.userId,
      resumeUrl: entity.resumeUrl,
      publicId: entity.publicId,
      status: entity.status,
    };
  }

  static toDomainArray(
    raws: {
      id: string;
      jobId: string;
      userId: string;
      user: { name: string; email: string; role: string };
      resumeUrl: string;
      publicId: string;
      status: string;
      companyId: string;
    }[],
  ): ApplicationEntity[] {
    return raws.map((raw) => ApplicationJobPersistenceMapper.toDomain(raw));
  }

  static toPersistenceArray(entities: ApplicationEntity[]) {
    return entities.map((e) =>
      ApplicationJobPersistenceMapper.toPersistence(e),
    );
  }
}
