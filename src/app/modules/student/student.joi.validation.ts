import Joi from 'joi';

const studentJoiValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.object({
    firstName: Joi.string()
      .max(8)
      .regex(/^[A-Z][a-z]*$/)
      .required()
      .messages({
        'string.max': 'First name cannot exceed 8 characters',
        'string.pattern.base':
          'First name should start with an uppercase letter followed by lowercase letters',
        'any.required': 'First name is required',
      }),
    middleName: Joi.string(),
    lastName: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .required()
      .messages({
        'string.pattern.base':
          'Last name should only contain alphabetic characters',
        'any.required': 'Last name is required',
      }),
  })
    .required()
    .messages({ 'any.required': 'Name is required' }),
  dateOfBirth: Joi.string()
    .required()
    .messages({ 'any.required': 'Date of birth is required' }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email should be a valid email address',
    'any.required': 'Email is required',
  }),
  gender: Joi.string().valid('male', 'female').required(),
  contactNo: Joi.string()
    .required()
    .messages({ 'any.required': 'Contact No is required' }),
  emergencyContact: Joi.string()
    .required()
    .messages({ 'any.required': 'Emergency Contact No is required' }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .required()
    .messages({ 'any.only': 'Blood group should be a valid type' }),
  permanentAddress: Joi.string()
    .required()
    .messages({ 'any.required': 'Permanent Address is required' }),
  presentAddress: Joi.string()
    .required()
    .messages({ 'any.required': 'Present Address is required' }),
  guardian: Joi.object({
    fatherName: Joi.string()
      .required()
      .messages({ 'any.required': 'Father name is required' }),
    fatherContact: Joi.string()
      .required()
      .messages({ 'any.required': 'Father Contact Number is required' }),
    fatherOccupation: Joi.string()
      .required()
      .messages({ 'any.required': 'Father Occupation is required' }),
    motherName: Joi.string()
      .required()
      .messages({ 'any.required': 'Mother name is required' }),
    motherContact: Joi.string()
      .required()
      .messages({ 'any.required': 'Mother Contact Number is required' }),
    motherOccupation: Joi.string()
      .required()
      .messages({ 'any.required': 'Mother Occupation is required' }),
  })
    .required()
    .messages({ 'any.required': 'Guardian is required' }),
  localGuardian: Joi.object({
    address: Joi.string().required(),
    contactNo: Joi.string().required(),
    name: Joi.string().required(),
    occupation: Joi.string().required(),
  })
    .required()
    .messages({ 'any.required': 'LocalGuardian is required' }),
  profileImage: Joi.string()
    .required()
    .messages({ 'any.required': 'ProfileImage is required' }),
  isActive: Joi.string().valid('active', 'block').default('active').required(),
});

export default studentJoiValidationSchema;
