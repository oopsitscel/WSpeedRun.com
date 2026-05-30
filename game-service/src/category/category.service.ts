import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // RUN CATEGORY CATALOG
  // 1. GET /categories/:id (Get full run category's details)
  async findCategoryDetails(id: string) {
    const category = await this.prisma.runCategory.findUnique({
      where: { run_category_id: id },
      include: {
        game: true,
      }
    });
    
    if (!category) throw new NotFoundException(`Run category with ID ${id} not found.`);
    return category;
  }

  // RUN CATEGORY MANAGEMENT
  // 1. POST /admin/categories (Admin can create new run category)
  async createCategory(dto: CreateCategoryDto) {
    const { game_id, run_category_name } = dto;
    //Input Validation : GameID must exist and RunCategoryName must be filled
    if (run_category_name?.trim() === '') {
      throw new BadRequestException('Run category name must be filled.');
    }
    // Game Existence Validation
    const gameExist = await this.prisma.game.findUnique({ where: { game_id: game_id } });
    if (!gameExist) {
      throw new NotFoundException(`Game with ID ${game_id} not found.`);
    }

    const newCategory = await this.prisma.runCategory.create({
      data: {
        game_id,
        run_category_name,
      }
    });
    return { message: 'Run category created successfully.', data: newCategory };
  }

  // 2. PATCH /admin/categories/:id/update (Admin can update run category's details)
  async updateCategory(id: string, updated: UpdateCategoryDto) {
    // Category Existence Validation
    const categoryExist = await this.prisma.runCategory.findUnique({ where: { run_category_id: id } });
    if (!categoryExist) throw new NotFoundException(`Run category with ID ${id} not found.`);
    
    // Update Validation
    if (!updated.game_id?.trim() && !updated.run_category_name?.trim()) {
      throw new BadRequestException('At least one field must be updated.');
    }
    
    // Game Existence Validation
    if (updated.game_id?.trim()) {
      const gameExist = await this.prisma.game.findUnique({ where: { game_id: updated.game_id } });
      if (!gameExist){
        throw new BadRequestException(`Target game with ID ${updated.game_id} does not exist`);
      }
    }
    
    const updatedCategory = await this.prisma.runCategory.update({
      where: { run_category_id: id },
      data: {
        game_id:
          updated.game_id?.trim()
            ? updated.game_id
            : undefined,

        run_category_name:
          updated.run_category_name?.trim()
            ? updated.run_category_name
            : undefined,

      },
    });

    return { message: 'Run category updated successfully.', data: updatedCategory };
  }

  // 3. DELETE /admin/categories/:id/delete (Admin can delete run category)
  async deleteCategory(id: string) {
    // Category Existence Validation
    const categoryExist = await this.prisma.runCategory.findUnique({ where: { run_category_id: id } });
    if (!categoryExist) throw new NotFoundException(`Run category with ID ${id} not found.`);

    await this.prisma.runCategory.delete({ where: { run_category_id: id } });
    return { message: 'Run category deleted successfully.' };
  }
}