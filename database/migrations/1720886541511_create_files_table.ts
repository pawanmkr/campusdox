import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
    protected tableName = 'files';

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('original_name');
            table.string('bucket');
            table.string('key');
            table.integer('downloads').defaultTo(0);
            table.integer('views').defaultTo(0);
            table
                .integer('document_id')
                .unsigned()
                .references('id')
                .inTable('documents')
                .onDelete('CASCADE');

            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    async down() {
        this.schema.dropTable(this.tableName);
    }
}
