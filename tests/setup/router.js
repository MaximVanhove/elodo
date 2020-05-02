import { Router } from '../../src';

const router = Router.create();

router.resource('casts');
router.resource('comments');
router.resource('likes');
router.resource('media');
router.resource('posts');
router.resource('posts.comments');
router.resource('posts.comments.likes');

router.show('posts.last', () => 'posts/last');

router.prefix('http://api.com/api/v1/', function (router) {
    router.resource('authors');
});

export {
    router,
};
