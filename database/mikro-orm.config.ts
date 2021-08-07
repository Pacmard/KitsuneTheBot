import { Options } from '@mikro-orm/core';
import {
  JoinLogEntity, MuteEntity, UserInfoEntity, MsgLogsEntity, LeaveLogEntity, WelcomeMsgEntity,
} from './entities';

const cfg = require('../config.json');

export const ormConfig: Options = {
  entities: [
    JoinLogEntity, MuteEntity, UserInfoEntity, MsgLogsEntity, LeaveLogEntity, WelcomeMsgEntity,
  ],
  dbName: cfg.mysqlDb,
  type: 'mysql',
  user: cfg.mysqlUser,
  host: 'localhost',
  port: 3306,
  password: cfg.mysqlPasswd,
};
