import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(input: CreateUserInput) {
    const existingUser = await this.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    return this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
      },
    });
  }
}
