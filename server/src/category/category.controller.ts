import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { Response } from 'express';
import { CategoryCreateDto, CategoryUpdateDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post("create")
    @Permission(Permissions.CreateCategory)
    async createCategory(@Body() dto: CategoryCreateDto, @Res() res: Response) {
        const response = await this.categoryService.create(dto)
        res.json({ response })
    }

    @Get(":id")
    @Permission(Permissions.ReadCategory)
    async getCategory(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.categoryService.category(id)
        res.json({ response })
    }

    @Delete("delete/:id")
    @Permission(Permissions.DeleteCategory)
    async deleteCategory(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.categoryService.delete(id)
        res.json({ response })
    }

    @Put("update/:id")
    @Permission(Permissions.UpdateCategory)
    async editCategory(@Body() dto: CategoryUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.categoryService.update(dto, id)
        res.json({ response })
    }

    @Get()
    @Permission(Permissions.ReadCategory, Permissions.Anonymous)
    async getCategories(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.categoryService.categories(pagination);
        return res.json({ response });
    }
}
