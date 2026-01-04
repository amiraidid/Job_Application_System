export class InterviewScheduledEvent {
  constructor(
    public readonly candidateId: string,
    public readonly interviewerId: string,
    public readonly interviewId: string,
  ) {}
}
