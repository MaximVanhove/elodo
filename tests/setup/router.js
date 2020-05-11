import { createRouter } from '../../src';

const router = createRouter();

router.resource('casts');
router.resource('comments');
router.resource('likes');
router.resource('media');
router.resource('posts');
router.resource('posts.comments');
router.resource('posts.comments.likes');

router.show('posts.last', () => 'posts/last');
router.store('posts.sync', (post) => `posts/${post.id}/sync`);

router.prefix('http://api.com/api/v1/', function (router) {
    router.resource('authors');
});

export {
    router,
};
