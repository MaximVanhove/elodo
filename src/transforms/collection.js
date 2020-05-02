export default {
    test (response) {
        return Array.isArray(response.data);
    },

    resolve (response, model) {
        return model.$create(response.data);
    },
};
