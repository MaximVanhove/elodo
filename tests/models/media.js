import { ContentTypes } from '../../src';
import { Model } from './model';

/**
 * Media resource
 *
 * @class Media
 */
export class Media extends Model {
    get _attributes () {
        return {
            id: null,
            file: null,
        };
    }

    get _route () {
        return 'media';
    }

    get _contentType () {
        return 'formdata';
    }
}
