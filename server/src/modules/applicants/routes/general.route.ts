import { Router } from 'express';

const generalRouter = Router();

generalRouter.post('/signup', (req, res) => {});

generalRouter.get('/', (req, res) => {
  res.send(`<h1>Applicant Routes</h1>`);
});
export default generalRouter;
