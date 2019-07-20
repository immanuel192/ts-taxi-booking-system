import { loggerMock } from '../commons/test-helper';
import { IOC_KEY } from '../commons';
import { VehicleService } from './vehicle.service';
import { IVehicleService } from './vehicle.service.interface';
import { IVehicle, Vehicle, ILocation } from './cars';

class FakeVehicle extends Vehicle {
  constructor(id: number, opts?: { location?: ILocation, status?: boolean }) {
    super(id);
    if (opts) {
      if (opts.location) {
        this.currentLocation = opts.location;
      }
      if (opts.status) {
        this.setIsItinerary(opts.status);
      }
    }
  }

  setIsItinerary(status: boolean) {
    this._isInItinerary = status;
  }
}

class FakeVehicleService extends VehicleService {
  clearVehicles() {
    this.vehicles = [];
  }

  addVehicle(vehicle: IVehicle) {
    this.vehicles.push(vehicle);
  }
}

describe('/src/services/vehicle.service.ts', () => {
  let instance: FakeVehicleService;
  const logger = loggerMock();

  beforeAll(async () => {
    instance = new FakeVehicleService(logger);
    await instance.onModuleInit();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('IoC', () => {
    it('should have class information as expected', () => {
      expect(VehicleService[IOC_KEY]).not.toBeUndefined();
      expect(VehicleService[IOC_KEY]).toMatchObject({
        provide: IVehicleService,
        useClass: VehicleService
      });

      expect(instance).not.toBeUndefined();
    });
  });

  describe('OnModuleInit', () => {
    it('should load vehicles when app bootstrap', async () => {
      const spyLoadVehicle = jest.spyOn(instance, 'loadVehicles');
      await instance.onModuleInit();
      expect(spyLoadVehicle).toHaveBeenCalled();
      spyLoadVehicle.mockRestore();
    });
  });

  describe('attemptBooking', () => {
    const from: ILocation = { x: 1, y: 0 };
    const to: ILocation = { x: 1, y: 1 };

    it('should only filter vehicle are not in itinerary', async () => {
      instance.clearVehicles();
      const vehicleInItinerary = new FakeVehicle(1, { status: true });
      instance.addVehicle(vehicleInItinerary);

      const result = await instance.attemptBooking(from, to);
      expect(result).toStrictEqual(undefined);
    });

    describe('distance calculation', () => {
      /**
           *            |
           *   Area3    |  Area 1
           *  ---------------------
           *   Area 4   |  Area 2
           *            |
           */

      it('should calculate correct distance if passenger and car are all in area 1', async () => {
        instance.clearVehicles();
        instance.addVehicle(new FakeVehicle(1, {
          location: { x: 2, y: 2 }
        }));

        const result = await instance.attemptBooking(from, to);
        expect(result).toMatchObject({
          carId: 1,
          totalTime: 4
        });
      });

      it('should calculate correct distance if car in area 2', async () => {
        instance.clearVehicles();
        instance.addVehicle(new FakeVehicle(1, {
          location: { x: 3, y: -3 }
        }));

        const result = await instance.attemptBooking(from, to);
        expect(result).toMatchObject({
          carId: 1,
          totalTime: 6
        });
      });

      it('should calculate correct distance if car in area 3', async () => {
        instance.clearVehicles();
        instance.addVehicle(new FakeVehicle(1, {
          location: { x: -2, y: 2 }
        }));

        const result = await instance.attemptBooking(from, to);
        expect(result).toMatchObject({
          carId: 1,
          totalTime: 6
        });
      });

      it('should calculate correct distance if car in area 4', async () => {
        instance.clearVehicles();
        instance.addVehicle(new FakeVehicle(1, {
          location: { x: -1, y: -5 }
        }));

        const result = await instance.attemptBooking(from, to);
        expect(result).toMatchObject({
          carId: 1,
          totalTime: 8
        });
      });
    });

    it('should find nearest vihecle', async () => {
      instance.clearVehicles();
      instance.addVehicle(new FakeVehicle(1));
      instance.addVehicle(new FakeVehicle(2, {
        location: { x: 3, y: 3 }
      }));
      instance.addVehicle(new FakeVehicle(3, {
        location: { x: -2, y: -1 }
      }));

      const result = await instance.attemptBooking(from, to);
      expect(result).toMatchObject({
        carId: 1,
        totalTime: 2
      });
    });

    it('should find nearest vihecle, if same totalTime then return smallest id', async () => {
      instance.clearVehicles();
      instance.addVehicle(new FakeVehicle(1, {
        location: { x: 5, y: 6 }
      }));
      instance.addVehicle(new FakeVehicle(2, {
        location: { x: 2, y: 1 }
      }));
      instance.addVehicle(new FakeVehicle(3, {
        location: { x: 2, y: 1 }
      }));

      const result = await instance.attemptBooking(from, to);
      expect(result).toMatchObject({
        carId: 2,
        totalTime: 3
      });
    });
  });
});
