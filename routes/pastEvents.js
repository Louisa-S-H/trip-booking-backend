const createCrudRouter = require('../utils/crudRouter');
const PastEvent = require('../models/PastEvent');

module.exports = createCrudRouter(PastEvent);
