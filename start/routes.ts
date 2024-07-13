/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

router.get('/', '#controllers/users_controller.index');
router.get('/documents/search', '#controllers/documents_controller.search');
router.resource('documents', '#controllers/documents_controller').apiOnly();
