import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto, UpdateNoteDto } from './dto/index';
import { Note } from './entities/note.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class NoteService {
  private readonly logger = new Logger('NoteService');

  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    try {
      const note = this.noteRepository.create({
        ...createNoteDto,
        user,
      });
      await this.noteRepository.save(note);
      return note;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(loggedUser: User) {
    const notes = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoin('note.user', 'user')
      // .addSelect(['user.id', 'user.user_name']) //
      .where('user.id = :id', {
        id: loggedUser.id,
      })
      .cache(2500)
      .getMany();
    return notes;
  }

  async findOne(id: string) {
    const note = await this.noteRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Note with id: ${id} not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, user: User) {
    const note = await this.noteRepository.preload({
      id,
      ...updateNoteDto,
      user,
    });
    await this.noteRepository.save(note);
    return note;
  }

  async remove(id: string) {
    const note = await this.findOne(id);
    await this.noteRepository.remove(note);
    return { message: `The note with id: ${id} was removed` };
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
