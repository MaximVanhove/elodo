import { Model } from './model';

/**
 * Like resource
 *
 * @class Like
 */
export class Like extends Model {
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
