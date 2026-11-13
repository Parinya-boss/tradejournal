import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import type { AuthRequest } from '../auth/auth-user.type';
import { CreateTransactionDto, PaginationDto } from './dto/transactions.dto';
import { CustomerGuard } from '../auth/customer.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(CustomerGuard)
  @Post('createtransactions')
  createTransaction(
    @Req() req: AuthRequest,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.createTransaction(req.user.id, dto);
  }

  @UseGuards(CustomerGuard)
  @Get('me')
  getMyTransaction(@Req() req: AuthRequest) {
    return this.transactionsService.getMyTransaction(req.user.id);
  }

  @UseGuards(AdminGuard)
  @Get('pending')
  getPendingTransaction(@Query() pagination: PaginationDto) {
    return this.transactionsService.getPendingTransaction(pagination);
  }

  @UseGuards(AdminGuard)
  @Patch('reject/:id')
  rejectTransaction(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionsService.rejectTransaction(id, req.user.id);
  }

  @UseGuards(AdminGuard)
  @Patch('approve/:id')
  approveTransaction(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionsService.approveTransaction(id, req.user.id);
  }
}
