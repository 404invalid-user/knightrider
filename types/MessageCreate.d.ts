import {GuildAttributes} from '../src/database/schemas/Guild';
import {UserAttributes} from '../src/database/schemas/User';

export interface MessageCreateOptions {
  hasPrefix: boolean,
  msgCmds: string[],
  guild: GuildAttributes,
  user: UserAttributes
}