export enum Role {
    ADMIN = "admin",
    STAFF = "staff",
    MANAGER = 'manager',
    GUEST = "guest",
}
export interface User {
    id?: String,
    first_name: String,
    last_name: String,
    role: Role,
}