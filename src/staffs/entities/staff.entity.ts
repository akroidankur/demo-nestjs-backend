import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema()
class Role{
    @Prop({ type: Types.ObjectId, ref: 'Roles', required: true })
    readonly _id: string;

    @Prop({ required: false })
    readonly name?: string;
}

@Schema({timestamps: true})
export class Staff extends Document {
    @Prop({ required: true })
    readonly fullName: string;

    @Prop({ required: true, unique: true })
    readonly username: string;
  
    @Prop({ required: true, unique: true })
    readonly email: string;
  
    @Prop({ required: true })
    readonly password: string;

    @Prop({ required: true, unique: true })
    readonly phone: string;

    @Prop({ required: true })
    readonly status: string;

    @Prop({required: true, type: Object })
    readonly role: Role;

    @Prop({ required: true })
    readonly createdBy: string

    @Prop({ required: true })
    readonly updatedBy: string;

    @Prop({ required: false, default: false })
    readonly deleted?: boolean;

    @Prop({ required: false })
    readonly deletedBy?: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

StaffSchema.pre('validate', function (next) {
    if (this.role && !this.role._id) {
        next(new Error('Invalid Role ID'));
    }
    next();
});