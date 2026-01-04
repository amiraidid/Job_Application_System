export class NotificationEntity {
  public readonly id: string;
  public readonly isRead: boolean;
  public readonly createdAt: Date;
  constructor(
    public readonly title: string,
    public readonly message: string,
    public readonly type: string,
    public readonly userId: string,
    public readonly companyId: string,
  ) {}

  isValid(): boolean {
    const title = typeof this.title === 'string' ? this.title.trim() : '';
    const message = typeof this.message === 'string' ? this.message.trim() : '';
    const type = typeof this.type === 'string' ? this.type.trim() : '';
    const userId = typeof this.userId === 'string' ? this.userId.trim() : '';
    const companyId =
      typeof this.companyId === 'string' ? this.companyId.trim() : '';

    return (
      title.length > 0 &&
      message.length > 0 &&
      type.length > 0 &&
      userId.length > 0 &&
      companyId.length > 0
    );
  }
}
