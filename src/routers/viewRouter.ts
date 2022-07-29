import { Router } from 'express';

export const viewRouter = Router();

/* GET home page. */
viewRouter.get('/', function(req, res) {
  res.render('index', { title: 'Confession game API' });
});