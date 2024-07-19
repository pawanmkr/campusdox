import { defineConfig } from '@adonisjs/core/bodyparser';

const bodyParserConfig = defineConfig({
    /**
     * The bodyparser middleware will parse the request body
     * for the following HTTP methods.
     */
    allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

    /**
     * Config for the "application/x-www-form-urlencoded"
     * content-type parser
     */
    form: {
        convertEmptyStringsToNull: true,
        types: ['application/x-www-form-urlencoded'],
    },

    /**
     * Config for the JSON parser
     */
    json: {
        convertEmptyStringsToNull: true,
        types: [
            'application/json',
            'application/json-patch+json',
            'application/vnd.api+json',
            'application/csp-report',
        ],
    },

    /**
     * Config for the "multipart/form-data" content-type parser.
     * File uploads are handled by the multipart parser.
     */
    multipart: {
        /**
         * Enabling auto process allows bodyparser middleware to
         * move all uploaded files inside the tmp folder of your
         * operating system
         */
        autoProcess: true,
        convertEmptyStringsToNull: true,
        processManually: [],

        /**
         * Maximum limit of data to parse including all files
         * and fields
         */
        limit: '100mb',
        types: [
            'multipart/form-data',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
            'text/plain',
        ],
    },
});

export default bodyParserConfig;
