import factory from '@adonisjs/lucid/factories';
import FederatedLogin from '#models/federated_login';
import crypto from 'node:crypto';

export const FederatedLoginFactory = factory
    .define(FederatedLogin, async ({ faker }) => {
        return {
            provider: 'google',
            providerId: crypto.randomUUID(),
            userId: faker.number.int({ min: 1, max: 10 }),
        };
    })
    .build();
