import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TradesService } from './trades.service';
import type { AuthRequest } from '../auth/auth-user.type';
import { CreateTradeDto, UpdateTradeDto } from './dto/trades.dto';
import { CustomerGuard } from '../auth/customer.guard';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @UseGuards(CustomerGuard)
  @Post()
  createTrade(@Req() req: AuthRequest, @Body() dto: CreateTradeDto) {
    return this.tradesService.createTrade(req.user.id, dto);
  }

  @UseGuards(CustomerGuard)
  @Get('me/:id')
  getMyTrades(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.tradesService.getMyTrades(req.user.id, id);
  }

  @UseGuards(CustomerGuard)
  @Delete(':id')
  deleteTrade(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.tradesService.deleteTrade(req.user.id, id);
  }

  @UseGuards(CustomerGuard)
  @Patch(':id')
  updateTrade(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTradeDto,
  ) {
    return this.tradesService.updateTrade(req.user.id, id, dto);
  }
}
