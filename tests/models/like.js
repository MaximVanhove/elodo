import { Resource } from '../setup/resource';

/**
 * Like resource
 *
 * @class Like
 */
export class Like extends Resource {
    get _attributes () {
        return {
            id: null,
            user: null,
        };
    }

    get _route () {
        return 'likes';
    }
}
