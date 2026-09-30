import fs from 'fs';
import path from 'path';

export interface GatewaySettings {
  smtpHost: string;
  smtpPort: string | number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  fast2smsApiKey: string;
}

const SETTINGS_FILE_PATH = path.resolve(process.cwd(), 'src/data/gateway_settings.json');

function cleanFromHeader(fromStr: string, defaultUser: string): string {
  if (!fromStr) {
    return defaultUser ? '"ITLC Foundation" <' + defaultUser + '>' : '"ITLC Foundation" <donation@itlcfoundation.com>';
  }
  let cleaned = fromStr.replace(/\\"/g, '"').trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"') && cleaned.includes('<')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  const match = cleaned.match(/^(?:"?([^"]*)"?\s*)?<([^>]+)>$/);
  if (match) {
    const name = (match[1] || 'ITLC Foundation').trim();
    const address = match[2].trim();
    return '"' + name + '" <' + address + '>';
  }
  return cleaned;
}

function parseEnvFile(filePath: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return result;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        result[key] = val.replace(/\\"/g, '"');
      }
    }
  } catch (e) {
    console.error('Error parsing env file:', filePath, e);
  }
  return result;
}

function updateEnvFile(filePath: string, updates: Record<string, string>) {
  try {
    let content = '';
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf8');
    }

    const lines = content ? content.split(/\r?\n/) : [];
    const handledKeys = new Set<string>();
    const updatedLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        updatedLines.push(line);
        continue;
      }
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        if (key in updates) {
          handledKeys.add(key);
          const val = updates[key];
          updatedLines.push(`${key}=${val}`);
          continue;
        }
      }
      updatedLines.push(line);
    }

    for (const [key, val] of Object.entries(updates)) {
      if (!handledKeys.has(key)) {
        updatedLines.push(`${key}=${val}`);
      }
    }

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');
  } catch (err) {
    console.warn('Could not update env file at:', filePath, err);
  }
}

/**
 * Returns persistent Gateway and SMTP Settings.
 * Prioritizes src/data/gateway_settings.json so live admin changes survive server reboots and deployments.
 */
export function getGatewaySettings(): GatewaySettings {
  let fileSettings: Partial<GatewaySettings> = {};
  if (fs.existsSync(SETTINGS_FILE_PATH)) {
    try {
      fileSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE_PATH, 'utf8'));
    } catch (e) {
      console.error('Error reading gateway_settings.json:', e);
    }
  }

  const envLocal = parseEnvFile(path.join(process.cwd(), '.env.local'));
  const envBase = parseEnvFile(path.join(process.cwd(), '.env'));

  // 1. Razorpay Key ID (file > env.local > env > process.env)
  const razorpayKeyId = (
    fileSettings.razorpayKeyId ||
    envLocal.RAZORPAY_KEY_ID ||
    envBase.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    ''
  ).trim();

  // 2. Razorpay Key Secret
  const razorpayKeySecret = (
    fileSettings.razorpayKeySecret ||
    envLocal.RAZORPAY_KEY_SECRET ||
    envBase.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    ''
  ).trim();

  // 3. SMTP Settings
  const smtpHost = (
    fileSettings.smtpHost ||
    envLocal.SMTP_HOST ||
    envBase.SMTP_HOST ||
    process.env.SMTP_HOST ||
    'smtp.hostinger.com'
  ).trim();

  const smtpPort =
    fileSettings.smtpPort ||
    envLocal.SMTP_PORT ||
    envBase.SMTP_PORT ||
    process.env.SMTP_PORT ||
    '465';

  const smtpUser = (
    fileSettings.smtpUser ||
    envLocal.SMTP_USER ||
    envBase.SMTP_USER ||
    process.env.SMTP_USER ||
    'donation@itlcfoundation.com'
  ).trim();

  const smtpPass = (
    fileSettings.smtpPass ||
    envLocal.SMTP_PASS ||
    envBase.SMTP_PASS ||
    process.env.SMTP_PASS ||
    ''
  ).trim();

  const rawSmtpFrom =
    fileSettings.smtpFrom ||
    envLocal.SMTP_FROM ||
    envBase.SMTP_FROM ||
    process.env.SMTP_FROM ||
    '';
  const smtpFrom = cleanFromHeader(rawSmtpFrom, smtpUser);

  const fast2smsApiKey = (
    fileSettings.fast2smsApiKey ||
    envLocal.FAST2SMS_API_KEY ||
    envBase.FAST2SMS_API_KEY ||
    process.env.FAST2SMS_API_KEY ||
    ''
  ).trim();

  return {
    razorpayKeyId,
    razorpayKeySecret,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpFrom,
    fast2smsApiKey,
  };
}

/**
 * Saves Gateway and SMTP Settings permanently to:
 * 1) src/data/gateway_settings.json (Disk persistence)
 * 2) .env.local and .env
 * 3) backend/.env (if exists)
 * 4) process.env in-memory
 */
export function saveGatewaySettings(updates: Partial<GatewaySettings>): GatewaySettings {
  const current = getGatewaySettings();
  const merged: GatewaySettings = {
    ...current,
    ...updates,
  };

  if (merged.smtpFrom) {
    merged.smtpFrom = cleanFromHeader(merged.smtpFrom, merged.smtpUser);
  }

  // 1. Write to permanent persistent JSON file
  const dir = path.dirname(SETTINGS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(merged, null, 2), 'utf8');

  // 2. Prepare dictionary for .env and runtime
  const envUpdates: Record<string, string> = {};
  if (merged.razorpayKeyId !== undefined) {
    envUpdates.RAZORPAY_KEY_ID = merged.razorpayKeyId;
    envUpdates.NEXT_PUBLIC_RAZORPAY_KEY_ID = merged.razorpayKeyId;
  }
  if (merged.razorpayKeySecret !== undefined) {
    envUpdates.RAZORPAY_KEY_SECRET = merged.razorpayKeySecret;
  }
  if (merged.smtpHost !== undefined) envUpdates.SMTP_HOST = merged.smtpHost;
  if (merged.smtpPort !== undefined) envUpdates.SMTP_PORT = String(merged.smtpPort);
  if (merged.smtpUser !== undefined) envUpdates.SMTP_USER = merged.smtpUser;
  if (merged.smtpPass !== undefined) envUpdates.SMTP_PASS = merged.smtpPass;
  if (merged.smtpFrom !== undefined) envUpdates.SMTP_FROM = merged.smtpFrom;
  if (merged.fast2smsApiKey !== undefined) envUpdates.FAST2SMS_API_KEY = merged.fast2smsApiKey;

  // 3. Update in-memory process.env
  for (const [k, v] of Object.entries(envUpdates)) {
    process.env[k] = v;
  }

  // 4. Update root .env and .env.local
  updateEnvFile(path.join(process.cwd(), '.env.local'), envUpdates);
  updateEnvFile(path.join(process.cwd(), '.env'), envUpdates);

  // 5. Update backend/.env if backend folder exists
  const backendEnv = path.join(process.cwd(), 'backend', '.env');
  if (fs.existsSync(backendEnv)) {
    updateEnvFile(backendEnv, envUpdates);
  }

  return merged;
}
