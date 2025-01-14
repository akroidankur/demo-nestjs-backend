import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import * as passport from 'passport';
import { StaffsService } from './staffs/staffs.service';

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  private readonly excludedRoutes = ['/auth/login', '/auth/logout'];
  private readonly trackedRoutes = [
    /^\/customers\/[a-zA-Z0-9]+\/?$/,
    /^\/roles\/[a-zA-Z0-9]+\/?$/,
    /^\/staffs\/[a-zA-Z0-9]+\/?$/,
  ];

  constructor(
    private readonly jwtService: JwtStrategy,
    private readonly staffService: StaffsService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.isExcludedRoute(req.path)) {
        return next();
      }

      passport.authenticate('jwt', { session: false }, async (err: any, user: any) => {
        
        if (!err && !user) {
          return res.status(420).json({ error: `User not found! Login first` });
        }
        else if (err) {
          return res.status(401).json({ error: `Unauthorized ${err.message}` });
        }
        else if (user) {
          if (req.method === 'PATCH' && this.shouldTrackRoute(req.path)) {
            const body = req.body;
            if (body && body.deleted) {
              console.log('Task to be performed for PATCH request with deleted true on tracked route:', req.path);
            }
          }

          this.setCreatedByAndUpdatedBy(req);
          next();
        }
      })(req, res, next);
    } catch (error) {
      console.log(error);
      
      res.status(500).json({ error: `Internal Server Error ${error.message}` });
    }
  }

  private async setCreatedByAndUpdatedBy(req: Request): Promise<void> {
    if (!req.body.createdBy || req.body.createdBy === '' || req.body.createdBy === undefined) {
      req.body.createdBy = this.jwtService.userId;
    }
    req.body.deleted ? (req.body.deletedBy = this.jwtService.userId) : (req.body.deletedBy = null);

    req.body.updatedBy = this.jwtService.userId;
    await this.staffService.setUserId(this.jwtService.userId);
  }

  private isExcludedRoute(path: string): boolean {
    return this.excludedRoutes.some((excludedPath) => path.startsWith(excludedPath));
  }

  private shouldTrackRoute(path: string): boolean {
    return this.trackedRoutes.some((pattern) => pattern.test(path));
  }
}
