import { vehicleStrategy } from './vehicleStrategy';
import { EVehicleType } from '.';
import { Taxi } from './taxi';

describe('/src/services/cars/vehicleStrategy.ts', () => {
  it('should create new instance for type Taxi', () => {
    const res = vehicleStrategy(EVehicleType.Taxi, 1);
    expect(res).toBeInstanceOf(Taxi);
    expect(res.id).toStrictEqual(1);
  });

  it('should throw exception if type not support', () => {
    expect(() => vehicleStrategy('test type' as any, 1)).toThrowError('type test type is not supported');
  });
});
