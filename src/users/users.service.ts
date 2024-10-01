import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      if (createUserDto) {
        const data = await this.prismaService.user.upsert({
          create: createUserDto,
          update: {
            email: createUserDto.email,
            name: createUserDto.name,
            picture: createUserDto.picture,
          },
          where: { id: createUserDto.id },
        });

        return { message: data, error: null };
      } else throw Error();
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }
}
