import Axios from 'axios';
import { Resource } from '../../src';
import { router } from '../setup/router';

/**
 * Base model
 * @class Model
 */
class Model extends Resource {
    get _client () {
        return Axios.create();
    }

    get _router () {
        return router;
    }
}

export {
    Model,
};
