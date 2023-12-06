import { TStudent } from './student.interface';
import { MStudent } from './student.models';

const createStudentIntoDB = async (studentData: TStudent) => {
  if (await MStudent.isUserExist(studentData.id)) {
    throw Error('Student already exists');
  }

  const result = await MStudent.create(studentData); //built in static method

  // creating instance method
  // const student = new MStudent(studentData);
  // if (await student.isUserExist(studentData.id)) {
  //   throw Error('Student already exists');
  // }
  // const result = await student.save(); // built in instance method
  return result;
};
const getAllStudentFromDB = async () => {
  const result = await MStudent.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await MStudent.findOne({ id });
  return result;
};
const deleteSingleStudentFromDB = async (id: string) => {
  const result = await MStudent.updateOne({ id: id }, { isDeleted: true });
  return result;
};

export const StudentService = {
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
};
