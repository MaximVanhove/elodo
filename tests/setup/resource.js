import { createResource } from '../../src';
import { client } from '../setup/client';
import { router } from '../setup/router';

export const Resource = createResource({
    client,
    router,
});
