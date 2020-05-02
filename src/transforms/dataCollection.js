export default {
    test (response, repository) {
        if (!response.data) {
            return false;
        }

        if (!Array.isArray(response.data.data)) {
            return false;
        }

        return !response.data.hasOwnProperty(repository._primaryKey);
    },

    resolve (response, model) {
        const resource = response.data;

        resource.data = model.$create(resource.data);

        return resource;
    },
};
