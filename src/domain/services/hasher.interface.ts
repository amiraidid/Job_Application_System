export interface IHasher {
  hash(data: string): Promise<string>;
  compare(data: string, hashed: string): Promise<boolean>;
}

export const IHasher_REPO = Symbol('IHasher_REPO');
