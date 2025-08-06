export enum UserRole {
  PATIENT = 'PATIENT',
  PROFESSIONAL = 'PROFESSIONAL',
}
export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  licenseNumber?: string;
  specialty?: string;
  createdAt: Date;
  updatedAt: Date;
};
