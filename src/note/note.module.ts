import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { Note } from './entities/note.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [NoteController],
  providers: [NoteService],
  imports: [TypeOrmModule.forFeature([Note]), AuthModule],
  exports: [TypeOrmModule],
})
export class NoteModule {}
