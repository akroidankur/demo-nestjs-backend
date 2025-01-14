export class StaffPermissions {
    readonly createStaff: boolean;
    readonly readStaff: boolean;
    readonly updateStaff: boolean;
    readonly deleteStaff: boolean;
    readonly createCustomer: boolean;
    readonly readCustomer: boolean;
    readonly updateCustomer: boolean;
    readonly deleteCustomer: boolean;
    readonly createRole: boolean;
    readonly readRole: boolean;
    readonly updateRole: boolean;
    readonly deleteRole: boolean;
}

export class CustomerPermissions {
    readonly createData: boolean;
    readonly readData: boolean;
    readonly updateData: boolean;
    readonly deleteData: boolean;
}

export class RolePermissions {
    readonly staffPermissions: StaffPermissions;
}
export class Roles {
    readonly roleName: string;
    readonly rolePermissions: RolePermissions;
    readonly deleted?: boolean;
    readonly deletedBy?: string;
}
