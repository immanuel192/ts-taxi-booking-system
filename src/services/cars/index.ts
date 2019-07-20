export enum EVehicleType {
  Taxi = 'taxi'
}
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
  readonly isAlreadyPickupPassenger: boolean;
  /**
  * Let the vehicle start the itinerary
  * @param from Customer pickup location
  * @param to Customer dropoff location
  */
  startItinerary(from: ILocation, to: ILocation, passenger: ILocation): Promise<boolean>;
  /**
   * Simulate time tick
   */
  tick(): Promise<void>;
}

export abstract class Vehicle implements IVehicle {
  protected vehicleId: number;
  protected currentLocation: ILocation;
  protected _isInItinerary: boolean = false;
  protected _isAlreadyPickupPassenger: boolean = false;

  constructor(id: number) {
    this.vehicleId = id;
    this.currentLocation = { x: 0, y: 0 };
    this._isInItinerary = false;
  }

  get id() {
    return this.vehicleId;
  }

  get location() {
    return this.currentLocation;
  }

  get isInItinerary(): boolean {
    return this._isInItinerary;
  }

  get isAlreadyPickupPassenger(): boolean {
    return this._isAlreadyPickupPassenger;
  }

  startItinerary(_from: ILocation, _to: ILocation, _passenger: ILocation): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  tick(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
