import { Schema, model } from 'mongoose';
import {
  TUserName,
  TLocalGuardian,
  TGuardian,
  TStudent,
  StudentModel,
} from './student.interface';

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, 'Father name is required'] },
  fatherContact: {
    type: String,
    required: [true, 'Father Contact Number is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is required'],
  },
  motherName: { type: String, required: [true, 'Mother name is required'] },
  motherContact: {
    type: String,
    required: [true, 'Mother Contact Number is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is required'],
  },
});

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  middleName: { type: String },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
});

const LocalGuardianSchema = new Schema<TLocalGuardian>({
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  name: { type: String, required: true },
  occupation: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      unique: true,
      ref: 'User',
    },
    role: { type: String },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required '],
    },
    dateOfBirth: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required '],
      unique: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, '{VALUE} is not valid'],
    },
    contactNo: { type: String, required: [true, 'Contact No is required '] },
    emergencyContact: {
      type: String,
      required: [true, 'Emergency Contact No is required '],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, '{VALUE} is not valid '],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is required '],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is required '],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian is required'],
    },
    localGuardian: {
      type: LocalGuardianSchema,
      required: [true, 'LocalGuardian is required'],
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
    profileImage: {
      type: String,
      default: '',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual
studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName}  ${this?.name?.lastName}`;
});

studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

studentSchema.static('isUserExist', async function isUserExist(id: string) {
  const existingUser = await MStudent.findOne({ id: id });
  return existingUser;
});

export const MStudent = model<TStudent, StudentModel>('Student', studentSchema);
