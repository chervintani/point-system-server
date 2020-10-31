let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = (req, res) => {
  Model.Establishment.findById(req.params.id, { promos: 1, offers: 1, logo: 1 })
    .populate({ path: "promos", match: { status: "Accepted" } })
    .populate({ path: "offers", match: { status: "Accepted" } })
    .exec((err, results) => {
      try {
        if (err) throw err;
        response = successResponse(
          200,
          results,
          `Retrieved ${req.params.id} promos and offers`
        );
        res.status(response.status).send(response);
      } catch (error) {
        response = errorResponse(500, error, "Service unavailable!");
        res.status(response.status).send(response);
      }
    });
};
