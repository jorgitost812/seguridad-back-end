export interface JwtPayload {
  sub: number;
  email: string;
  rol?: string;
  jcId?: number;
  iat?: number;
  exp?: number;
}
