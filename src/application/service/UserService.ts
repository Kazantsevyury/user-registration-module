import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../core/domain/User';
import { CreateUserDto } from '../dto/CreateUserDto';
import { UserRepository } from '../../core/domain/UserRepository';
import { UserRole } from '../../core/domain/UserRole';

@Injectable()
export class UserService {
    constructor(
        @Inject('UserRepository') private readonly userRepository: UserRepository,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const users = this.userRepository.readFromFile();
        const newUser = new User(
            users.length ? users[users.length - 1].id + 1 : 1,
            createUserDto.email,
            createUserDto.password,
            UserRole.USER,
            new Date(),
            new Date()
        );
        users.push(newUser);
        this.userRepository.writeToFile(users);
        return newUser;
    }
}
