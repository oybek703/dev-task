import {Request, Response, NextFunction} from 'express'

function asyncMiddleware(handler: Function) {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            await handler(req, res, next)
        } catch (e) {
            next(e)
        }
    }
}

export default asyncMiddleware