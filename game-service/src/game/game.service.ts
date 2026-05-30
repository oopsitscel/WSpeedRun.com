import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  // GAME CATALOG
  // 1. GET /games (List of all games)
  async findAllGames() {
    return this.prisma.game.findMany();
  }

  // 2. GET /games/:id (Get full game details)
  async findGameDetails(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { game_id: id },
      include: { 
        categories: true,
      },
    });
    
    if (!game) throw new NotFoundException(`Game with ID ${id} not found.`);
    return game;
  }
  
  // GAME MANAGEMENT
  // 1. POST /admin/games (Admin can create a new game)
  async createGame(dto: CreateGameDto) {
    const { game_name, description } = dto;

    // Input Validation : Game_name and description must be filled
    if (!game_name || game_name.trim() === '') {
      throw new BadRequestException('Game name must be filled.');
    }
    if (!description || description.trim() === '') {
      throw new BadRequestException('Game description must be filled.');
    }

    const newGame = await this.prisma.game.create({
      data: {
        game_name,
        description,
      }
    });

    return { message: 'Game created successfully.', data: newGame };
  }

  // 2. PATCH /admin/games/:id/update (Admin can update game's details)
  async updateGame(id: string, updated: UpdateGameDto) {
    // Game Existence Validation
    const gameExist = await this.prisma.game.findUnique({ where: { game_id: id } });
    if (!gameExist) throw new NotFoundException(`Game with ID ${id} not found.`);

    // Update Validation
    if (!updated.game_name?.trim() && !updated.description?.trim()) {
      throw new BadRequestException('At least one field must be updated.');
    }

    const updatedGame = await this.prisma.game.update({
      where: { game_id: id },
      data: {
        game_name:
          updated.game_name?.trim()
            ? updated.game_name
            : undefined,

        description:
          updated.description?.trim()
            ? updated.description
            : undefined,
      },
    });

    return { message: 'Game updated successfully.', data: updatedGame};
  }

  // 3. DELETE /admin/games/:id/delete (Admin can delete a game)
  async deleteGame(id: string) {
    // Game Existence Validation
    const gameExist = await this.prisma.game.findUnique({ where: { game_id: id } });
    if (!gameExist) throw new NotFoundException(`Game with ID ${id} not found.`);
    
    // Relation Validation
    const categoryCount = await this.prisma.runCategory.count({ where: { game_id: id }});

    if (categoryCount > 0) {
      throw new BadRequestException('Cannot delete game that still has run categories.');
    }

    await this.prisma.game.delete({ where: { game_id: id } });
    return { message: 'Game deleted successfully.' };
  }
}