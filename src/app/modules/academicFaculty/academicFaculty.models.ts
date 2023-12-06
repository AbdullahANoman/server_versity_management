import { Schema } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';
import { model } from 'mongoose';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: 'string',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AcademicFaculty = model<TAcademicFaculty>(
  'AcademicFaculty',
  academicFacultySchema,
);
