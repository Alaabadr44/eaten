import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLog } from './entities/system-log.entity';
import { SystemLogsService } from './system-logs.service';
import { SystemLogsController } from './system-logs.controller';

import { AuditSubscriber } from './audit.subscriber';
import { UserContextModule } from '../common/user-context/user-context.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SystemLog]), UserContextModule],
  controllers: [SystemLogsController],
  providers: [SystemLogsService, AuditSubscriber],
  exports: [SystemLogsService],
})
export class SystemLogsModule {}
