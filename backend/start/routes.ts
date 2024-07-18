/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

router.get('/', '#controllers/auth_controller.index');

router.group(() => {
    router.get('/signin', '#controllers/auth_controller.initiateSignin');
    router.get('/callback', '#controllers/auth_controller.callback');
    router.get('/check-session', '#controllers/auth_controller.checkSession');
    router.get('/logout', '#controllers/auth_controller.logout');
});

router
    .group(() => {
        router.get('/', '#controllers/documents_controller.index');
        router.post('/', '#controllers/documents_controller.store');
        router.get('/:id', '#controllers/documents_controller.show');
        router.get('/search', '#controllers/documents_controller.search');
        router.put('/:id', '#controllers/documents_controller.update');
        router.delete('/:id', '#controllers/documents_controller.destroy');
        router.patch('/:id', '#controllers/documents_controller.increaseDownloadCount');
    })
    .prefix('documents');
