import Moxios from 'moxios';
import { Media } from '../models/media';

describe('media', () => {
    beforeEach(function () {
        Moxios.install();
    });

    afterEach(function () {
        Moxios.uninstall();
    });

    test('it can store a file', async () => {
        Moxios.stubRequest(/.*/, { status: 200 });

        const file = new Blob([''], {type: 'text/plain'});
        const media = Media.$create({ file });

        await media.$store();

        const request = Moxios.requests.mostRecent();
        expect(request.config.method).toEqual('post');
        expect(request.config.data).toBeInstanceOf(FormData);
        expect(request.config.data.has('file')).toBe(true);
        expect(request.headers['Content-Type']).toEqual('multipart/form-data');
    });
});
