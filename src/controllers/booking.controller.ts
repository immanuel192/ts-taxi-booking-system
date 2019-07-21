import { Controller, Post, Body, Put } from '@nestjs/common';
import { ApiUseTags, ApiCreatedResponse, ApiBadRequestResponse, ApiOperation, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { IVehicleService } from '../services/vehicle.service.interface';
import { CreateBookingRequestDto, CreateBookingResponseDto, SuccessResponseDto } from '../dto';

@ApiUseTags('booking')
@Controller('/api')
export default class BookingController {
  constructor(
    private readonly vehicleService: IVehicleService
  ) { }

  @Post('book')
  @ApiOperation({ title: 'Create new booking' })
  @ApiCreatedResponse({
    description: 'Successfully booking request',
    type: CreateBookingResponseDto
  })
  @ApiBadRequestResponse({})
  @ApiInternalServerErrorResponse({})
  async create(
    @Body()
    inp: CreateBookingRequestDto
  ) {
    const result = await this.vehicleService.attemptBooking(inp.source, inp.destination);
    return !result ? {} : new CreateBookingResponseDto(result.carId, result.totalTime);
  }

  @Post('tick')
  @ApiOperation({ title: 'Simulate time clock, to stamp time by 1 unit' })
  @ApiCreatedResponse({
    type: SuccessResponseDto
  })
  @ApiInternalServerErrorResponse({})
  async tick(
  ) {
    await this.vehicleService.tick();
    return {
      success: true
    };
  }

  @Put('reset')
  @ApiOperation({ title: 'Reset all car state to initial state' })
  @ApiOkResponse({
    type: SuccessResponseDto
  })
  @ApiInternalServerErrorResponse({})
  async reset(
  ) {
    await this.vehicleService.loadVehicles();
    return {
      success: true
    };
  }
}
