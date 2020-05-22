import { Cast } from '../models/cast';
import { Comment } from '../models/comment';

describe('cast', () => {
    test('it can transform response attributes', async () => {
        const response = {
            'to_integer': "1",
            'to_float': '1.1',
            'to_boolean': 0,
            'to_object': '{ "object": [1] }',
            'to_date': '2020-04-13T14:13:12.000000Z',
            'to_comments': [{ id: 2, body: 'Hello' }],
        };

        const cast = await Cast.$create(response);

        expect(cast.to_integer).toEqual(1);
        expect(cast.to_float).toEqual(1.1);
        expect(cast.to_boolean).toEqual(false);
        expect(cast.to_object).toEqual({ 'object': [1] });
        expect(cast.to_date).toBeInstanceOf(Date);
        expect(cast.to_comments[0]).toBeInstanceOf(Comment);
    });

    test('it can transform nested response attributes', async () => {
        const response = {
            nested: {
                to_integer: "1",
            },
        };

        const cast = await Cast.$create(response);

        expect(cast.nested.to_integer).toEqual(1);
    });

    test('it can with custom callback', async () => {
        const response = {
            to_callback: 'notcalled',
        };

        const cast = await Cast.$create(response);

        expect(cast.to_callback).toEqual('called');
    });
});
