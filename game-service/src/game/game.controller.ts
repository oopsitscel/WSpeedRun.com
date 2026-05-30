import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';

@ApiTags('Game Catalog & Management')
@ApiBearerAuth()
@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // Game Catalog
  @Get('/games')
  @ApiOperation({ summary: 'Get a list of all games' })
  findAllGames() {
    return this.gameService.findAllGames();
  }

  @Get('/games/:id')
  @ApiOperation({ summary: 'Get full details of a specific game' })
  findGameDetails(@Param('id') id: string) {
    return this.gameService.findGameDetails(id);
  }

  // Game Management
  @Post('/admin/games')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Create a new game record (Admin Only)' })
  createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @Patch('/admin/games/:id/update')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Update an existing game record (Admin Only)' })
  updateGame(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.updateGame(id, updateGameDto);
  }

  @Delete('/admin/games/:id/delete')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Delete a game record (Admin Only)' })
  deleteGame(@Param('id') id: string) {
    return this.gameService.deleteGame(id);
  }
}
