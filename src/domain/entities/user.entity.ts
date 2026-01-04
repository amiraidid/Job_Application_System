export class UserEntity {
  public readonly id: string;
  public readonly role: string;
  public readonly companyId: string;
  companyUsers: [{ companyId: string; role: string }];
  public readonly createdAt: Date;
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}

  isValid(): boolean {
    if (!this.name || this.name.trim().length === 0) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) return false;
    if (!this.password || this.password.length < 6) return false;
    return true;
  }
}
