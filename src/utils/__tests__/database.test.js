const databaseUtils = require('../database')

test('Builds database URI correctly', () => {
    const databaseURI = databaseUtils.buildURI('mongodb', 'localhost', '27017', 'test')
    expect(databaseURI == 'mongodb://localhost:27017/test')
});
