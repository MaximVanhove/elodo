import { Resource } from '../setup/resource';
import { Comment } from './comment';

/**
 * Cast resource
 *
 * @class Cast
 */
export class Cast extends Resource {
    get _attributes () {
        return {
            'id': null,
            'to_integer': null,
            'to_float': null,
            'to_boolean': null,
            'to_object': null,
            'to_date': null,
            'nested': {
                'to_integer': null,
            },
        };
    }

    get _casts () {
        return {
            'to_integer': 'int',
            'to_float': 'float',
            'to_boolean': 'boolean',
            'to_object': 'json.parse',
            'to_date': 'date',
            'to_comments': 'relationship:comments',
            'nested.to_integer': 'int',
        };
    }

    get _relationships () {
        return {
            comments: Comment,
        };
    }

    get _route () {
        return 'casts';
    }
}
