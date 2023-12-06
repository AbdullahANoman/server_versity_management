import { Model, Types } from 'mongoose';

// import { Schema, model, connect } from 'mongoose';
export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherOccupation: string;
  motherContact: string;
};

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  role: 'student' | 'admin' | 'faculty';
  dateOfBirth: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  contactNo: string;
  emergencyContact: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  permanentAddress: string;
  presentAddress: string;
  guardian: TGuardian;
  admissionSemester: Types.ObjectId;
  localGuardian: TLocalGuardian;
  profileImage?: string;
  isDeleted: boolean;
};

export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isUserExist(id: string): Promise<TStudent | null>;
}

//creating instance methods

// export type StudentMethods = {
//   isUserExist(id: string): Promise<TStudent | null>;
// };

//main student model
//studentMethods using

// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >;
