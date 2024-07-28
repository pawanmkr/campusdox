import { BaseSchema } from '@adonisjs/lucid/schema';
import { nanoid } from 'nanoid';

export default class AlterDocumentsTable extends BaseSchema {
    protected tableName = 'documents';

    async up() {
        // Step 1: Add temporary column to store nanoid values in documents table
        await this.db.rawQuery(`ALTER TABLE documents ADD COLUMN tmp_id VARCHAR(10)`);

        // Step 2: Add temporary column to store nanoid values in files table
        await this.db.rawQuery(`ALTER TABLE files ADD COLUMN tmp_document_id VARCHAR(10)`);
        await this.db.rawQuery(`ALTER TABLE files DROP CONSTRAINT files_document_id_foreign`);

        // Step 3: Populate the temporary nanoid columns and update related records
        const docs = await this.db.rawQuery('SELECT * FROM documents');
        if (Array.isArray(docs.rows)) {
            for (const doc of docs.rows) {
                const nano = nanoid(10);
                await this.db
                    .rawQuery(`UPDATE documents SET tmp_id = '${nano}' WHERE id = ${doc.id}`)
                    .exec();
                await this.db
                    .rawQuery(
                        `UPDATE files SET tmp_document_id = '${nano}' WHERE document_id = ${doc.id}`
                    )
                    .exec();
            }
        } else return;

        // Step 4: Alter the documents table to drop the old primary key and rename tmp_id to id
        this.schema.alterTable(this.tableName, (table) => {
            table.dropPrimary();
            table.dropColumn('id');
            table.renameColumn('tmp_id', 'id');
            table.primary(['id']);
        });

        // Step 5: Alter the files table to drop the old foreign key and rename tmp_document_id to document_id
        this.schema.alterTable('files', (table) => {
            table.dropColumn('document_id');
            table.renameColumn('tmp_document_id', 'document_id');
        });

        // Step 6: Re-add the foreign key constraint to the files table
        this.schema.alterTable('files', (table) => {
            table
                .foreign('document_id')
                .references('id')
                .inTable('documents')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
    }

    async down() {}
}
