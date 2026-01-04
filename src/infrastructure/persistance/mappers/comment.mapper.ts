import { CommentEntity } from 'src/domain/entities/comment.entity';

type RawData = {
  id: string;
  message: string;
  applicationId: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  companyId: string;
  createdAt: Date;
};

export class CommentMapperPersistence {
  static toDomain(raw: RawData) {
    const comment = new CommentEntity(
      raw.message,
      raw.applicationId,
      raw.userId,
      raw.companyId,
    );
    (comment.id as any) = raw.id;
    (comment.createdAt as any) = raw.createdAt;
    (comment.user as any) = raw.user;
    return comment;
  }

  static toPersistence(comment: CommentEntity) {
    return {
      id: comment.id,
      message: comment.message,
      applicationId: comment.applicationId,
      userId: comment.userId,
      companyId: comment.companyId,
      // only expose safe user fields in API responses
      user: comment.user
        ? { name: comment.user.name, email: comment.user.email }
        : undefined,
      createdAt: comment.createdAt,
    };
  }

  static toDomainArray(raws: RawData[]): CommentEntity[] {
    return raws.map((raw) => CommentMapperPersistence.toDomain(raw));
  }

  static toPersistenceArray(entities: CommentEntity[]) {
    return entities.map((e) => CommentMapperPersistence.toPersistence(e));
  }
}
