const createCrudRouter = require('../utils/crudRouter');
const Destination = require('../models/Destination');

module.exports = createCrudRouter(Destination, { slugLookup: true });
