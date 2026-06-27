import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
// Load environment variables early so ENCRYPTION_KEY is available at import time
dotenv.config({ path: '.env' });

const algorithm = 'aes-256-ctr';
<<<<<<< HEAD

const getKey = () => process.env.CRYPTO_KEY;
=======
function getSecretKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  if (key.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters');
  }
  return key;
}
>>>>>>> master

export const encrypt = (text: string) => {
  if (!text || text === '') {
    return {};
  }

  const iv = crypto.randomBytes(16);
<<<<<<< HEAD
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  
=======
  const cipher = crypto.createCipheriv(algorithm, getSecretKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

>>>>>>> master
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const decrypt = (hash: any) => {
  if (!hash || !hash.iv || !hash.content) {
    return '';
  }
<<<<<<< HEAD
  
  const decipher = crypto.createDecipheriv(algorithm, getKey(), Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
=======

  const decipher = crypto.createDecipheriv(
    algorithm,
    getSecretKey(),
    Buffer.from(hash.iv, 'hex'),
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);
>>>>>>> master
  return decrpyted.toString();
};
