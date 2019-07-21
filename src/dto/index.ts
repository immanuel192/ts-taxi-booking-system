import { IsInt, IsNotEmpty, ValidateNested, IsBoolean, } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

class LocationDto {
  @ApiModelProperty({
    description: 'Location coordinate',
    required: true,
    example: 0,
    type: Number
  })
  @IsInt()
  x: number;

  @ApiModelProperty({
    description: 'Location coordinate',
    required: true,
    example: 0,
    type: Number
  })
  @IsInt()
  y: number;
}

export class CreateBookingRequestDto {
  @ApiModelProperty({
    description: 'Source location',
    required: true,
    type: LocationDto
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  source: LocationDto;

  @ApiModelProperty({
    description: 'Destination location',
    required: true,
    type: LocationDto
  })
  @IsNotEmpty()
  @Type(() => LocationDto)
  @ValidateNested()
  destination: LocationDto;
}

export class CreateBookingResponseDto {
  @ApiModelProperty({
    description: 'Car ID',
    required: false,
    example: 0,
    type: Number
  })
  @IsInt()
  // tslint:disable-next-line:variable-name
  car_id: number;

  @ApiModelProperty({
    description: 'Total time for this car to travel to passenger location and from there go to the destination',
    required: false,
    example: 0,
    type: Number
  })
  @IsInt()
  // tslint:disable-next-line:variable-name
  total_time: number;

  constructor(carId: number, totalTime: number) {
    this.car_id = carId;
    this.total_time = totalTime;
  }
}

export class SuccessResponseDto {
  @ApiModelProperty({
    description: 'Request status',
    required: true,
    example: true,
    type: Boolean
  })
  @IsBoolean()
  success: boolean;
}
