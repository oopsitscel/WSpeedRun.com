import { Controller, Post, Body, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Comment Management')
@ApiBearerAuth()
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new comment on a specific run entry' })
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    const authenticatedUserID = req.user.id;
    return this.commentService.createComment(createCommentDto, authenticatedUserID);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a comment' })
  deleteComment(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const authenticatedUserID = req.user.id;
    return this.commentService.deleteComment(id, authenticatedUserID);
  }
}
