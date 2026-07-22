const createBaseRepository = (Model, populate = []) => ({
  create: (data) => Model.create(data),

  findAll: (filter = {}) => Model.find(filter).populate(populate),

  findById: (id) => Model.findById(id).populate(populate),

  updateById: (id, data) =>
    Model.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true
    }).populate(populate),

  deleteById: (id) => Model.findByIdAndDelete(id),

  countByIds: (ids) => Model.countDocuments({ _id: { $in: ids } }),

  count: (filter = {}) => Model.countDocuments(filter)
});

module.exports = createBaseRepository;
