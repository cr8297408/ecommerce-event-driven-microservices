import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @ApiProperty({ example: "jhon@example.com", description: "User email" })
    email: string;
    @IsString()
    @ApiProperty({ example: "strongPassword123", description: "User password" })
    password: string;
}