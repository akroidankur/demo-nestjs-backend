import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
    @Prop({ required: true })
    readonly fullName: string;

    @Prop({ required: true, unique: true, length: 12 })
    readonly phone: string;

    @Prop({ required: true })
    readonly password: string;

    @Prop({ required: true })
    readonly createdBy: string

    @Prop({ required: true })
    readonly updatedBy: string;

    @Prop({required: false, default: false})
    readonly deleted?: boolean;

    @Prop({required: false})
    readonly deletedBy?: string;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
