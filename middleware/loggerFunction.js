module.exports = function(req, res, next) {
    console.log('Time: ', Date.now());
    console.log(`Endpoint: ${req.url}, Method: ${req.method}, statusCode: ${res.statusCode}`);
    next();
  };

