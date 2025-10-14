import { Router } from 'express';
import { getCurrentUser } from '../controllers/user.controller';

const user = Router();

user.route('/me').get(getCurrentUser);
export default user;
