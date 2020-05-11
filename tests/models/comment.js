import { Resource } from '../setup/resource';
import { Like } from './like';

/**
 * Comment resource
 *
 * @class Comment
 */
export class Comment extends Resource {
    get _attributes () {
        return {
            id: null,
            body: null,
        };
    }

    get _route () {
        return 'comments';
    }

    get _relationships () {
        return {
            likes: Like,
        };
    }
}
