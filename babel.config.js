module.exports = function (api) {
    const production = {
        presets: [
            [
                '@babel/preset-env'
            ],
        ],
    };

    const test = {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        node: 'current',
                    },
                },
            ],
        ],
    };

    return api.env('test') ? test : production;
}
