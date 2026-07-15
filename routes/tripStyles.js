const createCrudRouter = require('../utils/crudRouter');
const TripStyle = require('../models/TripStyle');

module.exports = createCrudRouter(TripStyle, { slugLookup: true });
