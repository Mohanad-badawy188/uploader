import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: {
          files: {
            select: {
              status: true,
              createdAt: true,
            },
          },
          activities: {
            select: {
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);

    const data = users.map((user) => {
      const totalFiles = user.files.length;
      const processedFiles = user.files.filter(
        (f) => f.status === 'complete',
      ).length;
      const lastActivity =
        user.activities.sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
        )[0]?.createdAt ?? null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalFiles,
        processedFiles,
        lastActivity,
      };
    });

    return {
      data,
      total,
      page,
      pageSize: limit,
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
