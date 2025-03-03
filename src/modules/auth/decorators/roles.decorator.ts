import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to specify the required roles to access a route
 * @param roles - List of allowed roles
 * @example
 * @Roles('admin', 'super_admin')
 * @Get('protected-route')
 * async protectedRoute() {
 *   // Only accessible for users with role 'admin' or 'super_admin'
 * }
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
