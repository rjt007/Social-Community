
const paginatedResults = (model) => async(req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const total = await model.countDocuments().exec();
    const pages = Math.ceil(total/limit);

    const startIndex = (page - 1) * limit;
    //const endIndex = page * limit;

    try {
      const data = await model.find({},{_id: 0, __v: 0}).limit(limit).skip(startIndex).exec();
      const results = {
        status: true,
        content: {
            meta: {
                total: total,
                pages: pages,
                page: page
            }
        },
        data: data
    };
      res.results = results;
      next();
    }
    catch (err) {
      res.status(500).json({message: err.message});
    }
};

module.exports = paginatedResults;