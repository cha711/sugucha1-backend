import * as Express from 'express';
import * as Cors from 'cors';

import { get_uid, set_dm_rooms } from './firebase';

interface i_Custom extends Express.Request {
  query: {
    uid: string;
  };
  body: {
    partner: string;
  };
}

const app = Express();

// postリクエスト使えるようにする
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Cors());

// ミドルウエア
app.use(
  async (req: i_Custom, res: Express.Response, next: Express.NextFunction) => {
    if (req.headers.authorization === undefined) {
      res.sendStatus(403);
      return;
    }

    req.query.uid = await get_uid(req.headers.authorization);
    next();
  }
);

// // エラーハンドリング
app.use(
  async (
    _: Error,
    __: Express.Request,
    res: Express.Response,
    ___: Express.NextFunction
  ) => {
    res.sendStatus(500);
  }
);

app.post('/set_dm_rooms', async (req: i_Custom, res: Express.Response) => {
  try {
    await set_dm_rooms({
      uid: req.query.uid,
      partner: req.body.partner,
    });

    res.send({});
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT || 3000);

console.log('start');

export default app;
