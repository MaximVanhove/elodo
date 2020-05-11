import Axios from 'axios';

export const createSource = () => {
    return Axios.CancelToken.source();
};

export const isCancel = (error) => {
    return Axios.isCancel(error);
};
