import { Module } from '@nestjs/common'
import { IpTrackerService } from './ipTracker.service'

@Module({
  providers: [IpTrackerService],
  exports: [IpTrackerService],
})
export class IpTrackerModule {}
