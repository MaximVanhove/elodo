import Moxios from 'moxios';
import { Post } from '../models/post';
import { Comment } from '../models/comment';

describe('crud', () => {
    beforeEach(function () {
        Moxios.install();
    });

    afterEach(function () {
        Moxios.uninstall();
    });

    test('it can find a post by primary key', async () => {
        const url = 'posts/1';
        const response = {
            id: 1,
            title: 'Hello',
        };

        Moxios.stubRequest(/.*/, { response });

        const post = await Post.$find(1);

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(post).toBeInstanceOf(Post);
        expect(post.id).toEqual(response.id);
        expect(post.title).toEqual(response.title);
    });

    test('it can show a post', async () => {
        const url = 'posts/1';
        const response = {
            id: 1,
            title: 'Hello Updated',
        };

        Moxios.stubRequest(/.*/, { response });

        const post = Post.$create({ id: 1 });
        await post.$show();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(post).toBeInstanceOf(Post);
        expect(post.id).toEqual(response.id);
        expect(post.title).toEqual(response.title);
    });

    test('it can save a new post', async () => {
        const url = 'posts';
        const response = {
            id: 1,
            title: 'Hello',
        };

        Moxios.stubRequest(/.*/, { response });

        const post = Post.$create({ title: 'Hello' });
        await post.$store();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.data).toEqual("{\"id\":null,\"title\":\"Hello\",\"thumbnail\":null}");
        expect(request.config.method).toEqual('post');
        expect(post.id).toEqual(response.id);
        expect(post.title).toEqual(response.title);
    });

    test('it can update a new post', async () => {
        const url = 'posts/1';
        const response = {
            id: 1,
            title: 'Hello',
        };

        Moxios.stubRequest(/.*/, { response });

        const post = Post.$create({ id: 1, title: 'Hello' });
        await post.$update();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.data).toEqual("{\"id\":1,\"title\":\"Hello\",\"thumbnail\":null}");
        expect(request.config.method).toEqual('put');
        expect(post.id).toEqual(response.id);
        expect(post.title).toEqual(response.title);
    });

    test('it can delete a post', async () => {
        const url = 'posts/1';
        const response = {
            id: 1,
            title: 'Hello',
        };

        Moxios.stubRequest(/.*/, { response });

        const post = Post.$create({ id: 1, title: 'Hello' });
        await post.$destroy();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.method).toEqual('delete');
    });

    test('it can fetch a relationship', async () => {
        const url = 'posts/1/comments';
        const response = {
            id: 1,
            body: 'Hello',
        };

        Moxios.stubRequest(/.*/, { response });

        const post = Post.$create({ id: 1 });
        const comment = Comment.$create({ body: 'Hello' });

        await comment.$parent(post).store();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.method).toEqual('post');
        expect(comment.id).toEqual(response.id);
        expect(comment.body).toEqual(response.body);
    });

    test('it can fetch a custom route', async () => {
        const url = 'posts/last';
        const response = {
            id: 1,
            body: 'Hello',
        };

        Moxios.stubRequest(/.*/, { response });

        const post = await Post.$route('posts.last').show();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.method).toEqual('get');
        expect(post.id).toEqual(response.id);
        expect(post.body).toEqual(response.body);
    });

    test('it can catch validation errors', () => {
        expect.assertions(1);

        const response = {
            messages: {
                title: ['The title field is required'],
            },
        };

        Moxios.stubRequest(/.*/, { status: 422, response });

        const post = Post.$create({
            id: '1',
        });

        const promise = post.$store();

        return expect(promise).rejects.toBeInstanceOf(Error);
    });
});
