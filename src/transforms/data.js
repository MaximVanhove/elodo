export default {
    test (response, model) {
        return true;
    },

    resolve (response, model) {
        return response.data;
    },
};
