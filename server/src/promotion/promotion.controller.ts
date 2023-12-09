import { Controller, Post, Body, Res, Get, Put, Delete, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { Response } from 'express';
import { PromotionService } from './promotion.service';
import { CheckPromotionCodeDto, PromotionCreateDto, PromotionUpdateDto } from './dto';

@Controller('promotion')
export class PromotionController {
    constructor(
        private readonly promotionService: PromotionService
    ) { }

    @Post('/create')
    @Permission(Permissions.CreatePromotion)
    async create(@Body() dto: PromotionCreateDto, @Res() res: Response) {
        const response = await this.promotionService.create(dto);
        return res.json({ response });
    }

    @Post('/check-code')
    async checkPromotionCode(@Body() dto: CheckPromotionCodeDto, @Res() res: Response) {
        const response = await this.promotionService.checkPromotionCode(dto);
        return res.json({ response });
    }

    @Get()
    @Permission(Permissions.ReadPromotion)
    async getPromotions(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.promotionService.promotions(pagination);
        return res.json({ response });
    }

    @Delete('/delete/:id')
    @Permission(Permissions.DeletePromotion)
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.promotionService.delete(id);
        return res.json({ response });
    }

    @Get(':id')
    @Permission(Permissions.ReadPromotion)
    async getPromotion(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.promotionService.promotion(id);
        return res.json({ response });
    }

    @Put('/update/:id')
    @Permission(Permissions.UpdatePromotion)
    async update(@Body() dto: PromotionUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.promotionService.update(id, dto);
        return res.json({ response });
    }

}
