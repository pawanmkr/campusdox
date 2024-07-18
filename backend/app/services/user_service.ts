import User from '#models/user';
import { faker } from '@faker-js/faker';
import db from '@adonisjs/lucid/services/db';
import FederatedLogin from '#models/federated_login';
import logger from '@adonisjs/core/services/logger';
import { Exception } from '@adonisjs/core/exceptions';
import Session from '#models/session';
import { DateTime } from 'luxon';
import user_service from '#services/user_service';

type GoogleUserProfile = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
};

class UserService {
    async signin(profile: GoogleUserProfile, sessionId: string): Promise<User> {
        let user = await User.query()
            .preload('federatedLogin')
            .whereHas('federatedLogin', (query) => {
                query.where('providerId', profile.id);
            })
            .first();

        if (user) {
            await user_service.createNewSession(sessionId, user.id);
            return user;
        }

        const txn = await db.transaction();

        try {
            user = new User();
            user.username = faker.internet.userName();
            user.avatar = profile.picture;
            user.fullName = profile.name;
            user.email = profile.email;
            user.isFederatedUser = true;
            user.password = faker.internet.password();

            await user.useTransaction(txn).save();

            const fl = new FederatedLogin();
            fl.provider = 'google';
            fl.providerId = profile.id;
            fl.userId = user.id;
            await fl.useTransaction(txn).save();

            await txn.commit();

            // Reload the user with the federated login relationship
            await user.load('federatedLogin');

            await user_service.createNewSession(sessionId, user.id);

            return user;
        } catch (error) {
            txn.rollback();
            logger.error(error);
            throw new Exception(error.message);
        }
    }

    async createNewSession(sessionId: string, userId: number) {
        const ssn = new Session();
        ssn.sessionId = sessionId;
        ssn.userId = userId;
        ssn.lastLogin = DateTime.utc();
        ssn.save();
    }
}

export default new UserService();
