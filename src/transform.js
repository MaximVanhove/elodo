import Axios from 'axios';
import CollectionTransform from './transforms/collection';
import DataCollectionTransform from './transforms/dataCollection';
import ModelTransform from './transforms/model';
import DataTransform from './transforms/data';

const transformResponse = function (response, model) {
    const transforms = [
        DataCollectionTransform,
        CollectionTransform,
        ModelTransform,
    ];

    for (let index = 0; index < transforms.length; index++) {
        const transform = transforms[index];

        if (transform.test(response, model)) {
            return transform.resolve(response, model);
        }
    }

    return DataTransform.resolve(response, model);
};

const transformError = function (error) {
    error.isCancel = Axios.isCancel(error);

    return Promise.reject(error);
};

export {
    transformResponse,
    transformError,
};
