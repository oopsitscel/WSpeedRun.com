import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // 1. POST /comments (Create new comment in a specific run)
  async createComment(dto: CreateCommentDto, authenticatedUserID: string) {
    const { run_id, user_id, comment } = dto;

    // Input Validation : Run ID must exist, User ID must exist, Comment must be filled
    if (!run_id || run_id.trim() === '') {
      throw new BadRequestException('Run ID must be filled');
    }
    if (!user_id || user_id.trim() === '') {
      throw new BadRequestException('User ID must be filled');
    }
    if (!comment || comment.trim() === '') {
      throw new BadRequestException('Comment must be filled.');
    }

    // Run Existence Validation
    const runExist = await this.prisma.run.findUnique({ where: { run_id } });
    if (!runExist) {
      throw new BadRequestException(`Run with ID ${run_id} does not exist.`);
    }

    // Run User Existence Validation (Using Auth-Service)
    try {
      const userCheck = await fetch(`${process.env.AUTH_SERVICE_URL}/users/${user_id}/profile`);
      if (!userCheck.ok) throw new Error();
    } catch {
      throw new NotFoundException(`User with ID ${user_id} does not exist.`);
    }
    
    // Security Gate: Ensure the client-submitted user_id matches the token payload id
    if (user_id !== authenticatedUserID) {
      throw new ForbiddenException('The user ID payload does not match the authenticated user.');
    }
    
    // Insert newComment into the comments table
    const newComment = await this.prisma.comment.create({
      data: {
        run_id,
        user_id,
        comment,
      },
    });

    return { message: 'Comment created successfully.', data: newComment };
  }

  // 2. DELETE /comments/:id (Delete comment)
  async deleteComment(commentID: string, authenticatedUserID: string) {
    // Comment Existence Validation
    const commentExist = await this.prisma.comment.findUnique({
      where: { comment_id: commentID },
    });
    if (!commentExist) {
      throw new NotFoundException(`Comment with ID ${commentID} not found.`);
    }

    // Check if the Comment belongs to the Authenticated User
    if (commentExist.user_id !== authenticatedUserID) {
      throw new ForbiddenException('You are not the owner of this comment. Deletion denied.');
    }

    // Delete the comment from database
    await this.prisma.comment.delete({
      where: { comment_id: commentID },
    });

    return { message: 'Comment deleted successfully.' };
  }
}
