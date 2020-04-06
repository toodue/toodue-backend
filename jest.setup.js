const mongoose = require('mongoose');

beforeAll(async (done) => {
  const clearDB = () => {
    const collections = mongoose.connection.collections;
    for (index in collections) {
      collections[index].deleteMany();
    }
    return done();
  };

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(`mongodb://localhost:27017/${process.env.TEST_SUITE}`, { 
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return clearDB();
  } else {
    return clearDB();
  }
});

afterAll(function(done) {
  mongoose.disconnect();
  return done();
});
