module.exports = {
    bail: false,
    // testURL: 'http://localhost',
    rootDir: '../',
    modulePaths: ['<rootDir>/src/'],
    setupFiles: ['<rootDir>/configs/enzymeSetup.js'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/configs/__mocks__/fileMock.js',
        '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    testRegex: '.*\\.test\\.js$',
    collectCoverage: true,
    collectCoverageFrom: [
        // 'src/**/*.{js,jsx,ts,tsx}',
        'src/utils/*.{js,jsx,ts,tsx}',
        // '!src/index.js',
        // '!src/(api|components|containers|hocs|reducers|regions|selectors|utils)/index.js',
        // '!src/(actions|dicts|enums|links|styles|urls)/**'
    ],
    coverageDirectory: '__coverage__',
    coverageThreshold: {
        // global: {
        //     branches: 50,
        //     functions: 50,
        //     lines: 50,
        //     statements: 50
        // },
        // 'src/components/**/*.js': {
        //     branches: 10,
        //     statements: 10,
        //     functions: 10
        // },
        // 'src/(utils)/**/*.js': {
        //     branches: 100,
        //     statements: 100,
        //     functions: 100
        // }
        // './src/reducers/**/*.js': {
        //     statements: 90,
        // },
        // './src/api/very-important-module.js': {
        //     branches: 100,
        //     functions: 100,
        //     lines: 100,
        //     statements: 100
        // }
    },
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest',
    },
};
