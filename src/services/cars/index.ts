import { ILocation } from '../../commons';
import { compareLocation } from '../../commons/location-helper';

export enum EVehicleType {
  Taxi = 'taxi'
}

export interface ICar {
  readonly id: number;
}

export interface IVehicle extends ICar {
  readonly location: ILocation;
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
  startItinerary(from: ILocation, to: ILocation): Promise<boolean>;

  tick(): Promise<void>;
}

export abstract class Vehicle implements IVehicle {
  protected vehicleId: number;
  protected currentLocation: ILocation;
  protected dropOffLocation: ILocation;
  protected pickupLocation: ILocation;
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

  startItinerary(from: ILocation, to: ILocation): Promise<boolean> {
    if (this._isInItinerary) {
      return Promise.resolve(false);
    }
    if (compareLocation(from, to)) { // same location, are you kidding me?
      return Promise.resolve(false);
    }
    this.pickupLocation = from;
    this.dropOffLocation = to;
    this._isInItinerary = true;
    this._isAlreadyPickupPassenger = compareLocation(this.currentLocation, this.pickupLocation);
    return Promise.resolve(true);
  }

  async tick() {
    if (!this._isInItinerary) {
      return;
    }
    const target = this._isAlreadyPickupPassenger ? this.dropOffLocation : this.pickupLocation;

    // move
    if (this.currentLocation.x === target.x) {
      // move y
      this.currentLocation.y += (this.currentLocation.y < target.y) ? 1 : -1;
    }
    else {
      // move x
      this.currentLocation.x += (this.currentLocation.x < target.x) ? 1 : -1;
    }

    if (this._isInItinerary) {
      if (this.isAlreadyPickupPassenger && compareLocation(this.currentLocation, this.dropOffLocation)) {
        this._isAlreadyPickupPassenger = false;
        this._isInItinerary = false;
      }
      else if (!this._isAlreadyPickupPassenger && compareLocation(this.pickupLocation, this.currentLocation)) {
        this._isAlreadyPickupPassenger = true;
      }
    }
  }
}
