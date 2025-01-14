import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CustomerQueryParamsDto } from './dto/customer-query-params.dto';
import { CustomerExistForBooking } from 'src/existbyid.interface';


@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private readonly customerModel: Model<Customer>) { }
  
  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const { password, ...customerData } = createCustomerDto;

      await this.checkIfCustomerExists(customerData.phone);

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdCustomer = new this.customerModel({
        ...customerData,
        password: hashedPassword,
      });

      return await createdCustomer.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Customer or Phone already exists');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async checkIfCustomerExists(phone: string): Promise<void> {
    try {
      const existingPhone = await this.customerModel.findOne({ phone, deleted: false });
      if (existingPhone) {
        throw new ConflictException('Phone already exists');
      }
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
 
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const allCustomers = await this.customerModel.find().sort({ updatedAt: 'desc' }).exec();
      const activeCustomers = allCustomers.filter(customer => !customer.deleted);
      return activeCustomers;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getCustomerByParameters(queryParams: CustomerQueryParamsDto): Promise<Customer[] | null> {
    try {
      const filteredQueryParams: Record<string, any> = {};

      for (const key in queryParams) {
        if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
          const value = queryParams[key];
          filteredQueryParams[key] = typeof value === 'string' ? value.toLowerCase() : value;
        }
      }
      const result = await this.customerModel.find(filteredQueryParams).sort({ updatedAt: 'desc' }).collation({ locale: 'en', strength: 2 }).exec();
      const activeCustomer = result.filter(customer => !customer.deleted);

      return activeCustomer;
    } catch (error) {
      console.error('Error in getCustomerByParameters:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid Customer ID');
      }

      const existingCustomer = await this.customerModel.findById(id).exec();

      if (!existingCustomer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      const activeCustomer = !existingCustomer.deleted? existingCustomer : null;

      return activeCustomer;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer | null> {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid Role ID');
      }

      const findCustomer = await this.customerModel.findById(id).exec();
      const existingCustomer = !findCustomer.deleted? findCustomer : null;

      if (!existingCustomer) {
        throw new NotFoundException('Customer not found');
      }

      if (updateCustomerDto.password) {
        const hashedPassword = await bcrypt.hash(updateCustomerDto.password, 10);
        updateCustomerDto.password = hashedPassword;
      }

      return this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteCustomer(id: string): Promise<Customer | null> {
    try {
      const deletedCustomer = await this.customerModel.findByIdAndDelete(id).exec();

      if (!deletedCustomer) {
        throw new NotFoundException('Customer not found');
      }

      return deletedCustomer as unknown as Customer;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  private validateId(id: string): void {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }

  async existsById(id: string): Promise<CustomerExistForBooking> {
    try {
      this.validateId(id);

      const customer = await this.customerModel.findById(id).exec();

      if (customer && !customer.deleted) {
        const customerExist: CustomerExistForBooking = {
          exist: true,
          name: customer.fullName,
          phone: customer.phone
        }
        return customerExist;
      }

      const customerExist: CustomerExistForBooking = {
        exist: false,
        name: null,
        phone: null
      }
      return customerExist;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

}
