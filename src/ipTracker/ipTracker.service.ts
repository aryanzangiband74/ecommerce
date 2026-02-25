import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IpRecord } from './entities/ip-record.entity'

@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUESTS = 20
  private readonly WINDOW_MINUTES = 1
  private readonly BLOCK_MINUTES = 2
  private readonly TEHRAN_TIMEZONE = 0

  constructor(
    @InjectRepository(IpRecord)
    private readonly ipRepository: Repository<IpRecord>,
  ) {}

  async track(ip: string) {
    const now = new Date()
    const record = await this.ipRepository.findOne({ where: { ip } })
    if (!record) {
      const newRecord = this.ipRepository.create({
        ip,
        requestCount: 1,
        windowStart: now,
        isBlock: false,
        blockUntil: null,
      })
      await this.ipRepository.save(newRecord)
      console.log(`🚀 ~ this IP [${ip}] is first request `, record)
      return
    }

    //checked blocked ip
    if (record.isBlock && record.blockUntil && now < record.blockUntil) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'too many requests',
          message: `you blocked for ${this.BLOCK_MINUTES} minutes`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    //
    const windowEnd = new Date(record.windowStart.getTime() + (this.WINDOW_MINUTES * 60 * 1000 + this.TEHRAN_TIMEZONE))
    if (now > windowEnd) {
      record.requestCount = 1
      record.windowStart = now
      record.isBlock = false
      record.blockUntil = null
    } else {
      if (record.requestCount >= this.MAX_REQUESTS) {
        record.isBlock = true
        record.blockUntil = new Date(now.getTime() + this.BLOCK_MINUTES * 60 * 1000 + this.TEHRAN_TIMEZONE)
      } else {
        record.requestCount += 1
      }
    }
    await this.ipRepository.save(record)

    if (record.isBlock) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'too many requests',
          message: `you blocked for ${this.BLOCK_MINUTES} minutes`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }
  }
}
