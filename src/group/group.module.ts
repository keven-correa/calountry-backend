import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';

import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [TypeOrmModule.forFeature([Group]), AuthModule],
  exports: [GroupModule],
})
export class GroupModule {}
