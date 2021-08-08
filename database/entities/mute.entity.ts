import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude, Expose } from 'class-transformer';

@Entity({
  tableName: 'mute',
})
@Exclude()
export class MuteEntity {
  @PrimaryKey()
  @Expose({ groups: ['list'] })
  id!: number;

  @Property()
  @Expose({ groups: ['list'] })
  userid: string;

  @Property()
  @Expose({ groups: ['list'] })
  roles: any;

  @Property()
  @Expose({ groups: ['list'] })
  server_id: string;

  @Property()
  @Expose({ groups: ['list'] })
  unmute_time: number;

  @Property()
  @Expose({ groups: ['list'] })
  reason: string;

  @Property()
  @Expose({ groups: ['list'] })
  is_unmuted: number;
}
