import Moxios from 'moxios';
import { Post } from '../models/post';

describe('post', () => {
    beforeEach(function () {
        Moxios.install();
    });

    afterEach(function () {
        Moxios.uninstall();
    });

    test('it can paginate a query', async () => {
        const url = 'posts?page[size]=15&page[number]=1';
        const method = 'get';
        const response = {
            "current_page": 1,
            "data": [
                {
                    "id": 1,
                    "title": "Soluta libero illo eligendi.",
                    "body": "Nesciunt a eum porro. Rem dolorem dolore unde similique molestias. Commodi est error quo quod.",
                },
                {
                    "id": 2,
                    "title": "Molestiae sit consequuntur neque dolores eum dolorum.",
                    "body": "Totam voluptatem dolor nam magnam et adipisci dolorem. Qui ad quo enim aperiam earum et ut. Vitae expedita aut qui error. Quia aut reprehenderit vel nesciunt.",
                },
            ],
            "from": 1,
            "last_page": 1,
            "next_page_url": null,
            "per_page": 15,
            "to": 5,
            "total": 5
        };

        Moxios.stubRequest(/.*/, { response });

        const pagination = await Post
            .$request()
            .page({
                size: 15,
                number: 1,
            })
            .index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
        expect(request.config.method).toEqual(method);
        expect(pagination.data[0]).toBeInstanceOf(Post);
    });

    test('it can paginate a query in laravel', async () => {
        const url = 'posts?page=1';
        const response = {
            "current_page": 1,
            "data": [
                {
                    "id": 1,
                    "title": "Soluta libero illo eligendi.",
                    "body": "Nesciunt a eum porro. Rem dolorem dolore unde similique molestias. Commodi est error quo quod.",
                },
                {
                    "id": 2,
                    "title": "Molestiae sit consequuntur neque dolores eum dolorum.",
                    "body": "Totam voluptatem dolor nam magnam et adipisci dolorem. Qui ad quo enim aperiam earum et ut. Vitae expedita aut qui error. Quia aut reprehenderit vel nesciunt.",
                },
            ],
            "from": 1,
            "last_page": 1,
            "next_page_url": null,
            "per_page": 15,
            "to": 5,
            "total": 5
        };

        Moxios.stubRequest(/.*/,  { response });

        await Post
            .$request()
            .page(1)
            .index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
    });

    test('it can limit a query', async () => {
        const url = 'posts?limit=15';

        Moxios.stubRequest(/.*/, {});

        await Post
            .$request()
            .limit(15)
            .index();

        const request = Moxios.requests.mostRecent();
        expect(request.url).toEqual(url);
    });
});
