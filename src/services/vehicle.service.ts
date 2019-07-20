import { Injectable, Inject } from '@nestjs/common';
import { ClassProvider, OnModuleInit } from '@nestjs/common/interfaces';
import { IOC_KEY, ILoggerInstance, PROVIDERS } from '../commons';
import { IVehicleService } from './vehicle.service.interface';

@Injectable()
export class VehicleService implements IVehicleService, OnModuleInit {
  static get [IOC_KEY](): ClassProvider {
    return {
      provide: IVehicleService,
      useClass: VehicleService
    };
  }

  constructor(
    @Inject(PROVIDERS.ROOT_LOGGER)
    private readonly logger: ILoggerInstance
  ) { }

  async onModuleInit() {
    await this.loadVehicles();
  }

  async loadVehicles() {
    this.logger.debug('Loading vehicles');
  }
}
