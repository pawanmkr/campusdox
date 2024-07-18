/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env';

export default await Env.create(new URL('../', import.meta.url), {
    NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    HOST: Env.schema.string({ format: 'host' }),
    LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

    /*
	|----------------------------------------------------------
	| Variables for configuring database connection
	|----------------------------------------------------------
	*/
    DB_HOST: Env.schema.string({ format: 'host' }),
    DB_PORT: Env.schema.number(),
    DB_USER: Env.schema.string(),
    DB_PASSWORD: Env.schema.string.optional(),
    DB_DATABASE: Env.schema.string(),

    /*
	|----------------------------------------------------------
	| Variables for configuring session package
	|----------------------------------------------------------
	*/
    SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

    /*
	|----------------------------------------------------------
	| Variables for configuring Cloudflare R2
	|----------------------------------------------------------
	*/
    CLOUDFLARE_BUCKET: Env.schema.string(),
    CLOUDFLARE_ACCOUNT_ID: Env.schema.string(),
    CLOUDFLARE_ACCESS_KEY_ID: Env.schema.string(),
    CLOUDFLARE_SECRET_ACCESS_KEY: Env.schema.string(),

    /*
    |----------------------------------------------------------
    | Variables for configuring Google OAuth
    |----------------------------------------------------------
    */
    GOOGLE_CLIENT_ID: Env.schema.string(),
    GOOGLE_CLIENT_SECRET: Env.schema.string(),
    GOOGLE_REDIRECT_URI: Env.schema.string(),

    /*
    |----------------------------------------------------------
    | Variables for frontend
    |----------------------------------------------------------
    */
    FRONTEND_URL: Env.schema.string(),
});
