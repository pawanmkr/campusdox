import factory from '@adonisjs/lucid/factories';
import File from '#models/file';

export const FileFactory = factory
    .define(File, async ({ faker }) => {
        process.stdout.write('📄 ');
        return {
            originalName: faker.system.commonFileName(),
            bucket: faker.system.directoryPath(),
            key: faker.system.fileName(),
            downloads: faker.number.int({ min: 0, max: 10_000 }),
            documentId: faker.string.nanoid(10),
        };
    })
    .build();
