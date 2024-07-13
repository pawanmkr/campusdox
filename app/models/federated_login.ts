import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from './user.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class FederatedLogin extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare provider: string;

    @column()
    declare providerId: string;

    @column()
    declare userId: number;

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;
}
