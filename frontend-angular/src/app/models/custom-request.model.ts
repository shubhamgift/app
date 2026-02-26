import { User } from './user.model';

export interface CustomRequest {
  id?: number;
  user?: User;
  name: string;
  description: string;
  referenceImages: string[];
  status: string;
  adminResponse?: string;
  createdAt?: string;
  updatedAt?: string;
}
