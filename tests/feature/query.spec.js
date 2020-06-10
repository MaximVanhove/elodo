import Moxios from 'moxios';
import { Post } from '../models/post';

describe('query', () => {
    beforeEach(function () {
        Moxios.install();
    });

    afterEach(function () {
        Moxios.uninstall();
    });

    test('it can query for all posts', async () => {
        const url = 'posts';
        const response = [
            { id: 1, title: 'Title' },
            { id: 2, title: 'Title two' },
        ];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post.$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.method).toEqual('get');

        expect(posts[0]).toBeInstanceOf(Post);
    });

    test('it can filter', async () => {
        const url = 'posts?filter[title]=Hello';
        const response = [{
            id: 1,
            title: 'Hello',
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$filter('title', 'Hello')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.method).toEqual('get');

        expect(posts[0]).toBeInstanceOf(Post);
    });

    test('it can filter with the where alias', async () => {
        const url = 'posts?filter[title]=Hello';
        const response = [{
            id: 1,
            title: 'Hello',
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$where('title', 'Hello')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.method).toEqual('get');

        expect(posts[0]).toBeInstanceOf(Post);
    });

    test('it can filter multiple', async () => {
        const url = 'posts?filter[id]=1&filter[title]=Hello';
        const response = [{
            id: 1,
            title: 'Hello',
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$filter({ id: 1, title: 'Hello' })
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.method).toEqual('get');

        expect(posts[0]).toBeInstanceOf(Post);
    });

    test('it can use a specific parameter', async () => {
        const url = 'posts?param=value';
        const response = [{
            id: 1,
            title: 'Hello',
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$param('param', 'value')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
        expect(posts[0]).toBeInstanceOf(Post);
    });

    test('it can use a multiple specific parameters', async () => {
        const url = 'posts?paramOne=valueOne&paramTwo=valueTwo';
        const response = [{
            id: 1,
            title: 'Hello',
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$param({ 'paramOne': 'valueOne', 'paramTwo': 'valueTwo' })
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
        expect(posts[0]).toBeInstanceOf(Post);
    });

    test('it can get posts with comments', async () => {
        const url = 'posts?include=comments';
        const response = [{
            id: 1,
            title: 'Hello',
            comments: [
                {
                    id: 2,
                    body: 'Nice',
                },
            ],
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$include('comments')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
    });

    test('it can get posts with comments and author', async () => {
        const url = 'posts?include=comments,author';
        const response = [{
            id: 1,
            title: 'Hello',
            author: {
                id: 3,
                name: 'Maxim',
            },
            comments: [
                {
                    id: 2,
                    body: 'Nice',
                },
            ],
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$include('comments', 'author')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
    });

    test('it can sort posts by name', async () => {
        const url = 'posts?sort=name';
        const response = [
            {
                id: 2,
                title: 'Alpha',
            },
            {
                id: 1,
                title: 'Beta',
            },
        ];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$sort('name')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
    });

    test('it can sort posts by name descending', async () => {
        const url = 'posts?sort=-name';
        const response = [
            {
                id: 1,
                title: 'Beta',
            },
            {
                id: 2,
                title: 'Alpha',
            },
        ];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$sortDesc('name')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
    });

    test('it can sort posts by name descending and id descending', async () => {
        const url = 'posts?sort=-name,-id';
        const response = [
            {
                id: 1,
                title: 'Beta',
            },
            {
                id: 2,
                title: 'Alpha',
            },
        ];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$sortDesc('name', 'id')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
    });

    test('it can sort posts by id ascending and name descending', async () => {
        const url = 'posts?sort=id,-name';
        const response = [
            {
                id: 1,
                title: 'Beta',
            },
            {
                id: 2,
                title: 'Alpha',
            },
        ];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$sort('id')
            .$sortDesc('name')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
    });

    test('it can select the fields of a post', async () => {
        const url = 'posts?fields[posts]=id,title';
        const response = [{
            id: 1,
            title: 'Hello',
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$fields({ 'posts': ['id', 'title'] })
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
    });

    test('it can append a field of a post', async () => {
        const url = 'posts?append=date';
        const response = [{
            id: 1,
            title: 'Hello',
            date: 'now',
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$append('date')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
    });

    test('it can append multiple fields of a post', async () => {
        const url = 'posts?append=title,date';
        const response = [{
            id: 1,
            title: 'Hello',
            date: 'now',
        }];

        Moxios.stubRequest(/.*/, { response });

        const posts = await Post
            .$request()
            .$append('title', 'date')
            .$index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(posts[0].id).toEqual(response[0].id);
        expect(posts[0].title).toEqual(response[0].title);
    });
});
