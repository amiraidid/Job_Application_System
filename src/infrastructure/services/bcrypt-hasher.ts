import * as bcrypt from 'bcrypt';
import { IHasher } from 'src/domain/services/hasher.interface';

export class BcryptHasher implements IHasher {
  hash(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }
  compare(data: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(data, hashed);
  }
}
