import { ILocation } from './cars';

export abstract class IVehicleService {
  abstract loadVehicles(): Promise<void>;

  abstract attemptBooking(from: ILocation, to: ILocation): Promise<{ carId: number, totalTime: number }>;
}
