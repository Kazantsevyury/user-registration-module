import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../application/service/UserService';
import { CreateUserDto } from '../../application/dto/CreateUserDto';
import { UpdateUserDto } from '../../application/dto/UpdateUserDto';
import {UserController} from "./UserController";

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', password: 'password123' }),
                        findOne: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', password: 'password123' }),
                        findAll: jest.fn().mockResolvedValue([{ id: 1, email: 'test@example.com', password: 'password123' }]),
                        remove: jest.fn().mockResolvedValue(undefined),
                        update: jest.fn().mockResolvedValue({ id: 1, email: 'updated@example.com', password: 'password123' }),
                    },
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    it('should create a user', async () => {
        const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password123' };
        expect(await userController.create(createUserDto)).toEqual({ id: 1, email: 'test@example.com', password: 'password123' });
    });

    it('should return all users', async () => {
        expect(await userController.findAll()).toEqual([{ id: 1, email: 'test@example.com', password: 'password123' }]);
    });

    it('should return a single user', async () => {
        expect(await userController.findOne('1')).toEqual({ id: 1, email: 'test@example.com', password: 'password123' });
    });

    it('should update a user', async () => {
        const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
        expect(await userController.update('1', updateUserDto)).toEqual({ id: 1, email: 'updated@example.com', password: 'password123' });
    });

    it('should remove a user', async () => {
        expect(await userController.remove('1')).toBeUndefined();
    });
});
