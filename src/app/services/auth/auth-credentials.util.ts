import { CurrentCredentials } from '../../domain-models/Adapters/CurrentCredentials';
import { User } from '../../domain-models/User';

const ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

/** Декодирование payload JWT (без проверки подписи — только чтение claim’ов). */
export function decodeJwtPayload(accessToken: string): Record<string, unknown> | null {
  try {
    const part = accessToken.split('.')[1];
    if (!part) {
      return null;
    }
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
    const json = atob(b64 + pad);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function roleClaimFromJwtPayload(payload: Record<string, unknown> | null): string | null {
  if (!payload) {
    return null;
  }
  const v =
    payload['role'] ??
    payload['Role'] ??
    payload[ROLE_CLAIM];
  if (v == null) {
    return null;
  }
  if (Array.isArray(v)) {
    return v.length ? String(v[0]) : null;
  }
  return String(v);
}

function pickStr(obj: Record<string, unknown>, camel: string, pascal: string): string {
  const c = obj[camel];
  const p = obj[pascal];
  if (c != null && c !== '') {
    return String(c);
  }
  if (p != null && p !== '') {
    return String(p);
  }
  return '';
}

/** Приводит ответ auth к CurrentCredentials (camelCase / PascalCase). */
export function normalizeAuthCredentials(raw: unknown): CurrentCredentials | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const r = raw as Record<string, unknown>;
  const accessToken = pickStr(r, 'accessToken', 'AccessToken');
  const userRaw = (r['user'] ?? r['User']) as Record<string, unknown> | undefined;
  if (!accessToken || !userRaw || typeof userRaw !== 'object') {
    return null;
  }
  const id = pickStr(userRaw, 'id', 'Id');
  if (!id) {
    return null;
  }
  const login = pickStr(userRaw, 'login', 'Login');
  let roleName = pickStr(userRaw, 'roleName', 'RoleName');
  let engRoleName = pickStr(userRaw, 'engRoleName', 'EngRoleName');
  const roleIdRaw = userRaw['roleId'] ?? userRaw['RoleId'];
  const roleId = roleIdRaw != null && roleIdRaw !== '' ? String(roleIdRaw) : null;

  if (!engRoleName.trim() && !roleName.trim()) {
    const payload = decodeJwtPayload(accessToken);
    const fromJwt = roleClaimFromJwtPayload(payload);
    if (fromJwt) {
      engRoleName = fromJwt;
    }
  }

  const externalTeacherId =
    pickStr(userRaw, 'externalTeacherId', 'ExternalTeacherId') ||
    pickStr(decodeJwtPayload(accessToken) ?? {}, 'external_teacher_id', 'external_teacher_id');

  const user: User = {
    id,
    login,
    roleName,
    engRoleName,
    roleId,
    externalTeacherId: externalTeacherId || null
  };

  const expRaw = r['accessTokenExpiry'] ?? r['AccessTokenExpiry'];
  let accessTokenExpiry: Date | null | undefined;
  if (typeof expRaw === 'string' || typeof expRaw === 'number') {
    const d = new Date(expRaw);
    accessTokenExpiry = Number.isNaN(d.getTime()) ? null : d;
  }

  return {
    accessToken,
    user,
    accessTokenExpiry: accessTokenExpiry ?? undefined
  };
}
