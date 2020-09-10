
export abstract class AbstractCacheService {

  abstract put(key: string, value: any);
  abstract get(key: string): any;
  abstract remove(key: string);

}
