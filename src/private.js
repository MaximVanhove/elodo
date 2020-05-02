const usePrivateMap = function () {
    var map = new Map();

    const get = function (key, fallback) {
        if (!map.has(key)) {
            return fallback;
        }

        return map.get(key)
    };

    const tap = function (key, callback, fallback) {
        map.set(key, callback(get(key, fallback)));
    };

    const set = function () {
        return map.set(...arguments)
    };

    const has = function () {
        return map.has(...arguments);
    }

    return {
        get,
        set,
        has,
        tap,
    };
};

export {
    usePrivateMap,
};
