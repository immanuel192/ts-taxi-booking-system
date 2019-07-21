import { ILocation } from './interfaces';

/**
 * Compare 2 locations
 * @param l1
 * @param l2
 */
export function compareLocation(l1: ILocation, l2: ILocation): boolean {
  return (l1.x === l2.x) && (l1.y === l2.y);
}
