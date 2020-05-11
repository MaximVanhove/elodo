import CollectionTransform from './transforms/collection';
import DataCollectionTransform from './transforms/dataCollection';
import ModelTransform from './transforms/model';
import DataTransform from './transforms/data';

export const transformResponse = function (response, model) {
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

export const transformError = function (error) {
    return Promise.reject(error);
};
