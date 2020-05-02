export default {
    test (response, model) {
        if (!response.data) {
            return false;
        }

        return response.data.hasOwnProperty(model._primaryKey);
    },

    resolve (response, model) {
        return model.$fill(response.data);
    },
};
