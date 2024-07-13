import { DocumentFactory } from '#database/factories/document_factory';
import { FederatedLoginFactory } from '#database/factories/federated_login_factory';
import { FileFactory } from '#database/factories/file_factory';
import { UserFactory } from '#database/factories/user_factory';
import logger from '@adonisjs/core/services/logger';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
    async run() {
        logger.info('Seeding database...');
        await UserFactory.createMany(10);
        logger.info('Seeded users');

        await FederatedLoginFactory.createMany(10);
        logger.info('Seeded federated logins');

        await DocumentFactory.createMany(100);
        logger.info('Seeded documents');

        await FileFactory.createMany(200);
        logger.info('Seeded files');
    }
}
