import Moxios from 'moxios';
import { Post } from '../models/post';
import { createSource, isCancel } from '../../src';

describe('post', () => {
    beforeEach(function () {
        Moxios.install();
    });

    afterEach(function () {
        Moxios.uninstall();
    });

    test('it can cancel request for queries', () => {
        expect.assertions(1);
        Moxios.stubRequest(/.*/, { status: 200 });

        const errorHandler = (error) => {
            expect(isCancel(error)).toEqual(true);
        }

        const source = createSource();
        const promise = Post.$source(source).$index().catch(errorHandler);
        source.cancel();

        return promise;
    });

    test('it can cancel request for crud actions', () => {
        expect.assertions(1);
        Moxios.stubRequest(/.*/, { status: 200 });

        const errorHandler = (error) => {
            expect(isCancel(error)).toEqual(true);
        }

        const post = Post.$create();
        const source = createSource();
        const promise = post.$source(source).$store().catch(errorHandler);
        source.cancel();

        return promise;
    });
});
