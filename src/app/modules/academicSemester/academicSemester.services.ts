import QueryBuilder from '../../builder/QueryBuilder';
import {
  academicSemesterNameCodeMapper,
  academicSemesterSearchFields,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.models';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  } else {
    const result = await AcademicSemester.create(payload);
    return result;
  }
};

const getAllAcademicSemestersFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
      .search(academicSemesterSearchFields)
      .filter()
      .sort()
      .paginate()
      .fields()
  
    const meta = await academicSemesterQuery.countTotal()
    const result = await academicSemesterQuery.modelQuery
    return {
      meta,
      result,
    }
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findOne({ _id: id });
  return result;
};

const updateASingleSemesterToDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateASingleSemesterToDB,
};
