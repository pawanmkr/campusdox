import factory from '@adonisjs/lucid/factories';
import User from '#models/user';

export const UserFactory = factory
    .define(User, async ({ faker }) => {
        return {
            avatar: faker.internet.url(),
            username: faker.internet.userName(),
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            isFederatedUser: true,
        };
    })
    .build();
