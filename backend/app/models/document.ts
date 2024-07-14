import { DateTime } from 'luxon';
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import User from './user.js';
import File from './file.js';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';

export default class Document extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare title: string;

    @column()
    declare description: string;

    @column()
    declare downloads: number;

    @column()
    declare views: number;

    @column()
    declare userId: number;

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>;

    @hasMany(() => File)
    declare files: HasMany<typeof File>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    @beforeCreate()
    static setDefaultValues(document: Document) {
        if (!document.downloads) document.downloads = 0;
        if (!document.views) document.views = 0;
    }
}
