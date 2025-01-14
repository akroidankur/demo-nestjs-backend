import { Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { StaffsService } from 'src/staffs/staffs.service';
import { RolesService } from 'src/roles/roles.service';
import { CustomerPermissions } from 'src/roles/dto/permissions.interface';

@Injectable()
export class CustomersMiddleware implements NestMiddleware {
  private readonly permissionName: string = 'customerPermissions';

  constructor(private readonly staffsService: StaffsService, private readonly rolesService: RolesService,) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await this.getRolePermissions();
      const route = req.originalUrl;
      const method = req.method;

      const customersRoutePattern = /^\/customers\/?$/;
      const customersSearchRoutePattern = /^\/customers\/search\/?(\?.*)?$/;
      const customersIdRoutePattern = /^\/customers\/[a-zA-Z0-9]+\/?$/;

      if (customersRoutePattern.test(route)) {
        switch (method) {
          case 'GET':
            if (!permissions.readData) return res.status(403).json({ error: 'Forbidden' });
            break;
          case 'POST':
            if (!permissions.createData) return res.status(403).json({ error: 'Forbidden' });
            break;
          default:
            break;
        }
      } else if (customersSearchRoutePattern.test(route)) {
        if (method === 'GET' && !permissions.readData) return res.status(403).json({ error: 'Forbidden' });
      } else if (customersIdRoutePattern.test(route)) {
        switch (method) {
          case 'GET':
            if (!permissions.readData) return res.status(403).json({ error: 'Forbidden' });
            break;
          case 'PATCH':
            if (!permissions.updateData || !permissions.deleteData) return res.status(403).json({ error: 'Forbidden' });
            break;
          case 'DELETE':
            // if (!permissions.deleteCustomer) 
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

  async getRolePermissions(): Promise<CustomerPermissions> {
    try {
      const getUserId = await this.staffsService.getUserId();
      const getUser = await this.staffsService.getStaffById(getUserId);
      const roleId = getUser.role._id 

      const getRole = await this.rolesService.getRoleById(roleId);
      const getPermission = getRole.rolePermissions;
      return getPermission[this.permissionName];
    } catch (error) {
      console.error('Error in getRolePermissions:', error);
      throw new InternalServerErrorException('Failed to retrieve role permissions.');
    }
  }
}
