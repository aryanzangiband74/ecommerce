import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const message = exception.message
    const timestamp = new Date().toISOString()
    const path = request.url

    return response.status(Number(status)).json({
      success: false,
      statusCode: status,
      message,
      timestamp,
      path,
    })
  }
}
