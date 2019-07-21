import { Vehicle } from './index';
import { ILocation } from '../../commons/interfaces';

class FakeVehicle extends Vehicle {
  /**
   * Hacky: LOL, an easiest way to test protected fields
   */
  public vehicleId: number;
  public currentLocation: ILocation;
  public dropOffLocation: ILocation;
  public pickupLocation: ILocation;
  public _isInItinerary: boolean = false;
  public _isAlreadyPickupPassenger: boolean = false;

  get pickup(): ILocation {
    return this.pickupLocation;
  }

  get dropOff(): ILocation {
    return this.dropOffLocation;
  }
}
describe('/src/services/cars', () => {
  let instance: FakeVehicle;

  beforeAll(() => {
    instance = new FakeVehicle(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return vehicle id', () => {
    expect(instance.id).toStrictEqual(instance.vehicleId);
  });

  it('should return vehicle location', () => {
    expect(instance.location).toMatchObject(instance.currentLocation);
  });

  it('should return itinerary status', () => {
    expect(instance.isInItinerary).toEqual(instance._isInItinerary);
  });

  it('should return pickup passenger status', () => {
    expect(instance.isAlreadyPickupPassenger).toEqual(instance._isAlreadyPickupPassenger);
  });

  describe('startItinerary', () => {
    beforeEach(() => {
      instance._isInItinerary = false;
      instance._isAlreadyPickupPassenger = false;
    });

    it('should not start itinerary if already in itinerary', async () => {
      instance._isInItinerary = true;
      const ret = await instance.startItinerary({ x: 0, y: 0 }, { x: 1, y: 2 });
      expect(ret).toStrictEqual(false);
    });

    it('should not start itinerary source and destination are same', async () => {
      const ret = await instance.startItinerary({ x: 1, y: 1 }, { x: 1, y: 1 });
      expect(ret).toStrictEqual(false);
    });

    it('should start itinerary', async () => {
      const ret = await instance.startItinerary({ x: 1, y: 1 }, { x: 1, y: 2 });
      expect(ret).toStrictEqual(true);
      expect(instance.isInItinerary).toStrictEqual(true);
      expect(instance.isAlreadyPickupPassenger).toStrictEqual(false);
    });

    it('should auto pickup passenger if passenger is at vehicle current location', async () => {
      instance.currentLocation = { x: 1, y: 1 };
      const ret = await instance.startItinerary({ x: 1, y: 1 }, { x: 1, y: 2 });
      expect(ret).toStrictEqual(true);
      expect(instance.isInItinerary).toStrictEqual(true);
      expect(instance.isAlreadyPickupPassenger).toStrictEqual(true);
    });
  });

  describe('tick', () => {
    const defaultCurrentLocation = { x: 0, y: 0 };
    beforeEach(() => {
      instance._isInItinerary = true;
      instance._isAlreadyPickupPassenger = false;
      instance.currentLocation = { x: 0, y: 0 };
      instance.pickupLocation = { x: 1, y: 1 };
      instance.dropOffLocation = { x: 2, y: 2 };
    });

    it('should not do anything if not in itinerary', async () => {
      instance._isInItinerary = false;
      await instance.tick();
      expect(instance.location).toMatchObject(defaultCurrentLocation);
    });

    it('should move to passenger if vehicle has not pickup passenger yet', async () => {
      await instance.tick();
      expect(instance.location).toMatchObject({ x: 1, y: 0 });

      await instance.tick();
      expect(instance.location).toMatchObject({ x: 1, y: 1 });
      expect(instance.isAlreadyPickupPassenger).toEqual(true);
    });

    it('should send psssanger to the dropoff point', async () => {
      await instance.tick();
      await instance.tick();
      await instance.tick();
      expect(instance.location).toMatchObject({ x: 2, y: 1 });
      await instance.tick();
      expect(instance.location).toMatchObject({ x: 2, y: 2 });
      expect(instance.isAlreadyPickupPassenger).toEqual(false);
      expect(instance.isInItinerary).toEqual(false);
    });
  });
});
