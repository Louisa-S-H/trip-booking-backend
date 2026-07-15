const createCrudRouter = require('../utils/crudRouter');
const TeamMember = require('../models/TeamMember');

module.exports = createCrudRouter(TeamMember);
