export interface ILocation {
  x: number;
  y: number;
}

export interface ICar {
  readonly location: ILocation;
  readonly id: number;
}

export interface IVehicle extends ICar {
  /**
  * Is the car in itinerary
  */
  readonly isInItinerary: boolean;
  /**
  * Let the vehicle start the itinerary
  * @param from Customer pickup location
  * @param to Customer dropoff location
  */
  startItinerary(from: ILocation, to: ILocation): Promise<boolean>;
  /**
   * Simulate time tick
   */
  tick(): Promise<void>;
}

export abstract class Car implements IVehicle {
  protected vehicleId: number;
  protected currentLocation: ILocation;

  constructor(id: number) {
    this.vehicleId = id;
    this.currentLocation = { x: 0, y: 0 };
  }

  get id() {
    return this.vehicleId;
  }

  get location() {
    return this.currentLocation;
  }

  get isInItinerary(): boolean {
    return false;
  }

  startItinerary(_from: ILocation, _to: ILocation): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  tick(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
