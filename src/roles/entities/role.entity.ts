import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
class StaffPermissions {
    @Prop({required: true, default: false})
    readonly createStaff: boolean

    @Prop({required: true, default: false})
    readonly readStaff: boolean

    @Prop({required: true, default: false})
    readonly updateStaff: boolean

    @Prop({required: true, default: false})
    readonly deleteStaff: boolean

    @Prop({required: true, default: false})
    readonly createCustomer: boolean

    @Prop({required: true, default: false})
    readonly readCustomer: boolean

    @Prop({required: true, default: false})
    readonly updateCustomer: boolean

    @Prop({required: true, default: false})
    readonly deleteCustomer: boolean

    @Prop({required: true, default: false})
    readonly createRole: boolean

    @Prop({required: true, default: false})
    readonly readRole: boolean

    @Prop({required: true, default: false})
    readonly updateRole: boolean

    @Prop({required: true, default: false})
    readonly deleteRole: boolean
}

@Schema()
class CustomerPermissions {
    @Prop({required: true, default: false})
    readonly createData: boolean

    @Prop({required: true, default: false})
    readonly readData: boolean

    @Prop({required: true, default: false})
    readonly updateData: boolean

    @Prop({required: true, default: false})
    readonly deleteData: boolean
}

@Schema()
class Permissions {
    @Prop({ type: () => StaffPermissions, required: true, default: () => new StaffPermissions() })
    readonly staffPermissions: StaffPermissions;

    @Prop({ type: () => CustomerPermissions, required: true, default: () => new CustomerPermissions() })
    readonly customerPermissions: CustomerPermissions;
}

@Schema({timestamps: true})
export class Roles extends Document {
    @Prop({required: true, unique: true})
    readonly roleName: string;

    @Prop({required: false})
    readonly roleDescription?: string;

    @Prop({required: true, type: () => Permissions, default: () => new Permissions() })
    readonly rolePermissions: Permissions;

    @Prop({required: true})
    readonly createdBy: string

    @Prop({required: true})
    readonly updatedBy: string

    @Prop({required: false, default: false})
    readonly deleted?: boolean;

    @Prop({required: false})
    readonly deletedBy?: string;
}
export const RolesSchema = SchemaFactory.createForClass(Roles);