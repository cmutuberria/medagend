import { PrismaService } from '@med-agend/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  convertPrismaToDto,
  CreateUserInput,
  UpdateUserInput,
  User,
} from '../dto/user.dto';
import type { UserRepositoryInterface } from '../interfaces/users.repository.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserPrismaRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
    });
    return convertPrismaToDto(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(convertPrismaToDto);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? convertPrismaToDto(user) : null;
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    try {
      // Encriptar la contraseña si se está actualizando
      const dataToUpdate = {
        ...data,
        ...(data.password && {
          password: await bcrypt.hash(data.password, 10),
        }),
      };
      const user = await this.prisma.user.update({ where: { id }, data });
      return convertPrismaToDto(user);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? convertPrismaToDto(user) : null;
  }

  async findProfessionals(): Promise<User[]> {
    const professionals = await this.prisma.user.findMany({
      where: { role: 'PROFESSIONAL' },
    });
    return professionals.map(convertPrismaToDto);
  }
  async findProfessionalsByQuery(
    name?: string,
    specialty?: string[]
  ): Promise<User[]> {
    const professionals = await this.prisma.user.findMany({
      where: {
        role: 'PROFESSIONAL',
        ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
        ...(specialty
          ? { specialty: { in: specialty, mode: 'insensitive' } }
          : {}),
      },
    });
    return professionals.map(convertPrismaToDto);
  }

  async findPatients(): Promise<User[]> {
    const patients = await this.prisma.user.findMany({
      where: { role: 'PATIENT' },
    });
    return patients.map(convertPrismaToDto);
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.delete({ where: { id } });
      return convertPrismaToDto(user);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    return match ? convertPrismaToDto(user) : null;
  }
}
