import * as fs from 'fs';
import path from 'path';

const publicKey = fs.readFileSync(path.join(__dirname, '../../key/public_key.pem'));

const JwtKeys = {
  publicKey,
} as const;

export default JwtKeys;
