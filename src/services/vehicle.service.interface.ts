import { ILocation } from '../commons';

export abstract class IVehicleService {
  /**
   * Remove all existing vehicles
   */
  abstract clearVehicles(): void;

  abstract loadVehicles(): Promise<void>;

  abstract attemptBooking(from: ILocation, to: ILocation): Promise<{ carId: number, totalTime: number }>;

  abstract tick(): Promise<void>;
}
