import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class BodyLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const body = req.body
    if (!body || Object.keys(body)?.length === 0) {
      return res.status(400).send({ statusCode: 400, message: 'add body' })
    } else {
      console.log('🚀 ~ BodyLoggerMiddleware ~ use ~ body:', body)
    }

    next()
  }
}
