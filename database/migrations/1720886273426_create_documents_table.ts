import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
    protected tableName = 'documents';

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('title');
            table.text('description');
            table.integer('downloads').defaultTo(0);
            table.integer('views').defaultTo(0);
            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE'); // Foreign key to users table

            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    async down() {
        this.schema.dropTable(this.tableName);
    }
}
