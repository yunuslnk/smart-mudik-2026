import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DonationService } from './donation.service';

@Controller('donation')
@UseGuards(AuthGuard('jwt'))
export class DonationController {
    constructor(private donationService: DonationService) { }

    @Post()
    create(@Req() req, @Body('amount') amount: number) {
        return this.donationService.create(req.user.userId, amount);
    }

    @Get('my')
    getMyDonations(@Req() req) {
        return this.donationService.getMyDonations(req.user.userId);
    }

    @Get('stats')
    getStats() {
        return this.donationService.getStats();
    }
}
