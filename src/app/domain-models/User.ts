export interface User {
    id: string;
    login: string;
    roleName: string;
    engRoleName: string;
    roleId: string | null;
    /** ID преподавателя во внешнем API расписания (0x...). */
    externalTeacherId?: string | null;
    password?: string | null;
}