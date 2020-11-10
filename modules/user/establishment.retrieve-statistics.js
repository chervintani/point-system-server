let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let statsPoints = [];
    let statsSales = [];
    let pendingOffers = [];
    let pendingPromos = [];
    let establishment = await Model.Establishment.findById(req.params.id)
      .populate("promos")
      .populate("offers")
      .exec();

    establishment.offers.forEach((element) => {
        if(element.status=="Waiting"){
            pendingOffers.push(element);
        }
    });
    establishment.promos.forEach((element) => {
        if(element.status=="Waiting"){
            pendingPromos.push(element);
        }
    });
    console.log(pendingPromos);
    establishment.daily_scanners.forEach((object) => {
      // statsArray.push([object.statistics_date])
      let price = 0;
      let points = 0;
      object.employee.forEach((stats) => {
        price = price + stats.processed.price;
        points = points + stats.processed.points;
      });
      statsPoints.push([object.statistics_date, points]);
      statsSales.push([object.statistics_date, price]);
    });
    let totalSales = 0;
    let totalPoints = 0;
    statsPoints.forEach((element) => {
      totalPoints += element[1];
    });
    statsSales.forEach((element) => {
      totalSales += element[1];
    });
    let result = {
      points: statsPoints,
      sales: statsSales,
      total_points: totalPoints,
      total_sales: totalSales,
      pending_offers: pendingOffers,
      pending_promos: pendingPromos
    };

    console.log(result);
    response = successResponse(200, result, "Retrieve statistics successfully");
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable");
    res.status(response.status).send(response);
  }
};
