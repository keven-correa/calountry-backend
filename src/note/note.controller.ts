import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { UserRoles } from '../auth/enums/user.roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('note')
@Auth()
@ApiTags('Notes')
@ApiBearerAuth('Bearer')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('create')
  @ApiOperation({summary: "Create a new annotation"})
  @Auth(UserRoles.Admin)
  create(@Body() createNoteDto: CreateNoteDto, @GetUser() user: User) {
    return this.noteService.create(createNoteDto, user);
  }

  @Get()
  @ApiOperation({summary: "Retrieves a list of all notes"})
  @Auth(UserRoles.Admin, UserRoles.User, UserRoles.SuperUser)
  findAll(@GetUser() user: User) {
    return this.noteService.findAll(user);
  }

  @Get('note-details/:id')
  @ApiOperation({summary: "Get information of one note by id"})
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({summary: "Update a note information"})
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    user: User,
  ) {
    return this.noteService.update(id, updateNoteDto, user);
  }

  @Delete(':id')
  @ApiOperation({summary: "Delete a note"})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.noteService.remove(id);
  }
}
