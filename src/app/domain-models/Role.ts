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
