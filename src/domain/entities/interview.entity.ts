export class InterviewEntity {
  public readonly id: string;
  public readonly jobApplication: object;
  public readonly createdAt: string;
  constructor(
    public readonly interviewerId: string,
    public readonly time: Date,
    public readonly applicationId: string,
    public readonly feedback: string,
    public readonly companyId: string,
  ) {}

  isValid(): boolean {
    const isNonEmptyString = (v: any) =>
      typeof v === 'string' && v.trim().length > 0;

    if (!isNonEmptyString(this.interviewerId)) return false;
    if (!isNonEmptyString(this.applicationId)) return false;

    if (!(this.time instanceof Date) || isNaN(this.time.getTime()))
      return false;

    if (
      this.feedback !== undefined &&
      this.feedback !== null &&
      typeof this.feedback !== 'string'
    )
      return false;

    return true;
  }
}
