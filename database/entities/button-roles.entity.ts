import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude, Expose } from 'class-transformer';

@Entity({
  tableName: 'button_roles',
})
@Exclude()
export class ButtonRolesEntity {
  @PrimaryKey()
  @Expose({ groups: ['list'] })
  id!: number;

  @Property()
  @Expose({ groups: ['list'] })
  serverid: string;

  @Property()
  @Expose({ groups: ['list'] })
  role: string;

  @Property()
  @Expose({ groups: ['list'] })
  messageid: string;

  @Property()
  @Expose({ groups: ['list'] })
  role_uuid: string;
}
