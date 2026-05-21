export interface Role {
    id?: string | null;
    name?: string | null;
}

export enum RoleKeys {
    ADMIN = 'Администратор',
    TEACHER = 'Преподаватель',
    STUDENT = 'Студент',
    GUEST = 'Гость'
}

/** Английские имена ролей из БД (eng_name) для сопоставления с RoleKeys */
const ENG_NAME_BY_ROLE_KEY: Partial<Record<string, string>> = {
    [RoleKeys.ADMIN]: 'admin',
    [RoleKeys.TEACHER]: 'teacher',
    [RoleKeys.STUDENT]: 'student',
    [RoleKeys.GUEST]: 'guest'
};

/**
 * Проверка роли пользователя из ответа auth (roleName / engRoleName).
 * Раньше сравнивали только по русскому roleName; при пустом RU или расхождении строк guard отправлял на /access-denied.
 */
export function userMatchesRoleKey(
    user: { roleName?: string | null; engRoleName?: string | null } | null | undefined,
    roleKey: string
): boolean {
    if (!user) return false;
    const raw = user as Record<string, unknown>;
    const ru = String(user.roleName ?? raw['RoleName'] ?? '').trim();
    const en = String(user.engRoleName ?? raw['EngRoleName'] ?? '').trim().toLowerCase();
    if (ru.includes(roleKey)) return true;
    const expectedEn = ENG_NAME_BY_ROLE_KEY[roleKey];
    if (expectedEn && en === expectedEn) return true;
    return false;
}
