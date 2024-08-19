const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const birds = require('./routes/birds');
const users = require('./routes/users');
const logger = require('./middleware/loggerFunction');
const assets = require('./routes/assets');

const app = express();

// Loading Global Middleware
app.use(logger);

// Loading Router modules with their Paths.
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/birds', birds);

app.use('/users', users);

app.use('/cardano/NFT', assets);

app.listen(3000, () => {
console.log("Server is running on port 3000");
});
