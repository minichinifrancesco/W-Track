export type PublicUser = {
  id: number;
  email: string;
  name: string;
  surname: string;
  gender: string;
  age: number | null;
  birthDate: Date | null;
  weight: number | null;
  height: number | null;
  registrationDate: Date;
};

export type AuthUser = {
  userId: number;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: PublicUser;
};
