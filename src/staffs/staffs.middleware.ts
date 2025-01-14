import { Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { StaffsService } from './staffs.service';
import { RolesService } from 'src/roles/roles.service';
import { StaffPermissions } from 'src/roles/dto/permissions.interface';

@Injectable()
export class StaffsMiddleware implements NestMiddleware {
  private readonly permissionName: string = 'staffPermissions';

  constructor(private readonly staffsService: StaffsService, private readonly rolesService: RolesService,) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await this.getRolePermissions();
      const route = req.originalUrl;
      const method = req.method;

      const staffsRoutePattern = /^\/staffs\/?$/;
      const staffsSearchRoutePattern = /^\/staffs\/search\/?(\?.*)?$/;
      const staffsIdRoutePattern = /^\/staffs\/[a-zA-Z0-9]+\/?$/;
      const staffsUsernameRoutePattern = /^\/staffs\/username\/[a-zA-Z0-9]+\/?$/;
      const staffsEmailRoutePattern = /^\/staffs\/email\/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/?$/;

      if (staffsRoutePattern.test(route)) {
        switch (method) {
          case 'GET':
            if (!permissions.readStaff) return res.status(403).json({ error: 'Forbidden' });
            break;
          case 'POST':
            if (!permissions.createStaff) return res.status(403).json({ error: 'Forbidden' });
            break;
          default:
            break;
        }
      } else if (staffsSearchRoutePattern.test(route)) {
        if (method === 'GET' && !permissions.readStaff) return res.status(403).json({ error: 'Forbidden' });
      } else if (staffsUsernameRoutePattern.test(route)) {
        if (method === 'GET' && !permissions.readStaff) return res.status(403).json({ error: 'Forbidden' });
      } else if (staffsEmailRoutePattern.test(route)) {
        if (method === 'GET' && !permissions.readStaff) return res.status(403).json({ error: 'Forbidden' });
      } else if (staffsIdRoutePattern.test(route)) {
        switch (method) {
          case 'GET':
            if (!permissions.readStaff) return res.status(403).json({ error: 'Forbidden' });
            break;
          case 'PATCH':
            if (!permissions.updateStaff || !permissions.deleteStaff) return res.status(403).json({ error: 'Forbidden' });
            break;
          case 'DELETE':
            // if (!permissions.deleteStaff) 
            return res.status(403).json({ error: 'Forbidden' });
            break;
          default:
            break;
        }
      } else {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getRolePermissions(): Promise<StaffPermissions> {
    try {
      const getUserId = await this.staffsService.getUserId();
      const getUser = await this.staffsService.getStaffById(getUserId);
      const roleId = getUser.role._id;

      const getRole = await this.rolesService.getRoleById(roleId);
      const getPermission = getRole.rolePermissions;
      return getPermission[this.permissionName];
    } catch {
      throw new InternalServerErrorException('Failed to retrieve role permissions.');
    }
  }
}
