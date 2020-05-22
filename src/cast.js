import { get, has, set } from './utils';

export const Cast = {
    cast(model, attribute, cast) {
        if (!has(model, attribute)) {
            return model;
        }

        if (typeof cast === 'function') {
            const callback = cast;
            return this.transform(model, attribute, callback);
        }

        const [key, argument] = cast.split(':');

        if (!has(this, key)) {
            throw new Error(`Cast '${key}' does not exist`);
        }

        const value = get(model, attribute);
        const castedValue = this[key]({ key, value, argument, model });

        set(model, attribute, castedValue);

        return model;
    },

    transform (model, attribute, callback) {
        const value = get(model, attribute);
        const castedValue = callback(value);

        set(model, attribute, castedValue);

        return model;
    },

    'float' ({ value }) {
        return parseFloat(value);
    },

    'int' ({ value }) {
        return parseInt(value);
    },

    'integer' ({ value }) {
        return parseInt(value);
    },

    'number' ({ value }) {
        return Number(value);
    },

    'bigint' ({ value }) {
        return BigInt(value);
    },

    'bool' ({ value }) {
        return Boolean(value);
    },

    'boolean' ({ value }) {
        return Boolean(value);
    },

    'string' ({ value }) {
        return String(value);
    },

    'date' ({ value }) {
        return new Date(value);
    },

    'json' () {
        return this['json.stringify'](...arguments);
    },

    'json.parse' ({ value }) {
        if (typeof value !== 'string') {
            return value;
        }

        return JSON.parse(value);
    },

    'json.stringify' ({ value }) {
        return JSON.stringify(value);
    },

    'relationship' ({ value, argument, model }) {
        if (!model._relationships.hasOwnProperty(argument)) {
            throw new Error(`Relationship '${argument}' does not exist`);
        }

        const repository = model._relationships[argument];

        return repository.$create(value);
    },
};
