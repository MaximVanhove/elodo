import Axios from 'axios';
import Moxios from 'moxios';
import { createResource } from '../../src';
import { router } from '../setup/router';

const client = Axios.create();
Moxios.install(client);

const Resource = createResource({
    client,
    router,
});

export {
    Resource,
};
