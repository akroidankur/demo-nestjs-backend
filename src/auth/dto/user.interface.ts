import { RolePermissions } from "src/roles/dto/permissions.interface";

export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  roleID: string;
  roleName: string;
  permissions: RolePermissions;
  fullName: string;
}