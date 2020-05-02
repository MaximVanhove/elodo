import Axios from 'axios';

const getSource = () => {
    const CancelToken = Axios.CancelToken;
    return CancelToken.source();
};

export {
    getSource,
};
