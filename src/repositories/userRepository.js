const User = require('../models/User');

module.exports = {
  create: (data) => User.create(data),

  findByEmail: (email, includePassword = false) => {
    const query = User.findOne({ email });
    return includePassword ? query.select('+senha') : query;
  },

  findById: (id) => User.findById(id)
};
