import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "apps/user-service/src/common/enum/gender.enum";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    Username: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({ enum: Gender, enumName: "Gender", format: "enum", example: Gender.OTHER, })
    @IsString()
    @IsNotEmpty()
    gender: Gender;
}