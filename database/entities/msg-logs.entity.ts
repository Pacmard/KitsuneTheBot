import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude, Expose } from 'class-transformer';

@Entity({
  tableName: 'messages_logs',
})
@Exclude()
export class MsgLogsEntity {
  @PrimaryKey()
  @Expose({ groups: ['list'] })
  id!: number;

  @Property()
  @Expose({ groups: ['list'] })
  serverid: string;

  @Property()
  @Expose({ groups: ['list'] })
  logschannel: string;
}
