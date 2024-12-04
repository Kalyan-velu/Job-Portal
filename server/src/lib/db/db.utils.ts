import { User } from '../../models/user.model'

export const findUserWithoutPasswordProjection = async (email: string) => {
  return await User.findOne({ email }, { password: 0 })
}
