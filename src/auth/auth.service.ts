import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/index';
import { isUUID } from 'class-validator';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findByIds(ids: Array<string>) {
    return await this.userRepository.find({
      where: { id: In(ids) },
      cache: 1500,
    });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password && delete user.isActive;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, user_name } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { user_name },
      select: {
        id: true,
        name: true,
        last_name: true,
        user_name: true,
        email: true,
        password: true,
        country: true,
        phone_number: true,
        role: true,
        technologies: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (user_name)');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async findAll() {
    const users = await this.userRepository.find({ cache: 1500 });
    return users;
  }

  async findOne(term: string) {
    let user: User;
    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('use');
      user = await queryBuilder
        .where(
          `UPPER(name) =:name or UPPER(last_name) =:last_name
          or UPPER(user_name) =:user_name`,
          {
            name: term.toUpperCase(),
            last_name: term.toUpperCase(),
            user_name: term.toUpperCase(),
          },
        )
        .getOne();
    }

    if (!user) {
      throw new NotFoundException(`User with ${term} not found`);
    }
    return user;
  }

  async getGroupsByUser(id: string) {
    try {
      const { groups } = await this.userRepository.findOne({
        relations: { groups: true },
        where: { id: id },
      });
      return groups;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: string) {
    const user: User = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: `User with ${id} was removed` };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
