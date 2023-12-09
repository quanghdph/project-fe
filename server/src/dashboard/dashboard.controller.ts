import { Body, Controller, Get, Query, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Response, Request } from 'express';
import { DashboardDto } from './dto';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService
    ) { }

    @Get()
    async dashboard(@Query() dashboardDto: DashboardDto, @Res() res: Response) {
        const response = await this.dashboardService.dashboard(dashboardDto);
        return res.json({ response });
    }
}
