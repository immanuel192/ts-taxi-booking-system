import { Controller, Post, Body } from '@nestjs/common';
import { ApiUseTags, ApiCreatedResponse, ApiBadRequestResponse, ApiOperation, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { IVehicleService } from '../services/vehicle.service.interface';
import { CreateBookingRequestDto, CreateBookingResponseDto } from '../dto';

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
}
