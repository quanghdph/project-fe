import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, Query, Req } from '@nestjs/common';
import { RateService } from './rate.service';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { Response, Request } from 'express';
import { RateCreateDto, RateUpdateDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Controller('rate')
export class RateController {
    constructor(
        private readonly rateService: RateService
    ) { }

    @Post("create")
    @Permission(Permissions.CreateRate)
    async createRate(@Req() req: Request, @Body() dto: RateCreateDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.rateService.create(dto, userId)
        res.json({ response })
    }

    @Get(":id")
    @Permission(Permissions.ReadRate)
    async getRate(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.rateService.rate(id)
        res.json({ response })
    }

    @Get("list/:id")
    async getRates(@Query() pagination: PaginationDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.rateService.rates(pagination, id);
        return res.json({ response });
    }


    @Delete("delete/:id")
    @Permission(Permissions.DeleteRate)
    async deleteRate(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.rateService.delete(id)
        res.json({ response })
    }

    @Put("update/:id")
    @Permission(Permissions.UpdateRate)
    async editRate(@Req() req: Request, @Body() dto: RateUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.rateService.update(dto, id)
        res.json({ response })
    }
}
