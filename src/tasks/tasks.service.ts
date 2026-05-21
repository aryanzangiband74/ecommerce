import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { CleanupJob } from './jobs/cleanup.job'

@Injectable()
export class TasksService {
  constructor(private readonly cleanupJob: CleanupJob) {}

  //   @Timeout('10000') // after 10 seconds run just once

  //   @Interval(10000) // every 10 seconds run every 10 seconds

  @Cron(CronExpression.EVERY_12_HOURS) // every 12 hours run every 12 hours
  cleanOldIpRecords() {
    this.cleanupJob.cleanOldIpRecords()
  }
}
