import { Body, Controller, Get, Param, ParseIntPipe, Query, Res, Put, Req, Delete, Post } from '@nestjs/common';
import { Response, Request } from 'express';
import { AddressService } from './address.service';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { AddressCreateDto, AddressUpdateDto, SetDefaultShippingAddressDto } from './dto';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post('/create')
    @Permission(Permissions.UpdateCustomer)
    async create(@Body() dto: AddressCreateDto, @Res() res: Response) {
        const response = await this.addressService.create(dto);
        return res.json({ response });
    }

    @Delete('/delete/:id')
    @Permission(Permissions.UpdateCustomer)
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.addressService.delete(id);
        return res.json({ response });
    }

    @Get(':id')
    @Permission(Permissions.ReadCustomer)
    async getAddress(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.addressService.address(id);
        return res.json({ response });
    }

    @Get('list/:customerId')
    @Permission(Permissions.ReadCustomer)
    async getAddresses(@Param('customerId', ParseIntPipe) customerId: number, @Res() res: Response) {
        const response = await this.addressService.addresses(customerId);
        return res.json({ response });
    }

    @Put('/update/:id')
    @Permission(Permissions.UpdateCustomer)
    async update(@Body() dto: AddressUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.addressService.update(id, dto);
        return res.json({ response });
    }

    @Put('/default-shipping-address/:id')
    @Permission(Permissions.UpdateCustomer)
    async setDefaultShippingAddress(@Body() dto: SetDefaultShippingAddressDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.addressService.setDefaultShippingAddress(dto, id);
        return res.json({ response });
    }
}
