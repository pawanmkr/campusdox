import factory from '@adonisjs/lucid/factories';
import Document from '#models/document';

export const DocumentFactory = factory
    .define(Document, async ({ faker }) => {
        process.stdout.write('📄 ');
        return {
            title: faker.lorem.words(3),
            description: faker.lorem.paragraphs(3),
            downloads: faker.number.int({ min: 0, max: 10_000 }),
            views: faker.number.int({ min: 0, max: 1_000_000 }),
            userId: faker.number.int({ min: 1, max: 10 }),
        };
    })
    .build();
