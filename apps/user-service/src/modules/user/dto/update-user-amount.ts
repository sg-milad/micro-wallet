import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserAmountDto {
    @ApiProperty({ required: true })
    amount: number
}