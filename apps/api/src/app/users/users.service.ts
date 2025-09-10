import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
import type { UserRepositoryInterface } from '../../interfaces/users.repository.interface';
import { CreateUserInput, UpdateUserInput, User } from '../../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface
  ) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(
      createUserInput.email
    );

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }
    const user = await this.userRepository.create(createUserInput);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    // Si se está actualizando el email, verificar que no exista
    if (updateUserInput.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserInput.email
      );

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    return await this.userRepository.update(id, updateUserInput);
  }

  async remove(id: string): Promise<User> {
    return await this.userRepository.remove(id);
  }

  async findProfessionals(): Promise<User[]> {
    return this.userRepository.findProfessionals();
  }
  async findProfessionalsByQuery(
    name?: string,
    specialty?: string[]
  ): Promise<User[]> {
    return this.userRepository.findProfessionalsByQuery(name, specialty);
  }

  async findPatients(): Promise<User[]> {
    return this.userRepository.findPatients();
  }
}
