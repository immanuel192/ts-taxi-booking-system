import { Injectable, Inject } from '@nestjs/common';
import { ClassProvider, OnModuleInit } from '@nestjs/common/interfaces';
import { chain } from 'lodash';
import { IOC_KEY, ILoggerInstance, PROVIDERS } from '../commons';
import { IVehicleService } from './vehicle.service.interface';
import { vehicleStrategy } from './cars/vehicleStrategy';
import { EVehicleType, IVehicle, ILocation } from './cars/index';

@Injectable()
export class VehicleService implements IVehicleService, OnModuleInit {
  static get [IOC_KEY](): ClassProvider {
    return {
      provide: IVehicleService,
      useClass: VehicleService
    };
  }

  protected vehicles: IVehicle[] = [];

  constructor(
    @Inject(PROVIDERS.ROOT_LOGGER)
    private readonly logger: ILoggerInstance
  ) { }

  async onModuleInit() {
    await this.loadVehicles();
  }

  async loadVehicles() {
    this.logger.debug('Loading vehicles');
    this.vehicles = [];
    this.vehicles.push(vehicleStrategy(EVehicleType.Taxi, 1));
    this.vehicles.push(vehicleStrategy(EVehicleType.Taxi, 2));
    this.vehicles.push(vehicleStrategy(EVehicleType.Taxi, 3));
  }

  /**
   * Calculate distance from (x1,y1) -> (x2, y2)
   */
  private getDistance(from: ILocation, to: ILocation): number {
    return ((from.x * to.x) > 0 ? Math.abs(from.x - to.x) : (Math.abs(from.x) + Math.abs(to.x))) + ((from.y * to.y) > 0 ? Math.abs(from.y - to.y) : (Math.abs(from.y) + Math.abs(to.y)));
  }

  async attemptBooking(from: ILocation, to: ILocation): Promise<{ carId: number, totalTime: number }> {
    const travelDistance = this.getDistance(from, to);
    const carInfo = chain(this.vehicles)
      .filter(t => !t.isInItinerary)
      .map(c => ({
        carId: c.id,
        totalTime: this.getDistance(c.location, from) + travelDistance
      }))
      .sortBy(['totalTime', 'carId'], ['asc', 'asc'])
      .first()
      .value();
    return Promise.resolve(carInfo);
  }
}
