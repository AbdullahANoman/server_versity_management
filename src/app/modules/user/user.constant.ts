export const USER_ROLE = {
  student: 'student',
  faculty: 'faculty',
  admin: 'admin',
  superAdmin: 'superAdmin',
} as const;

export const userStatus = ['in-progress', 'blocked'];
export const userSearchAbleFields = [
  'email',
  'name.firstName',
  'name.lastName',
  'presentAddress',
]
