import Qs from 'qs';
import { transformResponse, transformError } from './transform';
import { useBuilder } from './builder';
import { ContentTypes } from './contentTypes';

class RequestBuilder {
    constructor(model) {
        this.builder = useBuilder();

        this.builder.set('model', model);
        this.builder.set('route', model._route);
        this.builder.set('router', model._router);
        this.builder.set('client', model._client);
        this.builder.set('primaryKey', model._primaryKey);
        this.builder.set('headers.contentType', model._contentType);
        this.builder.set('parents', []);
        this.builder.set('params', {});

        return this;
    }

    static create () {
        return new this(...arguments);
    }

    route (route) {
        this.builder.set('route', route);

        return this;
    }

    parents (...parents) {
        this.builder.set('parents', parents);

        return this;
    }

    parent () {
        return this.parents(...arguments);
    }

    source (source) {
        this.builder.set('source', source);

        return this;
    }

    contentType (type) {
        this.builder.set('headers.contentType', type);

        return this;
    }

    param (name, value) {
        if (typeof name === 'object') {
            return this.params(...arguments);
        }

        this.builder.tap('params', function (params) {
            params[name] = value;
            return params;
        });

        return this;
    }

    params (params) {
        this.builder.tap('params', function (value) {
            return Object.assign(value, params);
        });

        return this;
    }

    filters (filters) {
        this.builder.tap('params', function (params) {
            params.filter = params.filter || {};
            params.filter = Object.assign({}, filters);
            return params;
        });

        return this;
    }

    filter (key, value) {
        if (typeof key === 'object') {
            return this.filters(key);
        }

        return this.filters({ [key]: value });
    }

    where () {
        return this.filter(...arguments);
    }

    include (...values) {
        this.builder.tap('params.include', (value) => {
            value.push(...values);
            return value;
        }, []);

        this.builder.tap('params', (value) => {
            value.include = this.builder.get('params.include').join(',');
            return value;
        });

        return this;
    }

    sort (...values) {
        this.builder.tap('params.sort', (value) => {
            value.push(...values);
            return value;
        }, []);

        this.builder.tap('params', (value) => {
            value.sort = this.builder.get('params.sort').join(',');
            return value;
        });

        return this;
    }

    orderBy () {
        return this.sort(...arguments);
    }

    sortDesc(...values) {
        const valuesDesc = values.map(function (value) {
            return '-' + value;
        });

        return this.sort(valuesDesc);
    }

    orderByDesc () {
        return this.sortDesc(...arguments);
    }

    fields (fields) {
        this.builder.tap('params.fields', (value) => {
            return Object.assign(value, fields);
        }, {});

        this.builder.tap('params', (params) => {
            params.fields = params.fields || {};

            const resources = this.builder.get('params.fields');
            for (const resource in resources) {
                params.fields[resource] = resources[resource].join(',');
            }

            return params;
        });

        return this;
    }

    append (...values) {
        this.builder.tap('params.append', (value) => {
            value.push(...values);
            return value;
        }, []);

        this.builder.tap('params', (value) => {
            value.append = this.builder.get('params.append').join(',');
            return value;
        });

        return this;
    }

    page (page) {
        this.builder.tap('params', function (params) {
            params.page = page;
            return params;
        });

        return this;
    }

    limit (limit) {
        this.builder.tap('params', function (params) {
            params.limit = limit;
            return params;
        });

        return this;
    }

    select () {
        return this.fields(...arguments);
    }

    find (id) {
        const key = this.getPrimaryKey();
        const attributes = { [key]: id };

        this.getModel().$fill(attributes);

        return this.show();
    }

    index () {
        const method = 'get';
        const url = this.getUrl('index');

        return this.request({
            method,
            url,
        });
    }

    show () {
        const method = 'get';
        const url = this.getUrl('show');

        return this.request({
            method,
            url,
        });
    }

    store () {
        const method = 'post';
        const data = this.getData();
        const url = this.getUrl('store');

        return this.request({
            method,
            data,
            url,
        });
    }

    update () {
        const method = 'put';
        const data = this.getData();
        const url = this.getUrl('update');

        return this.request({
            method,
            data,
            url,
        });
    }

    destroy () {
        const method = 'delete';
        const url = this.getUrl('destroy');

        return this.request({
            method,
            url,
        });
    }

    getConfig (options = {}) {
        const config = Object.assign(options, {
            headers: this.getHeaders(),
            params: this.getParams(),
            paramsSerializer: this.getParamsSerializer(),
        });

        if (this.builder.has('source')) {
            config.cancelToken = this.builder.get('source').token;
        }

        return config;
    }

    getHeaders () {
        return {
            'Accept': this.getHeadersAccept(),
            'Content-Type': this.getHeadersContentType(),
        };
    }

    getHeadersAccept () {
        return 'application/json, text/plain, */*';
    }

    getHeadersContentType () {
        const type = this.builder.get('headers.contentType');
        return ContentTypes[type] || ContentTypes.json;
    }

    getUrl (action) {
        const route = `${this.builder.get('route')}.${action}`;
        const models = [this.builder.get('parents'), this.builder.get('model')].flat();

        return this.getRouter().route(route, ...models);
    }

    getData () {
        return this.builder.get('headers.contentType') === 'formdata' ?
            this.getModel().$formdata():
            this.getModel().$data();
    }

    getModel () {
        return this.builder.get('model');
    }

    getRouter () {
        return this.builder.get('router');
    }

    getPrimaryKey () {
        return this.builder.get('primaryKey');
    }

    getClient () {
        return this.builder.get('client');
    }

    getParams () {
        return this.builder.get('params');
    }

    getParamsSerializer () {
        return function (params) {
            return Qs.stringify(params, {
                arrayFormat: 'brackets',
                encode: false,
            });
        };
    }

    request (options) {
        const model = this.getModel();
        const client = this.getClient();
        const config = this.getConfig(options);

        return client
            .request(config)
            .then(response => transformResponse(response, model))
            .catch(error => transformError(error, model));
    }
}

/**
 * Build resource request
 * @param {object} model
 */
export const request = function (model) {
    return new RequestBuilder(model);
};
