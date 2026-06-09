import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponse, AuthUser, PublicUser } from './auth.types';

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30;

type UserRecord = {
  id: number;
  email: string;
  name: string;
  surname: string | null;
  age: number | null;
  gender: string | null;
  birthDate: Date | null;
  weightKg: number | null;
  heightCm: number | null;
  registrationDate: Date;
};

@Injectable()
export class AuthService {
  private readonly tokenSecret =
    process.env.AUTH_TOKEN_SECRET ?? 'wnote-local-dev-secret';

  constructor(private readonly prisma: PrismaService) {}

  async register(body: {
    email?: string;
    password?: string;
    name?: string;
  }): Promise<AuthResponse> {
    const email = this.normalizeEmail(body.email);
    const password = this.validatePassword(body.password);
    const name = this.normalizeName(body.name, email);

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email gia registrata');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: this.hashPassword(password),
        appData: {
          create: {
            workouts: '[]',
            exercises: '[]',
            history: '[]',
          },
        },
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(body: {
    email?: string;
    password?: string;
  }): Promise<AuthResponse> {
    const email = this.normalizeEmail(body.email);
    const password = this.validatePassword(body.password);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !this.verifyPassword(password, user.password)) {
      throw new UnauthorizedException('Email o password non validi');
    }

    return this.buildAuthResponse(user);
  }

  async updateProfile(
    authUser: AuthUser,
    body: {
      name?: string;
      age?: number | string | null;
      height?: number | string | null;
      weight?: number | string | null;
    },
  ): Promise<{ user: PublicUser }> {
    const user = await this.prisma.user.update({
      where: { id: authUser.userId },
      data: {
        name: this.normalizeName(body.name, authUser.email),
        age: this.toNullableInteger(body.age),
        heightCm: this.toNullableFloat(body.height),
        weightKg: this.toNullableFloat(body.weight),
      },
    });

    return { user: this.toPublicUser(user) };
  }

  verifyToken(token: string | undefined): AuthUser {
    if (!token) {
      throw new UnauthorizedException('Token mancante');
    }

    const [payloadPart, signature] = token.split('.');
    if (!payloadPart || !signature) {
      throw new UnauthorizedException('Token non valido');
    }

    const expectedSignature = this.sign(payloadPart);
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);
    if (
      signatureBuffer.length !== expectedSignatureBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
      throw new UnauthorizedException('Token non valido');
    }

    let payload: AuthUser & { exp: number };
    try {
      payload = JSON.parse(
        Buffer.from(payloadPart, 'base64url').toString('utf8'),
      ) as AuthUser & { exp: number };
    } catch {
      throw new UnauthorizedException('Token non valido');
    }

    if (!payload.userId || !payload.email || Date.now() > payload.exp) {
      throw new UnauthorizedException('Sessione scaduta');
    }

    return { userId: payload.userId, email: payload.email };
  }

  private buildAuthResponse(user: UserRecord): AuthResponse {
    const publicUser = this.toPublicUser(user);

    return {
      token: this.createToken({
        userId: publicUser.id,
        email: publicUser.email,
      }),
      user: publicUser,
    };
  }

  private createToken(authUser: AuthUser): string {
    const payload = Buffer.from(
      JSON.stringify({
        ...authUser,
        exp: Date.now() + TOKEN_TTL_MS,
      }),
    ).toString('base64url');

    return `${payload}.${this.sign(payload)}`;
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.tokenSecret)
      .update(payload)
      .digest('base64url');
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `scrypt$${salt}$${hash}`;
  }

  private verifyPassword(password: string, storedPassword: string): boolean {
    const [method, salt, hash] = storedPassword.split('$');
    if (method !== 'scrypt' || !salt || !hash) {
      return false;
    }

    const computed = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(hash, 'hex'), computed);
  }

  private normalizeEmail(email: string | undefined): string {
    const value = (email ?? '').trim().toLowerCase();
    if (!value || !value.includes('@')) {
      throw new BadRequestException('Email non valida');
    }
    return value;
  }

  private validatePassword(password: string | undefined): string {
    const value = password ?? '';
    if (value.length < 6) {
      throw new BadRequestException('Password di almeno 6 caratteri');
    }
    return value;
  }

  private normalizeName(name: string | undefined, email: string): string {
    const value = (name ?? '').trim();
    return value || email.split('@')[0] || 'Utente';
  }

  private toNullableInteger(value: number | string | null | undefined) {
    if (value === null || value === undefined || value === '') return null;
    const parsed = parseInt(String(value), 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private toNullableFloat(value: number | string | null | undefined) {
    if (value === null || value === undefined || value === '') return null;
    const parsed = parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : null;
  }

  private toPublicUser(user: UserRecord): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      age: user.age,
      gender: user.gender,
      birthDate: user.birthDate,
      weight: user.weightKg,
      height: user.heightCm,
      registrationDate: user.registrationDate,
    };
  }
}
