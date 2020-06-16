import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import Qs from 'qs';

const stringify = function () { return Qs.stringify(...arguments) };

export {
    get,
    has,
    set,
    stringify,
};
