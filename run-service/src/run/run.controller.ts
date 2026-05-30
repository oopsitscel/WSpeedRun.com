import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { RunService } from './run.service';
import { CreateRunDto } from './dto/create-run.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Run Catalog & Run Management')
@ApiBearerAuth()
@Controller('')
export class RunController {
  constructor(
    private readonly runService: RunService,
    private readonly jwtService: JwtService,
  ) {}

  // Run Catalog
  @Get('runs/:id/category')
  @ApiOperation({ summary: 'List of all runs by run category' })
  findByCategory(@Param('id') categoryID: string) {
    return this.runService.findByCategory(categoryID);
  }

  @Get('runs/:id/user')
  @ApiOperation({ summary: 'List of all runs submitted by user' })
  findByUser(
    @Param('id') targetUserID: string,
    @Req() req: any,
  ) {
    // Authentication Manual Check - Allows both User and Guest
    let authenticatedUserID: string | null = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const rawToken = authHeader.replace('Bearer ', '').trim();
      
      try{
        const decoded = this.jwtService.decode(rawToken) as any;
        if (decoded && decoded.id) {
          authenticatedUserID = decoded.id;
        }
      } catch (err){
        authenticatedUserID = null;
      }
    }
    return this.runService.findByUser(targetUserID, authenticatedUserID);
  }

  @Get('runs/:id')
  @ApiOperation({ summary: "Get a specific run's full details" })
  findRunDetails(@Param('id') id: string) {
    return this.runService.findRunDetails(id);
  }

  @Post('runs')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new run entry' })
  createRun(
    @Body() createRunDto: CreateRunDto,
    @Req() req: any,
  ) {
    // User ID will be provided by UserGuard
    const authenticatedUserID = req.user.id;
    return this.runService.createRun(createRunDto, authenticatedUserID);
  }

  // Run Management
  @Get('admin/runs/:status')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Get all run entries filtered by status (Admin Only) (PENDING / ACCEPTED / REJECTED)' })
  getAdminRuns(@Param('status') status: string) {
    return this.runService.getAdminRuns(status);
  }

  @Post('admin/runs/:id/accept')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Accept a run entry (Admin Only)' })
  acceptRun(@Param('id') id: string) {
    return this.runService.updateRunStatus(id, 'ACCEPTED');
  }

  @Post('admin/runs/:id/reject')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Reject a run entry (Admin Only)' })
  rejectRun(@Param('id') id: string) {
    return this.runService.updateRunStatus(id, 'REJECTED');
  }
}

