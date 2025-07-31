import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    // Crear el usuario
    const user = await this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });

    // Retornar sin la contraseña
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

    // Encriptar la contraseña si se está actualizando
    const data = {
      ...updateUserInput,
      ...(updateUserInput.password && {
        password: await bcrypt.hash(updateUserInput.password, 10),
      }),
    };

    return await this.userRepository.update(id, data);
  }

  async remove(id: string): Promise<User> {
    return await this.userRepository.remove(id);
  }

  async findProfessionals(): Promise<User[]> {
    return this.userRepository.findProfessionals();
  }

  async findPatients(): Promise<User[]> {
    return this.userRepository.findPatients();
  }
}
