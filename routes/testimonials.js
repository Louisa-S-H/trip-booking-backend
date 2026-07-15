const createCrudRouter = require('../utils/crudRouter');
const Testimonial = require('../models/Testimonial');

module.exports = createCrudRouter(Testimonial);
