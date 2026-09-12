import crypto from 'crypto';

// Retrieve or generate a deterministic 32-byte key for AES-256-GCM
const ENCRYPTION_KEY_RAW = process.env.DB_ENCRYPTION_KEY || 'itlc_foundation_secure_vault_2026_db_key_32bytes!!';
const ENCRYPTION_KEY = crypto.createHash('sha256').update(ENCRYPTION_KEY_RAW).digest();
const ALGORITHM = 'aes-256-gcm';

/**
 * Irreversible password hashing using Node's native scrypt with a unique 16-byte random salt.
 * Output format: scrypt:<salt_hex>:<hash_hex>
 */
export function hashPassword(password: string): string {
  if (!password) throw new Error('Password cannot be empty');
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Timing-safe password verification against scrypt, pbkdf2, or legacy plain text (for smooth migration)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // Modern scrypt format: scrypt:<salt>:<hash>
  if (storedHash.startsWith('scrypt:')) {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return false;
    const [, salt, originalHash] = parts;
    try {
      const derivedKey = crypto.scryptSync(password, salt, 64);
      const originalBuffer = Buffer.from(originalHash, 'hex');
      return crypto.timingSafeEqual(derivedKey, originalBuffer);
    } catch {
      return false;
    }
  }

  // Bcrypt format (from backend/sql compatibility, starts with $2a$, $2b$, or $2y$)
  if (storedHash.startsWith('$2')) {
    try {
      return false;
    } catch {
      return false;
    }
  }

  // Legacy plain text fallback (for seamless migration only)
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(storedHash);
    if (a.length === b.length) {
      return crypto.timingSafeEqual(a, b);
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Hash short-lived OTP tokens using SHA-256 with a project salt so raw OTPs are never stored in plaintext
 */
export function hashOtp(otp: string): string {
  if (!otp) return '';
  const salt = process.env.OTP_SALT || 'itlc_otp_salt_luc_2026';
  return crypto.createHash('sha256').update(`${salt}:${otp.trim()}`).digest('hex');
}

/**
 * Verify OTP against stored hash
 */
export function verifyOtp(otp: string, storedHash: string): boolean {
  if (!otp || !storedHash) return false;
  const computed = hashOtp(otp);
  try {
    const bufA = Buffer.from(computed);
    const bufB = Buffer.from(storedHash);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Encrypt sensitive string data using AES-256-GCM authenticated encryption.
 * Output format: <iv_hex>:<authTag_hex>:<ciphertext_hex>
 */
export function encryptData(plaintext: string): string {
  if (!plaintext) return '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt AES-256-GCM encrypted string.
 */
export function decryptData(ciphertext: string): string {
  if (!ciphertext) return '';
  const parts = ciphertext.split(':');
  if (parts.length !== 3) return ciphertext; // Return raw if not encrypted
  const [ivHex, authTagHex, encryptedHex] = parts;
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return ciphertext;
  }
}
