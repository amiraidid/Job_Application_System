export class CompanyUsers {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly user: {
    name: string;
    email: string;
    role: string;
  };
  public readonly company: { name: string; description: string };
  constructor(
    public readonly companyId: string,
    public readonly userId: string,
    public readonly role: string,
  ) {}

  isValid(): boolean {
    const isNonEmptyString = (v: any) =>
      typeof v === 'string' && v.trim().length > 0;

    if (!isNonEmptyString(this.companyId)) return false;
    if (!isNonEmptyString(this.userId)) return false;
    if (!isNonEmptyString(this.role)) return false;
    if (this.role.length > 50) return false; // simple length guard

    return true;
  }
}
