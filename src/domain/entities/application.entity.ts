export class ApplicationEntity {
  public readonly id: string;
  public readonly status: string;
  public readonly user: { name: string; email: string; role: string };
  constructor(
    public readonly jobId: string,
    public readonly userId: string,
    public readonly resumeUrl: string,
    public readonly publicId: string,
    public readonly companyId: string,
  ) {}

  isValid(): boolean {
    const nonEmpty = (v?: string) =>
      typeof v === 'string' && v.trim().length > 0;

    // required fields
    if (
      !nonEmpty(this.jobId) ||
      !nonEmpty(this.userId) ||
      !nonEmpty(this.resumeUrl) ||
      !nonEmpty(this.publicId) ||
      !nonEmpty(this.companyId)
    ) {
      return false;
    }

    // simple URL validation for resume
    try {
      new URL(this.resumeUrl);
    } catch {
      return false;
    }

    // optional user validation
    if (this.user) {
      const { name, email, role } = this.user;
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!nonEmpty(name) || !emailRe.test(email) || !nonEmpty(role)) {
        return false;
      }
    }

    // optional status validation (if provided)
    if (this.status) {
      const allowed = new Set([
        'pending',
        'submitted',
        'review',
        'accepted',
        'rejected',
        'withdrawn',
      ]);
      if (!allowed.has(this.status)) return false;
    }

    return true;
  }
}
