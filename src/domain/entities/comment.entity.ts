export class CommentEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly user: { name: string; email: string };
  constructor(
    public readonly message: string,
    public readonly applicationId: string,
    public readonly userId: string,
    public readonly companyId: string,
  ) {}

  isValid(): boolean {
    const message = typeof this.message === 'string' ? this.message.trim() : '';
    const applicationId =
      typeof this.applicationId === 'string' ? this.applicationId.trim() : '';
    const userId = typeof this.userId === 'string' ? this.userId.trim() : '';

    return message.length > 0 && applicationId.length > 0 && userId.length > 0;
  }
}
