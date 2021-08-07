import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude, Expose } from 'class-transformer';

@Entity({
  tableName: 'welcome_msg',
})
@Exclude()
export class WelcomeMsgEntity {
  @PrimaryKey()
  @Expose({ groups: ['list'] })
  id!: number;

  @Property()
  @Expose({ groups: ['list'] })
  serverid: string;

  @Property()
  @Expose({ groups: ['list'] })
  welcomechannel: string;

  @Property()
  @Expose({ groups: ['list'] })
  text: string;

  @Property()
  @Expose({ groups: ['list'] })
  image: string;
}
