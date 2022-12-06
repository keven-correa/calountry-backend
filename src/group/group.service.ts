import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  private readonly logger = new Logger('GroupService');
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    try {
      const { users = [], ...rest } = createGroupDto;
      const ids = await this.authService.findByIds(users);
      const saveGroup = this.groupRepository.create({
        ...rest,
        users: ids,
      });
      return await this.groupRepository.save(saveGroup);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const groups = await this.groupRepository.find({cache: 1500});
    return groups;
  }

  async getGroupWithMembers(id: string) {
    const group = await this.groupRepository.find({
      relations: ['users'],
      where: { id: id },
      cache: 1500
    });
    if (!group) {
      throw new NotFoundException(`Group with id: ${id} not found`);
    }
    return group;
  }

  async findOne(id: string) {
    const group = await this.groupRepository.findOneBy({ id });
    if (!group) {
      throw new NotFoundException(`Group with id: ${id} not found`);
    }
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    try {
      const { users = [], ...rest } = updateGroupDto;
      const ids = await this.authService.findByIds(users);
      const group = await this.groupRepository.preload({
        id,
        ...rest,
        users: ids,
      });
      await this.groupRepository.save(group);
      return {
        group,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const group = await this.findOne(id);
    if (!group) {
      throw new NotFoundException(`Group with id: ${id} not found`);
    }
    await this.groupRepository.remove(group);
    return { message: `The group with id: ${id} was removed` };
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
