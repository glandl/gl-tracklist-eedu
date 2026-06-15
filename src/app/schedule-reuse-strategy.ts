import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class ScheduleReuseStrategy implements RouteReuseStrategy {
  private storedSchedule: DetachedRouteHandle | null = null;
  private storedFavorites: DetachedRouteHandle | null = null;

  private isScheduleRoute(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig?.path === '';
  }

  private isFavoritesRoute(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig?.path === 'favorites/:eventIndex';
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.isScheduleRoute(route) || this.isFavoritesRoute(route);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (this.isScheduleRoute(route)) {
      this.storedSchedule = handle;
    } else if (this.isFavoritesRoute(route)) {
      this.storedFavorites = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (this.isScheduleRoute(route)) {
      return this.storedSchedule !== null;
    } else if (this.isFavoritesRoute(route)) {
      return this.storedFavorites !== null;
    }
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (this.isScheduleRoute(route)) {
      return this.storedSchedule;
    } else if (this.isFavoritesRoute(route)) {
      return this.storedFavorites;
    }
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
