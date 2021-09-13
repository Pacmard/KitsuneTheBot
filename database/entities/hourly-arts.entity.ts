import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude, Expose } from 'class-transformer';

@Entity({
  tableName: 'hourly_arts',
})
@Exclude()
export class HourlyArtsEntity {
  @PrimaryKey()
  @Expose({ groups: ['list'] })
  id!: number;

  @Property()
  @Expose({ groups: ['list'] })
  serverid: string;

  @Property()
  @Expose({ groups: ['list'] })
  channelid: string;

  @Property()
  @Expose({ groups: ['list'] })
  webhook_url: string;
}
