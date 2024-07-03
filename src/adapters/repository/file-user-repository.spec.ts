import { Test, TestingModule } from '@nestjs/testing';
import { FileUserRepository } from './FileUserRepository';
import { User } from '../../core/domain/User';
import * as fs from 'fs';
import { UserRole } from '../../core/domain/UserRole';

jest.mock('fs');

describe('FileUserRepository', () => {
    let fileUserRepository: FileUserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileUserRepository],
        }).compile();

        fileUserRepository = module.get<FileUserRepository>(FileUserRepository);
    });

    it('should be defined', () => {
        expect(fileUserRepository).toBeDefined();
    });

    it('should create a user', async () => {
        const user: User = new User(1, 'test@example.com', 'password123', UserRole.USER, new Date(), new Date());
        const users: User[] = [];
        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(users));
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { });
        await fileUserRepository.create(user);
        expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([user], null, 2));
    });

    it('should return all users', async () => {
        const users: User[] = [new User(1, 'test@example.com', 'password123', UserRole.USER, new Date(), new Date())];
        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(users));
        expect(await fileUserRepository.findAll()).toEqual(users);
    });

    it('should return a single user', async () => {
        const user: User = new User(1, 'test@example.com', 'password123', UserRole.USER, new Date(), new Date());
        const users: User[] = [user];
        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(users));
        expect(await fileUserRepository.findOne(1)).toEqual(user);
    });

    it('should update a user', async () => {
        const user: User = new User(1, 'updated@example.com', 'password123', UserRole.USER, new Date(), new Date());
        const users: User[] = [new User(1, 'test@example.com', 'password123', UserRole.USER, new Date(), new Date())];
        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(users));
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { });
        await fileUserRepository.update(1, user);
        expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([user], null, 2));
    });

    it('should remove a user', async () => {
        const user: User = new User(1, 'test@example.com', 'password123', UserRole.USER, new Date(), new Date());
        const users: User[] = [user];
        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(users));
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { });
        await fileUserRepository.remove(1);
        expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([], null, 2));
    });
});
