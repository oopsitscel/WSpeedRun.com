import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { username, email, country, password } = dto;

    // 1. Email Structure Validation
    if (!email) throw new BadRequestException('Email is required.');
    const atCount = email.split('@').length - 1;
    const dotCount = email.split('.').length - 1;

    if (atCount !== 1) throw new BadRequestException('Email must contain exactly one `@`');
    if (dotCount < 1) throw new BadRequestException('Email must contain at least one `.`');
    if (email.includes('@.') || email.includes('.@')) {
      throw new BadRequestException('Invalid email structure formatting.');
    }

    // 2. Password Complexity Validation
    let hasUpper = false, hasLower = false, hasNumber = false, hasSpecial = false;
    const specials = `!@#$%^&*()_+-=[]{}|;':",./<>?~\``;

    for (const char of password) {
      if (char >= 'A' && char <= 'Z') hasUpper = true;
      else if (char >= 'a' && char <= 'z') hasLower = true;
      else if (char >= '0' && char <= '9') hasNumber = true;
      else if (specials.includes(char)) hasSpecial = true;
    }

    if (!hasUpper) {
      throw new BadRequestException('Password must contain at least one uppercase letter.');
    }
    if (!hasLower) {
      throw new BadRequestException('Password must contain at least one lowercase letter.');
    }
    if (!hasNumber) {
      throw new BadRequestException('Password must contain at least one number (0-9).');
    }
    if (!hasSpecial) {
      throw new BadRequestException('Password must contain at least one special character.');
    }

    // 3. Username Existence Validation
    const usernameExist = await this.prisma.user.findFirst({ where: { username } });
    if (usernameExist) throw new BadRequestException('Username is already taken.');
    
    // 4. Email Existence Validation
    const emailExist = await this.prisma.user.findUnique({ where: { email } });
    if (emailExist) throw new BadRequestException('Email already registered.');

    // 5. Assign Role
    let assignedRole = 'USER';
    if(username.toLowerCase() === 'admin'){
      assignedRole = 'ADMIN'
    }

    // 6. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 7. Save newUser
    const newUser = await this.prisma.user.create({
      data: { 
        username, 
        email, 
        country, 
        password: hashedPassword, 
        role: assignedRole, 
      },
    });

    return { message: 'Registration successful!', 
      data: {
        username: newUser.username, 
        email: newUser.email, 
        country: newUser.country, 
        role: assignedRole,
      }
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    // 1. User Existence Validation
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email does not exist.');

    // 2. Check Password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      throw new UnauthorizedException('Invalid password.');
    }

    // 3. Generate JWT Token (Payload: id & role)
    const payload = { id: user.user_id, role: user.role };
    return {
      message: 'Login successful!',
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserProfile(id: string) {
    // User Existence Validation
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
      select: { 
        username: true, 
        email: true, 
        country: true, 
        role: true 
      },
    });
    if (!user) throw new NotFoundException(`Profile with User ID ${id} not found.`);
    return user;
  }
}