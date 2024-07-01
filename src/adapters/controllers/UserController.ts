import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../../application/service/UserService';
import { CreateUserDto } from '../../application/dto/CreateUserDto';
import { UpdateUserDto } from '../../application/dto/UpdateUserDto';
import { User } from '../../core/domain/User';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        const userId = parseInt(id, 10);
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        const userId = parseInt(id, 10);
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return this.userService.remove(userId);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        const userId = parseInt(id, 10);
        const updatedUser = await this.userService.update(userId, updateUserDto);
        if (!updatedUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return updatedUser;
    }
}
