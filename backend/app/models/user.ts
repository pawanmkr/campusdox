import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, beforeSave, column, hasOne } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import FederatedLogin from './federated_login.js';
import type { HasOne } from '@adonisjs/lucid/types/relations';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare username: string;

    @column()
    declare avatar: string;

    @column()
    declare fullName: string;

    @column()
    declare email: string;

    @column({ serializeAs: null })
    declare password: string | null;

    @column()
    declare isFederatedUser: boolean;

    @hasOne(() => FederatedLogin)
    declare federatedLogin: HasOne<typeof FederatedLogin>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null;

    @beforeSave()
    static async hashPassword(user: User) {
        if (user.password && user.$dirty.password) user.password = await hash.make(user.password);
    }
}
