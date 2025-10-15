import { Classroom } from './class.interface';
import { User } from './user.interface';

export interface Subject {
  _id?: string;
  tenant?: string; // ObjectId as string
  name: string;
  code: string;
  classroom: string | Classroom; // can be ID or populated object
  teacher?: string | User; // optional, ID or populated object
  createdAt?: Date;
  updatedAt?: Date;
}
