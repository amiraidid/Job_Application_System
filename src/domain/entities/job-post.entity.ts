export class JobPost {
  public readonly id: string;
  public readonly isPublished: boolean;
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly requirement: string,
    public readonly companyId: string,
    public readonly userId: string,
  ) {}

  isValid() {
    return (
      typeof this.title == 'string' &&
      typeof this.description == 'string' &&
      typeof this.requirement == 'string' &&
      typeof this.isPublished == 'boolean'
    );
  }
}
