import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ConflictException, InternalServerErrorException, UseGuards, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomerQueryParamsDto } from './dto/customer-query-params.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async createCustomer(@Body(ValidationPipe) createCustomerDto: CreateCustomerDto) {
    try {
      return await this.customersService.createCustomer(createCustomerDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get()
  async getAllCustomers() {
    try {
      return await this.customersService.getAllCustomers();
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get('search')
  async getCustomerByParameters(@Query() queryParams: CustomerQueryParamsDto) {
    try {
      return await this.customersService.getCustomerByParameters(queryParams);
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: string) {
    try {
      return await this.customersService.getCustomerById(id);
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Patch(':id')
  async updateCustomer(@Param('id') id: string, @Body(ValidationPipe) updateCustomerDto: UpdateCustomerDto) {
    try {
      return await this.customersService.updateCustomer(id, updateCustomerDto);
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    try {
      await this.customersService.deleteCustomer(id);
      return { message: 'Customer deleted successfully' };
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
