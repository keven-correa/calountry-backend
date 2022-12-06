import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/index';
import { Auth } from './decorators';
import { UserRoles } from './enums/user.roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication and user management')
@ApiBearerAuth('Bearer')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: "Register new user"})
  @Post('users/register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiOperation({summary: "Login access"})
  @Post('users/login')
  @HttpCode(200)
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({summary: "Retrieve a list of all users"})
  @Get('users')
  findAll() {
    return this.authService.findAll();
  }

  @ApiOperation({summary: "Search for a user based on a search term (Name or Last Name or Username)"})
  @Get('users/:term')
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @ApiOperation({summary: "Retrieves the groups to which the user belongs"})
  @Get('users/groups/:id')
  findGroupsByUser(@Param('id') id: string) {
    return this.authService.getGroupsByUser(id);
  }

  @ApiOperation({summary: "Get user information by user id"})
  @Put('users/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthDto: UpdateUserDto,
  ) {
    return this.authService.update(id, updateAuthDto);
  }

  @ApiOperation({summary: "Delete user"})
  @Delete('users/:id')
  @Auth(UserRoles.Admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
