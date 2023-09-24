import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "apps/user-service/src/common/enum/gender.enum";
import { IsString, IsOptional } from "class-validator";

export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    Username: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName: string;

    @ApiProperty({ enum: Gender, enumName: "Gender", format: "enum", example: Gender.OTHER, })
    @IsString()
    @IsOptional()
    gender: Gender;

    @ApiProperty({ type: Number, })
    @IsOptional()
    @IsOptional()
    amount: number
}