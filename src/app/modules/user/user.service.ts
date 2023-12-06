import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.models';
import { TStudent } from '../student/student.interface';
import { MStudent } from '../student/student.models';
import { TUser } from './user.interface';
import { User } from './user.models';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);

  //set role
  userData.role = 'student';
  //set id

  // generate studentId

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  userData.id = await generateStudentId(admissionSemester as TAcademicSemester);
  //   createUser
  const newUser = await User.create(userData); //built in static method
  if (Object.keys(newUser).length) {
    // set id and _id  as user
    payload.id = newUser.id;
    payload.user = newUser._id;
    const newStudent = await MStudent.create(payload); //
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
