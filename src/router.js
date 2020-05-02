class Router {
    constructor (options = {}) {
        const routes = new Map();
        const prefix = options.prefix || '';

        this.set = function (name, callback) {
            const createUrl = function () {
                return prefix + callback(...arguments);
            }

            routes.set(name, createUrl);
        }

        this.get = function (name) {
            return routes.get(name);
        }

        this.entries = function () {
            return routes.entries();
        }
    }

    static create () {
        return new this(...arguments);
    }

    index (name, callback) {
        this.set(`${name}.index`, callback);
    }

    store (name, callback) {
        this.set(`${name}.store`, callback);
    }

    show (name, callback) {
        this.set(`${name}.show`, callback);
    }

    update (name, callback) {
        this.set(`${name}.update`, callback);
    }

    destroy (name, callback) {
        this.set(`${name}.destroy`, callback);
    }

    indexStore (name, callback) {
        this.index(name, callback);
        this.store(name, callback);
    }

    showUpdateDestroy (name, callback) {
        this.show(name, callback);
        this.update(name, callback);
        this.destroy(name, callback);
    }

    resource (resource) {
        function createRoutes (resource, models) {
            return resource
                .split('.')
                .reduce(function (routes, route, index) {
                    routes.push(route);
                    routes.push(models[index]._primaryValue);

                    return routes;
                }, [])
            ;
        }

        function indexCallback (...models) {
            const routes = createRoutes(resource, models);
            routes.pop();

            return routes.join('/');
        };

        function singleCallback (...models) {
            const routes = createRoutes(resource, models);

            return routes.join('/');
        };

        this.index(resource, indexCallback);
        this.store(resource, indexCallback);
        this.show(resource, singleCallback);
        this.update(resource, singleCallback);
        this.destroy(resource, singleCallback);
    }

    prefix (prefix, callback) {
        const router = new this.constructor({ prefix });

        callback(router);

        for (const entry of router.entries()) {
            this.set(...entry);
        }
    }

    route (name, ...models) {
        const route = this.get(name);

        if (!route) {
            throw new Error(`Route '${name}' is not registered`);
        }

        return route(...models);
    }
}

export {
    Router,
};
