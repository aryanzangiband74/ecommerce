import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IpRecord } from 'src/ipTracker/entities/ip-record.entity'
import { CleanupJob } from './jobs/cleanup.job'
import { TasksService } from './tasks.service'

@Module({
  imports: [TypeOrmModule.forFeature([IpRecord])],
  providers: [TasksService, CleanupJob],
})
export class TasksModule {}
