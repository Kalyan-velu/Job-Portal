import { User } from '../../models/user.model';

export const findUserWithoutPasswordProjection = async (email) => {
  return await User.findOne({ email }, { password: 0 });
};
