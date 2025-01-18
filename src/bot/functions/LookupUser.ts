import { User } from "discord.js";
import { schemas } from "../../database";
//@ts-expect-error
import * as YALAS from 'mcstatusbot-logger';
import { UserAttributes } from '../../database/schemas/User';
export default async function LookupUser(user: User | null): Promise<UserAttributes | null> {
  if (user === null) return null
  let userDoc;
  try {
    userDoc = await schemas['User'].findOne({ where: { id: user.id } });
    if (userDoc !== null) return userDoc.dataValues;
    //TODO: implement check to update username avatar etc
    userDoc = await schemas['User'].create({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      admin: false,
    });
    return userDoc.dataValues;
  } catch (err: any) {
    YALAS.error(err);
    YALAS.error(err.stack || err);
    return null;
  }
}