import { CreateUserInput, UpdateUserInput, User } from '../dto/user.dto';

export interface UserRepositoryInterface {
  create(data: CreateUserInput): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: UpdateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  remove(id: string): Promise<User>;
  findProfessionals(): Promise<User[]>;
  findPatients(): Promise<User[]>;
  login(email: string, password: string): Promise<User | null>;
}
