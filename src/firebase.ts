import * as admin from 'firebase-admin';

require('dotenv').config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_CONFIG as string) as any
    ),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const create_dm_id = (partner: string, uid: string): string => {
  if (uid < partner) {
    return uid + '@' + partner;
  }

  return partner + '@' + uid;
};

export const get_uid = async (token: string) => {
  const ret = await admin.auth().verifyIdToken(token);
  return ret.uid;
};

export const set_dm_rooms = async (params: {
  uid: string;
  partner: string;
}): Promise<void> => {
  await admin
    .database()
    .ref('dm_rooms')
    .child(create_dm_id(params.partner, params.uid))
    .set({
      member1: await params.uid,
      member2: params.partner,
      createdAt: new Date().getTime(),
    });
};
