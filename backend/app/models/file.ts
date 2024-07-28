import { DateTime } from 'luxon';
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm';
import Document from './document.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class File extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare originalName: string;

    @column()
    declare bucket: string;

    @column()
    declare key: string;

    @column()
    declare downloads: number;

    @column()
    declare documentId: string;

    @belongsTo(() => Document)
    declare document: BelongsTo<typeof Document>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    @beforeCreate()
    static process(files: File) {
        if (!files.downloads) files.downloads = 0;
    }
}
