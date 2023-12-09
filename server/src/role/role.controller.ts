import { Controller, Post, Body, Res, Get, Put, Delete, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleCreateDto, RoleUpdateDto } from './dto';
import { Response, Request } from 'express';
import { PaginationDto } from 'src/common/dto';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';

@Controller('role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService
    ) { }

    @Post('/create')
    @Permission(Permissions.CreateRole)
    async create(@Body() dto: RoleCreateDto, @Res() res: Response) {
        const response = await this.roleService.create(dto);
        return res.json({ response });
    }

    @Delete('/delete/:id')
    @Permission(Permissions.DeleteRole)
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.roleService.delete(id);
        return res.json({ response });
    }

    @Get(':id')
    @Permission(Permissions.ReadRole)
    async getRole(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.roleService.role(id);
        return res.json({ response });
    }

    @Get()
    @Permission(Permissions.ReadRole)
    async getRoles(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.roleService.roles(pagination);
        return res.json({ response });
    }

    @Put('/update/:id')
    @Permission(Permissions.UpdateRole)
    async update(@Body() dto: RoleUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.roleService.update(id, dto);
        return res.json({ response });
    }

}
