import { Cast } from './cast';
import { request } from './request';

export const createResource = function (options) {
    const {
        client,
        router,
    } = options;

    return class {
        /**
         * Construct model
         */
        constructor (attributes = {}) {
            Object.assign(this, this._attributes);
            this.$fill(attributes);
        }

        /**
         * Default client
         */
        get _client () {
            return client;
        }

        /**
         * Default attributes
         */
        get _attributes () {
            throw new Error('The attributes are not defined');
        }

        /**
         * Default route
         */
        get _route () {
            throw new Error('The route is not defined');
        }

        /**
         * Default primary key
         */
        get _primaryKey () {
            return 'id';
        }

        /**
         * Primary key value
         */
        get _primaryValue () {
            return this[this._primaryKey];
        }

        /**
         * Get relationships
         */
        get _relationships () {
            return {};
        }

        /**
         * Get response casts
         */
        get _casts () {
            return {};
        }

        /**
         * Get router
         */
        get _router () {
            return router;
        }

        /**
         * Get content type
         */
        get _contentType () {
            return 'json';
        }

        /**
         * Create a new model
         */
        static $create (attributesOrCollection) {
            if (Array.isArray(attributesOrCollection)) {
                return attributesOrCollection.map(data => {
                    return new this(data);
                });
            }

            return new this(attributesOrCollection);
        }

        static $request () {
            return this.$create().$request(...arguments);
        }

        static $route () {
            return this.$request().route(...arguments);
        }

        static $source () {
            return this.$request().source(...arguments);
        }

        static $index () {
            return this.$request().index(...arguments);
        }

        static $find () {
            return this.$request().find(...arguments);
        }

        $request () {
            return request(this);
        }

        $route () {
            return this.$request().route(...arguments);
        }

        $source () {
            return this.$request().source(...arguments);
        }

        $parents (...parents) {
            const route = [parents, this].flat().map((model) => model._route).join('.');

            return this.$route(route).parents(...parents);
        }

        $parent () {
            return this.$parents(...arguments);
        }

        $index () {
            return this.$request().index(...arguments);
        }

        $find () {
            return this.$request().find(...arguments);
        }

        $show () {
            return this.$request().show(...arguments);
        }

        $refresh () {
            return this.$show(...arguments);
        }

        $store () {
            return this.$request().store(...arguments);
        }

        $save () {
            return this.$store(...arguments);
        }

        $update () {
            return this.$request().update(...arguments);
        }

        $destroy () {
            return this.$request().destroy(...arguments);
        }

        $delete () {
            return this.$destroy(...arguments);
        }

        /**
         * Create a new model
         */
        $create (attributesOrCollection) {
            if (Array.isArray(attributesOrCollection)) {
                return attributesOrCollection.map(data => {
                    return new this.constructor(data);
                });
            }

            return new this.constructor(attributesOrCollection);
        }

        /**
         * Fill attributes
         */
        $fill (attributes) {
            Object.assign(this, attributes);

            const model = this;
            const casts = this._casts;
            for (const attribute in casts) {
                const cast = casts[attribute];
                Cast.cast(model, attribute, cast);
            }

            return this;
        }

        /**
         * Transform attributes to data
         */
        $data () {
            return Object.assign({}, this);
        }

        /**
         * Transform attributes to form data
         */
        $formdata () {
            const data = this.$data()
            const formdata = new FormData();

            for (const attribute in data) {
                formdata.append(attribute, data[attribute]);
            }

            return formdata;
        }
    }
};
