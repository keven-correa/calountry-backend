import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/index';
import { Auth } from 'src/auth/decorators';
import { UserRoles } from '../auth/enums/user.roles';

@ApiTags('Groups')
@ApiBearerAuth('Bearer')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  @ApiOperation({summary: "Create new group"})
  @Auth(UserRoles.Admin)
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({summary: "Retrieve a list of groups"})
  findAll() {
    return this.groupService.findAll();
  }

  @Get('group-details/:id')
  @ApiOperation({summary: "Retrieve a group with members"})
  findGroupWithMembers(@Param('id') id: string) {
    return this.groupService.getGroupWithMembers(id);
  }

  @Get(':id')
  @ApiOperation({summary: "Retrieve a group information by id"})
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({summary: "Update the group information"})
  @Auth(UserRoles.Admin)
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({summary: "Delete a group"})
  @Auth(UserRoles.Admin)
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
