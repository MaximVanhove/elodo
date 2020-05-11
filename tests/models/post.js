import { Resource } from '../setup/resource';
import { Comment } from './comment';
import { Like } from './like';

/**
 * Post resource
 *
 * @class Post
 */
export class Post extends Resource {
    get _attributes () {
        return {
            id: null,
            title: null,
            thumbnail: null,
        };
    }

    get _casts () {
        return {
            'comments': 'relationship:comments',
        };
    }

    get _route () {
        return 'posts';
    }

    get _relationships () {
        return {
            comments: Comment,
            likes: Like,
        };
    }
}
