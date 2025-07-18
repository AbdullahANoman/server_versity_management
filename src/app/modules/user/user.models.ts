import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcryptjs';
import config from '../../config';
import { userStatus } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    needPasswordChange: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'student', 'faculty'],
    },
    passwordChangedAt: {
      type: Date,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: userStatus,
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    //using for created time and updated time know
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_sal_rounds),
    );
    next();
  } else {
    next();
  }
});
userSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (id) {
  return await User.findOne({
    id: id,
  }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (plainText, hashedText) {
  return await bcrypt.compare(plainText, hashedText);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
