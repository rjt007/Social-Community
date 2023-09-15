const paginationRules = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const rules = {
        page: page,
        limit: limit,
        startIndex: startIndex
    };
    res.rules = rules;
    next();
};

module.exports = paginationRules;