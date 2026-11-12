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
import { TradingaccountsService } from './tradingaccounts.service';
import { AdminGuard } from '../auth/admin.guard';
import type { AuthRequest } from '../auth/auth-user.type';
import { CreateAccountDto, UpdateAccountDto } from './dto/tradingAccount.dto';
import { CustomerGuard } from '../auth/customer.guard';

@Controller('tradingaccounts')
export class TradingaccountsController {
  constructor(
    private readonly tradingaccountsService: TradingaccountsService,
  ) {}

  @UseGuards(AdminGuard)
  @Get()
  getAllAccount() {
    return this.tradingaccountsService.getAllAccount();
  }

  @Get('me')
  getMeAccount(@Req() req: AuthRequest) {
    return this.tradingaccountsService.getMeAccount(req.user.id);
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  getOneAccount(@Param('id', ParseIntPipe) id: number) {
    return this.tradingaccountsService.getOneAccount(id);
  }

  @UseGuards(CustomerGuard)
  @Post('create')
  createTradingAccount(@Req() req: AuthRequest, @Body() dto: CreateAccountDto) {
    return this.tradingaccountsService.createTradingAccount(req.user.id, dto);
  }

  @Patch('update/:id')
  updateName(
    @Req() req: AuthRequest,
    @Body() dto: UpdateAccountDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tradingaccountsService.updateName(req.user, id, dto);
  }

  @Delete('delete/:id')
  deleteTradingAccount(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tradingaccountsService.deleteTradingAccount(req.user.id, id);
  }
}
