import { EVehicleType, IVehicle } from '.';
import { Taxi } from './taxi';

export function vehicleStrategy(type: EVehicleType, id: number): IVehicle {
  if (type === EVehicleType.Taxi) {
    return new Taxi(id);
  }
  throw new Error(`type ${type} is not supported`);
}
