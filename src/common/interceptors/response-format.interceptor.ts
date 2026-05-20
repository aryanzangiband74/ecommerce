import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse()
        return {
          success: true,
          message: 'operstion successful',
          data,
          statusCode: response.statusCode,
          timestamp: new Date(),
        }
      }),
    )
  }
}
