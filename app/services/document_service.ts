import { MultipartFile } from '@adonisjs/core/bodyparser';
import { uploadFile } from './storage_service.js';
import { nanoid } from 'nanoid';
import env from '#start/env';

export class Document {
    async index() {}

    async create(file: MultipartFile) {
        const key = `doxcollege/${nanoid(10)}`; // filename in cloud
        const bucket = env.get('CLOUDFLARE_BUCKET');

        await uploadFile(file, key, bucket);

        // clear file from tmpPath after upload

        // store in db: document [ user_id, key, bucket, original_filename, downloads ]
    }
}
