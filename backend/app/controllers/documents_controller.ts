import Document from '#models/document';
import File from '#models/file';
import env from '#start/env';
import { MultipartFile } from '@adonisjs/core/bodyparser';
import { Exception } from '@adonisjs/core/exceptions';
import type { HttpContext } from '@adonisjs/core/http';

export default class DocumentsController {
    async index({ request }: HttpContext) {
        const { page, limit } = request.qs();
        return Document.query().preload('user').preload('files').offset(page).limit(limit);
    }

    async store({ request, response }: HttpContext) {
        const { title, description } = request.only(['title', 'description']);

        let doc;
        doc = new Document();
        doc.title = title;
        doc.description = description;
        doc.userId = 1;
        doc = await doc.save();

        const promises = [];

        const files = request.allFiles().files as MultipartFile[];
        for (const file of files) {
            const f = new File();
            f.originalName = file.clientName;
            f.bucket = env.get('CLOUDFLARE_BUCKET');
            f.key = file.tmpPath?.split('/').pop() || `${file.clientName}_${file.size}`;
            f.documentId = doc.id;
            promises.push(f.save());
        }

        await Promise.all(promises);
        doc = await Document.query().where('id', doc.id).preload('files');

        return response.status(201).json(doc);
    }

    async show({ params }: HttpContext) {
        return Document.query().where('id', params.id).preload('user').preload('files');
    }

    // later
    async update({}: HttpContext) {}

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
