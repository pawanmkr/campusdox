import env from '#start/env';
import { Exception } from '@adonisjs/core/exceptions';
import axios from 'axios';
import { Credentials, OAuth2Client } from 'google-auth-library';

export default class GoogleOAuth {
    static getAuthUrl() {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

        const options = {
            redirect_uri: env.get('GOOGLE_REDIRECT_URI'),
            client_id: env.get('GOOGLE_CLIENT_ID'),
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ].join(' '),
        };

        const qs = new URLSearchParams(options);

        return `${rootUrl}?${qs.toString()}`;
    }

    async getRefreshToken(authorization_code: string) {
        const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

        const response = await axios.post(TOKEN_ENDPOINT, {
            code: authorization_code,
            client_id: env.get('GOOGLE_CLIENT_ID'),
            client_secret: env.get('GOOGLE_CLIENT_SECRET'),
            redirect_uri: env.get('GOOGLE_REDIRECT_URI'),
            grant_type: 'authorization_code',
        });

        return response.data;
    }

    async getProfile(idToken: string, accessToken: string) {
        const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
            {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );

        return res.data;
    }

    async getTokens(code: string): Promise<Credentials> {
        const oAuth2Client = new OAuth2Client(
            env.get('GOOGLE_CLIENT_ID'),
            env.get('GOOGLE_CLIENT_SECRET'),
            env.get('GOOGLE_REDIRECT_URI')
        );

        const { tokens } = await oAuth2Client.getToken(code);
        if (!tokens.id_token || !tokens.access_token || !tokens.refresh_token) {
            throw new Exception('Required tokens are missing');
        }

        return tokens;
    }
}
