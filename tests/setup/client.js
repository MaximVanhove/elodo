import Axios from 'axios';
import Moxios from 'moxios';

export const client = function () {
    const instance = Axios.create();
    Moxios.install(instance);

    return instance;
};
