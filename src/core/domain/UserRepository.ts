import { User } from './User';

export interface UserRepository {
    readFromFile(): User[];
    writeToFile(users: User[]): void;
}
