import { JobPost } from 'src/domain/entities/job-post.entity';

export class JobPostPersistenceMapper {
  static toDomain(raw: {
    title: string;
    description: string;
    requirements: string;
    id: string;
    isPublished: boolean;
    companyId: string;
    userId: string;
  }): JobPost {
    const entity = new JobPost(
      raw.title,
      raw.description,
      raw.requirements,
      raw.companyId,
      raw.userId,
    );

    (entity.id as any) = raw.id;
    (entity.isPublished as any) = raw.isPublished;
    (entity.companyId as any) = raw.companyId;
    (entity.userId as any) = raw.userId;

    return entity;
  }

  static toPersistence(entity: JobPost) {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      requirements: entity.requirement,
      isPublished: entity.isPublished,
      companyId: entity.companyId,
    };
  }

  static toDomainArray(
    raws: {
      title: string;
      description: string;
      requirements: string;
      id: string;
      isPublished: boolean;
      companyId: string;
      company?: {
        name: string;
        // companyUsers?: [{ name: string; email: string; role: string }];
      };
      userId: string;
    }[],
  ): JobPost[] {
    return raws.map((raw) => JobPostPersistenceMapper.toDomain(raw));
  }

  static toPersistenceArray(entities: JobPost[]) {
    return entities.map((e) => JobPostPersistenceMapper.toPersistence(e));
  }
}
