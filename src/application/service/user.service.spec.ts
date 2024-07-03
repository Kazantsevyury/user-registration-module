import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './UserService';
import { UserRepository } from '../../core/domain/UserRepository';
import { CreateUserDto } from '../dto/CreateUserDto';
import { UpdateUserDto } from '../dto/UpdateUserDto';
import { User } from '../../core/domain/User';
import { UserRole } from '../../core/domain/UserRole';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: UserRepository;
    const fixedDate = new Date('2023-01-01T00:00:00.000Z');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: 'UserRepository',
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn().mockResolvedValue([{ id: 1, email: 'test@example.com', password: 'password123', role: UserRole.USER, createdAt: fixedDate, updatedAt: fixedDate }]),
                        findOne: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', password: 'password123', role: UserRole.USER, createdAt: fixedDate, updatedAt: fixedDate }),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<UserRepository>('UserRepository');
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should create a user', async () => {
        const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password123' };
        const user: User = new User(1, 'test@example.com', 'password123', UserRole.USER, fixedDate, fixedDate);
        jest.spyOn(userRepository, 'create').mockResolvedValue(undefined);
        expect(await userService.create(createUserDto)).toEqual(expect.objectContaining({
            email: user.email,
            password: user.password,
            role: user.role,
        }));
        expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            email: user.email,
            password: user.password,
            role: user.role,
        }));
    });

    it('should return all users', async () => {
        expect(await userService.findAll()).toEqual(expect.arrayContaining([
            expect.objectContaining({
                email: 'test@example.com',
                password: 'password123',
                role: UserRole.USER,
            })
        ]));
    });

    it('should return a single user', async () => {
        expect(await userService.findOne(1)).toEqual(expect.objectContaining({
            email: 'test@example.com',
            password: 'password123',
            role: UserRole.USER,
        }));
    });

    it('should update a user', async () => {
        const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
        const updatedUser: User = { id: 1, email: 'updated@example.com', password: 'password123', role: UserRole.USER, createdAt: fixedDate, updatedAt: fixedDate };
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(updatedUser);
        jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);
        expect(await userService.update(1, updateUserDto)).toEqual(expect.objectContaining({
            email: updatedUser.email,
            password: updatedUser.password,
            role: updatedUser.role,
        }));
        expect(userRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({
            email: updatedUser.email,
            password: updatedUser.password,
            role: updatedUser.role,
        }));
    });

    it('should remove a user', async () => {
        jest.spyOn(userRepository, 'remove').mockResolvedValue(undefined);
        await userService.remove(1);
        expect(userRepository.remove).toHaveBeenCalledWith(1);
    });
});
