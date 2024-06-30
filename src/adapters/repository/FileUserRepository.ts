import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../core/domain/UserRepository';
import { User } from '../../core/domain/User';

@Injectable()
export class FileUserRepository implements UserRepository {
    private readonly filePath = path.resolve(__dirname, 'users.json');

    constructor() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]));
        }
    }

    readFromFile(): User[] {
        const fileData = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(fileData).map((user: any) => new User(
            user.id,
            user.email,
            user.password,
            user.role,
            new Date(user.createdAt),
            new Date(user.updatedAt)
        ));
    }

    writeToFile(users: User[]): void {
        fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
    }
}
