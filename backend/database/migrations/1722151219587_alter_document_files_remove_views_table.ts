import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
    protected tableName = 'documents';

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('views');
        });
        this.schema.alterTable('files', (table) => {
            table.dropColumn('views');
        });
    }

    async down() {}
}
