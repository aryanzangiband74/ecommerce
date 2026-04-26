import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { type Observable, tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<unknown> {
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        // console.log('🚀 ~ LoggingInterceptor ~ after: ~ now:', new Date())
        console.log('🚀 ~ LoggingInterceptor ~ Time proccessed: ~ in ms:', Date.now() - now)
      }),
    )
  }
}
