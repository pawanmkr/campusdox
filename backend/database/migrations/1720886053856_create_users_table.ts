import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
    protected tableName = 'users';

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.text('avatar');
            table.string('username');
            table.string('full_name');
            table.string('email');
            table.string('password');
            table.boolean('is_federated_user');

            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    async down() {
        this.schema.dropTable(this.tableName);
    }
}
