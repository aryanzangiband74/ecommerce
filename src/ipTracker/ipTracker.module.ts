import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IpRecord } from './entities/ip-record.entity'
import { IpTrackerService } from './ipTracker.service'

@Module({
  imports: [TypeOrmModule.forFeature([IpRecord])],
  providers: [IpTrackerService],
  exports: [IpTrackerService],
})
export class IpTrackerModule {}
