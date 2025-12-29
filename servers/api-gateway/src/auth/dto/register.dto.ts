import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({
        example: 'John',
        description: 'First name of the user',
    })
    @IsString()
    firstName: string;
    @ApiProperty({
        example: 'Doe',
        description: 'Last name of the user',
    })
    @IsString()
    lastName: string;
    @ApiProperty({
        example: 'john@example.com',
        description: 'Email address of the user',
    })
    @IsEmail()
    email: string;
    @ApiProperty({
        example: 'strongPassword123',
        description: 'Password for the user account',
    })
    @IsString()
    password: string;
}