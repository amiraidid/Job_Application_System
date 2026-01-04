export class ApplicationStatusChangedEvent {
  constructor(
    public readonly userId: string,
    public readonly applicationId: string,
    public readonly jobId: string,
  ) {}
}
