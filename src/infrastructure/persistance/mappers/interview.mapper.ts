import { InterviewEntity } from 'src/domain/entities/interview.entity';

export class InterviewPersistenceMapper {
  static toDomain(raw: {
    interviewerId: string;
    applicationId: string;
    jobApplication: object;
    time: Date;
    feedback: string;
    id: string;
    companyId: string;
  }) {
    const interview = new InterviewEntity(
      raw.interviewerId,
      raw.time,
      raw.applicationId,
      raw.feedback,
      raw.companyId,
    );
    (interview.id as any) = raw.id;
    (interview.jobApplication as any) = raw.jobApplication;
    return interview;
  }

  static toPersistence(interview: InterviewEntity) {
    return {
      id: interview.id,
      interviewerId: interview.interviewerId,
      time: interview.time,
      applicationId: interview.applicationId,
      feedback: interview.feedback,
      companyId: interview.companyId,
    };
  }
}
