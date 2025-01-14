import { IsBoolean, IsNotEmpty, IsObject } from "class-validator";

class StaffPermissions {
    @IsBoolean()
    readonly createStaff: boolean

    @IsBoolean()
    readonly readStaff: boolean

    @IsBoolean()
    readonly updateStaff: boolean

    @IsBoolean()
    readonly deleteStaff: boolean

    @IsBoolean()
    readonly createCustomer: boolean

    @IsBoolean()
    readonly readCustomer: boolean

    @IsBoolean()
    readonly updateCustomer: boolean

    @IsBoolean()
    readonly deleteCustomer: boolean

    @IsBoolean()
    readonly createRole: boolean

    @IsBoolean()
    readonly readRole: boolean

    @IsBoolean()
    readonly updateRole: boolean

    @IsBoolean()
    readonly deleteRole: boolean
}

class CustomerPermissions {
    @IsBoolean()
    readonly createData: boolean

    @IsBoolean()
    readonly readData: boolean

    @IsBoolean()
    readonly updateData: boolean

    @IsBoolean()
    readonly deleteData: boolean
}

export class PermissionsDto{
    @IsObject()
    @IsNotEmpty()
    readonly staffPermissions: StaffPermissions;

    @IsObject()
    @IsNotEmpty()
    readonly customerPermissions: CustomerPermissions;
}