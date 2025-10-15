export type UserRole = 'PRINCIPAL' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  _id?: string;
  tenant: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  password?: string;
  profileImage?: string;
  isActive?: boolean;

  fname?: string;
  lname?: string;
  mname?: string;
  // Student Fields
  admissionNo?: string;
  rollNo?: string;
  class?: {
    _id: string;
    name: string;
  };
  section?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  enrollmentDate?: string;

  singleParent?: boolean; // Whether the student has a single parent
  guardianName?: string; // Guardian full name
  guardianAddress?: string; // Guardian address
  guardianState?: string; // State name
  guardianCity?: string; // City name
  guardianZip?: number; // ZIP / Pincode
  guardianCountry?: string; // Country name
  guardianPhone?: string; // Guardian phone number
  guardianEmail?: string; // Guardian email ID
  guardianRelation?: 'Father' | 'Mother' | 'Guardian'; // Guardian relationship type

  // Parent Fields
  parentOf?: string[]; // Linked Student IDs

  // Teacher Fields
  employeeCode?: string;
  joiningDate?: string;
  qualification?: string;
  teacherSubjects?: string[]; // Subject IDs

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}
