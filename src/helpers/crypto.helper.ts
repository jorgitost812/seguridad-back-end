const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'w4or7qPIotUAKWO2vWBzxm6aqsIWYZox';

export { secretKey };

export const encrypt = (text: string) => {
  if (!text || text === '') {
    return {};
  }
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

export const decrypt = (hash: any) => {
  if (!hash || !hash.iv || !hash.content) {
    return '';
  }
  
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};