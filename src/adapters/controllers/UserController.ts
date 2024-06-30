import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../../application/service/UserService';
import { CreateUserDto } from '../../application/dto/CreateUserDto';
import { User } from '../../core/domain/User';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }
}
