export default class UsersController {
    async index() {
        return [
            {
                id: 1,
                username: 'virk',
            },
            {
                id: 2,
                username: 'romain',
            },
        ];
    }
}
