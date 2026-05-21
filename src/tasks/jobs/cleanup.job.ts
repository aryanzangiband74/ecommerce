import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IpRecord } from 'src/ipTracker/entities/ip-record.entity'
import { LessThan, Repository } from 'typeorm'

@Injectable()
export class CleanupJob {
  constructor(
    @InjectRepository(IpRecord)
    private readonly ipRecordRepository: Repository<IpRecord>,
  ) {}
  async cleanOldIpRecords() {
    const oldIpRecords = await this.ipRecordRepository.find({
      where: {
        blockUntil: LessThan(new Date()),
        isBlock: false,
      },
    })
    if (oldIpRecords.length > 0) {
      await this.ipRecordRepository.delete(oldIpRecords.map((record) => record.id))
      console.log(`🚀 ~ CleanupJob ~ cleanOldIpRecords ~ deleted ${oldIpRecords.length} ip records`)
    }
  }
}
