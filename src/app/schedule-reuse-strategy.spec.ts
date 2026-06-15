import { ScheduleReuseStrategy } from './schedule-reuse-strategy';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('ScheduleReuseStrategy', () => {
  let strategy: ScheduleReuseStrategy;

  const createRoute = (path: string): ActivatedRouteSnapshot => ({
    routeConfig: { path },
    paramMap: { get: () => null },
    queryParamMap: { get: () => null },
    fragment: null,
    data: {},
    outlet: 'primary',
    component: null,
    children: [],
    parent: null,
    root: null as any,
    pathFromRoot: [],
    url: [],
    params: {},
    queryParams: {},
    snapshot: { paramMap: { get: () => null } } as any,
    toString: () => ''
  });

  const createRouteHandle = (): any => ({ componentRef: null });

  beforeEach(() => {
    strategy = new ScheduleReuseStrategy();
  });

  describe('schedule route (empty path)', () => {
    it('should detach for the schedule root path', () => {
      const route = createRoute('');
      expect(strategy.shouldDetach(route)).toBe(true);
    });

    it('should store the handle for the schedule root path', () => {
      const route = createRoute('');
      const handle = createRouteHandle();
      strategy.store(route, handle);
      // Verify by retrieving
      expect(strategy.retrieve(route)).toBe(handle);
    });

    it('should attach for the schedule root path when handle is stored', () => {
      const route = createRoute('');
      const handle = createRouteHandle();
      strategy.store(route, handle);
      expect(strategy.shouldAttach(route)).toBe(true);
    });

    it('should not attach for the schedule root path when no handle is stored', () => {
      const route = createRoute('');
      expect(strategy.shouldAttach(route)).toBe(false);
    });

    it('should retrieve the stored handle for the schedule root path', () => {
      const route = createRoute('');
      const handle = createRouteHandle();
      strategy.store(route, handle);
      expect(strategy.retrieve(route)).toBe(handle);
    });
  });

  describe('favorites route', () => {
    it('should detach for the favorites route', () => {
      const route = createRoute('favorites/:eventIndex');
      expect(strategy.shouldDetach(route)).toBe(true);
    });

    it('should store the handle for the favorites route', () => {
      const route = createRoute('favorites/:eventIndex');
      const handle = createRouteHandle();
      strategy.store(route, handle);
      expect(strategy.retrieve(route)).toBe(handle);
    });

    it('should attach for the favorites route when handle is stored', () => {
      const route = createRoute('favorites/:eventIndex');
      const handle = createRouteHandle();
      strategy.store(route, handle);
      expect(strategy.shouldAttach(route)).toBe(true);
    });

    it('should not attach for the favorites route when no handle is stored', () => {
      const route = createRoute('favorites/:eventIndex');
      expect(strategy.shouldAttach(route)).toBe(false);
    });

    it('should retrieve the stored handle for the favorites route', () => {
      const route = createRoute('favorites/:eventIndex');
      const handle = createRouteHandle();
      strategy.store(route, handle);
      expect(strategy.retrieve(route)).toBe(handle);
    });
  });

  describe('other routes', () => {
    it('should not detach for other routes', () => {
      const route = createRoute('other');
      expect(strategy.shouldDetach(route)).toBe(false);
    });

    it('should not store handles for other routes', () => {
      const route = createRoute('other');
      const handle = createRouteHandle();
      strategy.store(route, handle);
      expect(strategy.retrieve(route)).toBeNull();
    });

    it('should not attach for other routes', () => {
      const route = createRoute('other');
      expect(strategy.shouldAttach(route)).toBe(false);
    });

    it('should return null when retrieving other routes', () => {
      const route = createRoute('other');
      expect(strategy.retrieve(route)).toBeNull();
    });
  });

  describe('independent storage', () => {
    it('should store schedule and favorites handles independently', () => {
      const scheduleRoute = createRoute('');
      const favoritesRoute = createRoute('favorites/:eventIndex');
      const scheduleHandle = createRouteHandle();
      const favoritesHandle = createRouteHandle();

      strategy.store(scheduleRoute, scheduleHandle);
      strategy.store(favoritesRoute, favoritesHandle);

      expect(strategy.retrieve(scheduleRoute)).toBe(scheduleHandle);
      expect(strategy.retrieve(favoritesRoute)).toBe(favoritesHandle);
    });

    it('should allow attaching both routes independently', () => {
      const scheduleRoute = createRoute('');
      const favoritesRoute = createRoute('favorites/:eventIndex');
      const scheduleHandle = createRouteHandle();
      const favoritesHandle = createRouteHandle();

      strategy.store(scheduleRoute, scheduleHandle);
      strategy.store(favoritesRoute, favoritesHandle);

      expect(strategy.shouldAttach(scheduleRoute)).toBe(true);
      expect(strategy.shouldAttach(favoritesRoute)).toBe(true);
    });
  });

  describe('shouldReuseRoute', () => {
    it('should return true when future and current routes have the same config', () => {
      const route = createRoute('');
      expect(strategy.shouldReuseRoute(route, route)).toBe(true);
    });

    it('should return false when future and current routes have different configs', () => {
      const route1 = createRoute('');
      const route2 = createRoute('favorites/:eventIndex');
      expect(strategy.shouldReuseRoute(route1, route2)).toBe(false);
    });
  });
});
