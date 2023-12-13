import { MStudent } from './student.models';

const getAllStudentFromDB = async () => {
  const result = await MStudent.find()
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
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
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
};
