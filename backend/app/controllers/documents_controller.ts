import Document from '#models/document';
import File from '#models/file';
import { uploadFile } from '#services/storage_service';
import env from '#start/env';
import { Exception } from '@adonisjs/core/exceptions';
import type { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';
import jwt from 'jsonwebtoken';

export default class DocumentsController {
    async index({ request }: HttpContext) {
        const { page, limit } = request.qs();

        return Document.query()
            .preload('user')
            .preload('files')
            .orderBy('createdAt', 'desc')
            .offset(page - 1)
            .limit(limit);
    }

    async store({ request, response }: HttpContext) {
        console.log(request.request.headers);
        const token = request.request.headers.authorization?.replace('Bearer ', '');
        if (!token) return response.unauthorized();

        const payload = jwt.verify(token, env.get('APP_KEY'));
        console.log(payload);

        const { title, description } = request.only(['title', 'description']);
        logger.info(title, description);

        let doc;
        doc = new Document();
        doc.title = title;
        doc.description = description;
        doc.userId = 1;
        logger.info('saving document');
        doc = await doc.save();
        logger.info(doc);

        const promises = [];

        for (const file of request.files('files')) {
            const f = new File();

            f.originalName = file.clientName;
            f.bucket = env.get('CLOUDFLARE_BUCKET');
            f.key = file.tmpPath?.split('/').pop() || `${file.clientName}_${file.size}`;
            f.documentId = doc.id;

            promises.push(f.save());

            // file upload to persistent storage
            promises.push(await uploadFile(file, f.key, f.bucket));
        }

        logger.info('promises resolving...');
        const result = await Promise.all(promises);
        logger.info('promises resolved');
        logger.info(result);

        doc = await Document.query().where('id', doc.id).preload('files');
        logger.info('doc loaded again');

        return response.status(201).json(doc);
    }

    async show({ params }: HttpContext) {
        return Document.query().where('id', params.id).preload('user').preload('files');
    }

    // later
    async update({}: HttpContext) {}

    async increaseDownloadCount({ request, response }: HttpContext) {
        const { downloaded } = request.only(['downloaded']);
        const id = request.param('id');

        if (downloaded) {
            const doc = await Document.find(id);
            if (doc) {
                await Document.query()
                    .where('id', id)
                    .update({ downloads: doc.downloads + 1 });
            } else {
                return response.notFound({ message: 'requested document not found' });
            }

            return response.created({ downloads: doc.downloads + 1 });
        }

        return response.internalServerError({ id, downloaded });
    }

    async destroy({ params, response }: HttpContext) {
        try {
            const d = await Document.findOrFail(params.id);
            await d.delete();

            response.status(200).json({ message: 'Document deleted successfully!' });
        } catch (error) {
            if (error instanceof Exception && error.status === 404) {
                response.abort({ message: 'Document does not exist' }, 404);
            }
        }
    }

    async search({ request, response }: HttpContext) {
        const { query, page, limit } = request.qs();

        const documents = await Document.query()
            .whereILike('title', `%${query}%`)
            .orWhereILike('description', `%${query}%`)
            .preload('user')
            .preload('files')
            .offset(page)
            .limit(limit);

        response.json(documents);
    }
}
