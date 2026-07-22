const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');

connectDatabase()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database', error);
    process.exit(1);
  });
