export class ApplicationSubmittedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly applicationId: string,
    public readonly jobId: string,
  ) {}
}
