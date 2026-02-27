import { HttpStatus } from '@nestjs/common'
import { type CallHandler, type ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { type Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import type { Response } from 'express'
import { ApiResponse } from '../interfaces/response.interface'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    const res = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      map((value) => this.format(value)),
      tap((body: { statusCode: number }) => {
        res.status(body.statusCode)
      }),
    )
  }

  private format(value: T): { statusCode: number; data: unknown; message: string } {
    if (value instanceof ApiResponse) {
      return {
        statusCode: value.statusCode,
        data: value.data,
        message: value.message,
      }
    }

    return {
      statusCode: HttpStatus.OK,
      data: value,
      message: 'Success',
    }
  }
}
