import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
    protected tableName = 'sessions';

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.text('session_id');
            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table.timestamp('last_login');

            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }

    async down() {
        this.schema.dropTable(this.tableName);
    }
}
