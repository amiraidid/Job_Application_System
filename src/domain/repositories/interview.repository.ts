import { InterviewEntity } from '../entities/interview.entity';

export interface INterviewRepository {
  ScheduleInterview(interview: InterviewEntity): Promise<InterviewEntity>;
  UpdateInterviewFeedback(
    id: string,
    feedback: string,
    status: string,
  ): Promise<InterviewEntity>;
  FindInterviewById(id: string): Promise<InterviewEntity>;
  RemoveInterview(id: string): Promise<string>;
}

export const INTERVIEW_REPO = Symbol('INTERVIEW_REPO');
