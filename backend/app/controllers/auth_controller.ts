import Session from '#models/session';
import GoogleOAuth from '#services/google_oauth_service';
import user_service from '#services/user_service';
import env from '#start/env';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import jwt from 'jsonwebtoken';

export type Payload = {
    id: number;
    avatar: string;
    name: string;
};

export default class AuthController {
    async index() {
        return { status: 'healthy' };
    }

    async initiateSignin({ response }: HttpContext) {
        const url = GoogleOAuth.getAuthUrl();
        response.redirect(url);
    }

    @inject()
    async callback({ request, response, session }: HttpContext, gauth: GoogleOAuth) {
        const { code, state } = request.only(['code', 'state']);

        // Verify state to prevent CSRF attacks
        const savedState = session.get('oauth_state');
        if (state !== savedState) {
            throw new Error('Invalid state parameter');
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { id_token, access_token } = await gauth.getTokens(code);
        const profile = await gauth.getProfile(id_token as string, access_token as string);
        const user = await user_service.signin(profile, session.sessionId);

        // session.put('user_id', user.id);

        // response.cookie('session_id', session.sessionId, {
        //     httpOnly: true,
        //     secure: env.get('NODE_ENV') === 'production',
        //     sameSite: 'strict',
        // });

        const payload: Payload = {
            id: user.id,
            avatar: user.avatar,
            name: user.fullName,
        };
        const token = jwt.sign(payload, env.get('APP_KEY'));

        response.redirect(`${env.get('FRONTEND_URL')}?token=${token}`);
    }

    async checkSession({ session, response }: HttpContext) {
        console.log(session);
        console.log(session.get('user_id'));
        console.log(session.sessionId);
        const userId = session.get('user_id');
        if (!userId) return response.ok({ loggedIn: false });

        const res = await Session.findBy('user_id', userId);
        if (res) response.ok({ loggedIn: true });
        else response.ok({ loggedIn: false });
    }

    async logout({ session, response }: HttpContext) {
        session.forget('user_id');
        response.clearCookie('session_id');
        response.ok({ message: 'Logout successful' });
    }
}
