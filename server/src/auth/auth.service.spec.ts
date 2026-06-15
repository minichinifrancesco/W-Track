import { BadRequestException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  type CreateUserRequest = {
    data: {
      email: string;
      password: string;
      name: string;
      surname: string;
      birthDate: Date;
      age: number;
    };
  };

  type CreatedUser = CreateUserRequest['data'] & {
    id: number;
    gender: null;
    weightKg: null;
    heightCm: null;
    registrationDate: Date;
  };

  const findUniqueUser = jest.fn<Promise<null>, []>();
  const createUser = jest.fn<
    Promise<CreatedUser>,
    [request: CreateUserRequest]
  >();

  const prisma = {
    user: {
      findUnique: findUniqueUser,
      create: createUser,
    },
  };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(prisma as unknown as PrismaService);
    findUniqueUser.mockResolvedValue(null);
    createUser.mockImplementation((request) =>
      Promise.resolve({
        id: 1,
        ...request.data,
        gender: null,
        weightKg: null,
        heightCm: null,
        registrationDate: new Date('2026-01-01T00:00:00.000Z'),
      }),
    );
  });

  it('stores date-only birth dates without timezone shifts', async () => {
    const response = await service.register({
      email: ' Test@Example.com ',
      password: 'Secret1!',
      name: 'Mario',
      surname: 'Rossi',
      birthDate: '2000-06-15',
    });

    const createRequest = createUser.mock.calls[0]?.[0];
    expect(createRequest?.data.email).toBe('test@example.com');
    expect(createRequest?.data.birthDate).toEqual(
      new Date('2000-06-15T00:00:00.000Z'),
    );
    expect(response.user.birthDate).toEqual(
      new Date('2000-06-15T00:00:00.000Z'),
    );
  });

  it('rejects impossible calendar dates', async () => {
    await expect(
      service.register({
        email: 'test@example.com',
        password: 'Secret1!',
        name: 'Mario',
        surname: 'Rossi',
        birthDate: '2000-02-31',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns a recognizable conflict for an existing account', async () => {
    findUniqueUser.mockResolvedValueOnce({} as never);

    await expect(
      service.register({
        email: 'test@example.com',
        password: 'Secret1!',
        name: 'Mario',
        surname: 'Rossi',
        birthDate: '2000-06-15',
      }),
    ).rejects.toMatchObject<Partial<ConflictException>>({
      response: {
        code: 'ACCOUNT_ALREADY_EXISTS',
        message: 'Account già registrato, effettua il login',
      },
      status: 409,
    });
    expect(createUser).not.toHaveBeenCalled();
  });

  it('requires name, surname and birth date during registration', async () => {
    await expect(
      service.register({
        email: 'test@example.com',
        password: 'Secret1!',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects weak passwords during registration', async () => {
    await expect(
      service.register({
        email: 'test@example.com',
        password: 'secret1',
        name: 'Mario',
        surname: 'Rossi',
        birthDate: '2000-06-15',
      }),
    ).rejects.toMatchObject<Partial<BadRequestException>>({
      response: {
        error: 'Bad Request',
        message:
          'La password deve contenere almeno 8 caratteri, una lettera minuscola, una lettera maiuscola, un numero e un simbolo',
        statusCode: 400,
      },
    });
    expect(createUser).not.toHaveBeenCalled();
  });
});
