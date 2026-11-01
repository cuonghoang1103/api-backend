import type { User } from '../base/entity.ts';

// Narrowing an inherited property is allowed: every Student is still a User.
export interface Student extends User {
  role: 'STUDENT';
  studentCode: string;
}

// Changing its type is not: a "User" whose id is text would break every function that takes a User.
export interface ImportedUser extends User {
  id: string;
}
