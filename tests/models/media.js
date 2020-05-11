import { Resource } from '../setup/resource';

/**
 * Media resource
 *
 * @class Media
 */
export class Media extends Resource {
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
