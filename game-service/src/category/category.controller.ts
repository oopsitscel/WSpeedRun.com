import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';

@ApiTags('Run Category Catalog & Management')
@ApiBearerAuth()
@Controller('')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Run Category Catalog
  @Get('/categories/:id')
  @ApiOperation({ summary: "Get a specific run category's full details" })
  findOCategoryDetails(@Param('id') id: string) {
    return this.categoryService.findCategoryDetails(id);
  }

  // Run Category Management
  @Post('/admin/categories')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: "Create a new category record (Admin Only)" })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Patch('/admin/categories/:id/update')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: "Update an existing category record (Admin Only)" })
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete('/admin/categories/:id/delete')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: "Delete a category record (Admin Only)" })
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
