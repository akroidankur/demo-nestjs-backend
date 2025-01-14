import {  Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { StaffsService } from 'src/staffs/staffs.service';
import { RolesService } from './roles.service';
import { StaffPermissions } from './dto/permissions.interface';

@Injectable()
export class RolesMiddleware implements NestMiddleware {
  private readonly permissionName: string = 'staffPermissions';

  constructor(private readonly staffsService: StaffsService, private readonly rolesService: RolesService,) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await this.getRolePermissions();
      const route = req.originalUrl;
      const method = req.method;

      const rolesRoutePattern = /^\/roles\/?$/;
      const rolesSearchRoutePattern = /^\/roles\/search\/?(\?.*)?$/;
      const rolesIdRoutePattern = /^\/roles\/[a-zA-Z0-9]+\/?$/;

      if (rolesRoutePattern.test(route)) {
        switch (method) {
          case 'GET':
            if (!permissions.readRole) return res.status(403).json({ error: 'Forbidden' });
            break;
          case 'POST':
            if (!permissions.createRole) return res.status(403).json({ error: 'Forbidden' });
            break;
          default:
            break;
        }
      } else if (rolesSearchRoutePattern.test(route)) {
        if (method === 'GET' && !permissions.readRole) return res.status(403).json({ error: 'Forbidden' });
      } else if (rolesIdRoutePattern.test(route)) {
        switch (method) {
          case 'GET':            
            if (!permissions.readRole) return res.status(403).json({ error: 'Forbidden' });
            break;
          case 'PATCH':
            if (!permissions.updateRole || !permissions.deleteRole) return res.status(403).json({ error: 'Forbidden' });
            break;
          case 'DELETE':
            // if (!permissions.deleteRole) 
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
      const roleId = getUser.role._id 

      const getRole = await this.rolesService.getRoleById(roleId);
      const getPermission = getRole.rolePermissions;
      return getPermission[this.permissionName];
    } catch {
      throw new InternalServerErrorException('Failed to retrieve role permissions.');
    }
  }
}
