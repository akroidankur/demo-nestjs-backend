import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Role{
    @IsNotEmpty()
    @IsString()
    readonly _id: string;

    @IsOptional()
    @IsString()
    name: string;
}