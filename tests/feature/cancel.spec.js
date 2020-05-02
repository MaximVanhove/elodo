import Moxios from 'moxios';
import { Post } from '../models/post';
import { getSource } from '../../src';

describe('post', () => {
    beforeEach(function () {
        Moxios.install();
    });

    afterEach(function () {
        Moxios.uninstall();
    });

    test('it can cancel request for queries', () => {
        Moxios.stubRequest(/.*/, { status: 200 });

        const source = getSource();

        const promise = Post.$request().source(source).store();
        source.cancel();

        return expect(promise).rejects.toMatchObject({
            isCancel: true,
        });
    });

    test('it can cancel request for crud actions', () => {
        Moxios.stubRequest(/.*/, { status: 200 });

        const source = getSource();
        const post = Post.$create();

        const promise = post.$request().source(source).store();
        source.cancel();

        return expect(promise).rejects.toMatchObject({
            isCancel: true,
        });
    });
});
