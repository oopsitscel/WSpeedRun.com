import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRunDto } from './dto/create-run.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RunService {
  constructor(private prisma: PrismaService) {}
  
  // Method to convert seconds into custom display format
  private formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} Hour(s) ${minutes} Minute(s) ${seconds} Second(s)`;
  }

  // RUN CATALOG
  // 1. GET /runs/:id/category (List of all runs by run category)
  async findByCategory(categoryID: string) {
    // Input Validation
    if (!categoryID || categoryID.trim() === '') {
      throw new BadRequestException('Run category ID must be filled.');
    }

    // Run Category Existence Validation (Using Game-Service)
    try {
      const categoryRes = await fetch(`${process.env.GAME_SERVICE_URL}/categories/${categoryID}`);
      if (!categoryRes.ok) throw new Error();
    } catch {
      throw new NotFoundException(`Run category with ID ${categoryID} not found`);
    }
    
    // Grabs only ACCEPTED runs, sorted by run duration (Ascending)
    const runs = await this.prisma.run.findMany({
      where: {
        run_category_id: categoryID,
        status: 'ACCEPTED',
      }, 
      orderBy: { run_duration: 'asc'},
    });

    return Promise.all(
      runs.map(async (run) => {
        let runnerInfo = { username: 'Unknown User', country: 'Unknown' };
        let gameInfo = { game_name: 'Unknown Game' };
        
        // Get Data from Auth-Service (Port 3000) and Game-Service (Port 3001)
        try {
          const userRes = await fetch(`${process.env.AUTH_SERVICE_URL}/users/${run.user_id}/profile`);
          if (userRes.ok) runnerInfo = await userRes.json();

          const catRes = await fetch(`${process.env.GAME_SERVICE_URL}/categories/${run.run_category_id}`);
          if (catRes.ok) {
            const catData = await catRes.json();
            gameInfo = catData.game || { game_name: 'Unknown Game' };
          }
        } catch (error){
          console.log(error);
        } 
  
        return{
          run_id: run.run_id,
          run_category_id: run.run_category_id,
          vod_url: run.vod_url,
          run_duration: this.formatDuration(Number(run.run_duration)),
          status: run.status,
          runner: runnerInfo,
          game: gameInfo
        }
      })
    );
  }

  // 2. GET /runs/:id/user (List of all runs by user)
  async findByUser(targetUserID: string, authenticatedUserID: string | null) {
    // Input Validation
    if (!targetUserID || targetUserID.trim() === '') {
      throw new BadRequestException('User ID must be filled.');
    }
    
    let runs;

    // Run User Existence Validation (Using Auth-Service)
    try {
      const userRes = await fetch(`${process.env.AUTH_SERVICE_URL}/users/${targetUserID}/profile`);
      if (!userRes.ok) throw new Error();
    } catch {
      throw new NotFoundException(`User with ID ${targetUserID} not found.`);
    }

    // If requested user matches the authenticated user, return ALL states.
    // Otherwise, return only ACCEPTED items.
    if (authenticatedUserID && authenticatedUserID === targetUserID) {
      runs = await this.prisma.run.findMany({
        where: { user_id: targetUserID },
        orderBy: { run_id: 'desc' },
      });
    } else {
      runs = await this.prisma.run.findMany({
      where: {
        user_id: targetUserID,
        status: 'ACCEPTED',
      }, 
      orderBy: { run_duration: 'asc'},
      });
    }

    return runs.map((run) => ({
      run_id: run.run_id,
      run_category_id: run.run_category_id,
      user_id: run.user_id,
      vod_url: run.vod_url,
      submitted_at: run.submitted_at,
      verified_at: run.verified_at,
      status: run.status,
      run_duration: this.formatDuration(Number(run.run_duration)),
    }));
  }

  // 3. GET /runs/:id (Get full run details)
  async findRunDetails(id: string) {
    // Input Validation
    if (!id || id.trim() === '') {
      throw new BadRequestException('Run ID must be filled.');
    }

    // Runs Existence Validation
    const run = await this.prisma.run.findUnique({
      where: { run_id: id },
      include: { comments: true },
    });
    if (!run) throw new NotFoundException(`Speedrun with ID ${id} not found.`);

    let runCategoryName = 'Unknown Category';
    let gameInformation = {};
    let runnerInformation = {};

    // Get Data from Auth-Service (Port 3000) and Game-Service (Port 3001)
    try {
      const userRes = await fetch(`${process.env.AUTH_SERVICE_URL}/users/${run.user_id}/profile`);
      if (userRes.ok) runnerInformation = await userRes.json();

      const catRes = await fetch(`${process.env.GAME_SERVICE_URL}/categories/${run.run_category_id}`);
      if (catRes.ok) {
        const catData = await catRes.json();
        runCategoryName = catData.run_category_name;
        gameInformation = catData.game || {};
      }
    } catch (error) {
      console.log(error);
    } 

    return {
      run_id: run.run_id,
      vod_url: run.vod_url,
      run_duration: this.formatDuration(Number(run.run_duration)),
      status: run.status,
      submitted_at: run.submitted_at,
      verified_at: run.verified_at,
      run_category_name: runCategoryName,
      game_information: gameInformation,
      comments: run.comments,
      runner_information: runnerInformation,
    };
  }

  // 4. POST /runs (Create a new run entry)
  async createRun(dto: CreateRunDto, authenticatedUserID: string) {
    const { run_category_id, vod_url, run_duration } = dto;

    // Input Validation : Run category ID must exist, vod_url must be filled and run_duration must be a number
    if (!run_category_id || run_category_id.trim() === '') {
      throw new BadRequestException('Run Category ID must be filled.');
    }
    if (!vod_url || vod_url.trim() === '') {
      throw new BadRequestException('Video-on-Demand (VOD) URL must be filled');
    }
    if (run_duration === undefined || run_duration === null || isNaN(Number(run_duration)) || Number(run_duration) <= 0) {
      throw new BadRequestException('Run duration must be a positive number (in seconds)');
    }
    
    // Run Category Existence Validation (Using Game-Service)
    try {
      const categoryCheck = await fetch(`${process.env.GAME_SERVICE_URL}/categories/${run_category_id}`);
      if (!categoryCheck.ok) throw new Error();
    } catch {
      throw new BadRequestException(`Run category with ID ${run_category_id} does not exist.`);
    }

    // Create a new run entry
    const newRun = await this.prisma.run.create({
      data: {
        run_category_id,
        user_id: authenticatedUserID,
        vod_url,
        run_duration: BigInt(run_duration),
        status: 'PENDING',
      },
    });

    return { message: 'Speedrun submission created successfully. Status is currently pending admin review', 
      data: {
        run_id: newRun.run_id,
        run_category_id: newRun.run_category_id,
        user_id: newRun.user_id,
        vod_url: newRun.vod_url,
        run_duration: this.formatDuration(Number(newRun.run_duration)),
        status: newRun.status,
        submitted_at: newRun.submitted_at,
      }
    };
  }

  // RUN MANAGEMENT
  // 1. GET /admin/runs/:status (Get all run entry filtered by status)
  async getAdminRuns(status: string) {
    // Input Validation
    if (!status || status.trim() === '') {
      throw new BadRequestException(
        'Run status must be filled.',
      );
    }

    const upperStatus = status.toUpperCase();
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];

    if (!validStatuses.includes(upperStatus)) {
      throw new BadRequestException('Invalid status. Allowed fields are PENDING, ACCEPTED, or REJECTED.');
    }

    const runs = await this.prisma.run.findMany({
      where: { status: upperStatus },
      orderBy: { run_duration: 'asc' },
    });

    return runs.map((run) => ({
      run_id: run.run_id,
      run_category_id: run.run_category_id,
      user_id: run.user_id,
      vod_url: run.vod_url,
      submitted_at: run.submitted_at,
      verified_at: run.verified_at,
      status: run.status,
      run_duration: this.formatDuration(Number(run.run_duration)),
    }));
  }

  // 2. POST /admin/runs/:id/accept & /reject (Modify approval state)
  async updateRunStatus(id: string, newStatus: 'ACCEPTED' | 'REJECTED') {
    // Input Validation
    if (!id || id.trim() === '') {
      throw new BadRequestException('Run ID must be filled.');
    }
    
    // Run Existence Validation
    const runExist = await this.prisma.run.findUnique({
      where: { run_id: id },
    });
    if (!runExist) {
      throw new NotFoundException(`Run submission with ID ${id} was not found.`);
    }

    // Run Status Validation
    if (runExist.status !== 'PENDING') {
      throw new BadRequestException(`Run submission with ID ${id} has already been reviewed.`);
    }

    await this.prisma.run.update({
      where: { run_id: id },
      data: { 
        status: newStatus,
        verified_at: new Date(),
      },
    });

    return { 
      message: `Run submission status successfully modified to ${newStatus.toLowerCase()}.` 
    };
  }
}
