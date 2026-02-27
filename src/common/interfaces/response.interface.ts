import { HttpStatus } from '@nestjs/common'

/**
 * شکل استاندارد پاسخ API
 * Standard API response shape
 */
export interface IApiResponse<T = unknown> {
  statusCode: number
  data: T
  message: string
}

/**
 * کلاس کمکی برای برگرداندن پاسخ یکسان از کنترلرها
 * بدون نیاز به نوشتن دستی res.status().json(...)
 *
 * Helper class so controllers return a consistent response
 * without writing res.status().json(...) by hand.
 */
export class ApiResponse<T = unknown> implements IApiResponse<T> {
  constructor(
    public readonly data: T,
    public readonly message: string = 'Success',
    public readonly statusCode: number = HttpStatus.OK,
  ) {}
}
