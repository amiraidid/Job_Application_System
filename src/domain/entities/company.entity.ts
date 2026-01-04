export class CompanyEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly companyUsers: {
    userId: string;
    name: string;
    role: string;
  }[] = [];
  constructor(
    public readonly name: string,
    public readonly description: string,
  ) {}

  isValid(): boolean {
    const nameValid =
      typeof this.name === 'string' &&
      this.name.trim().length > 0 &&
      this.name.trim().length <= 100;
    const descriptionValid =
      typeof this.description === 'string' && this.description.length <= 1000;
    return nameValid && descriptionValid;
  }
}
