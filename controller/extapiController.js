var Request = require("request-promise");

exports.paymentFetch = (req, res) => {
  var options = {
    uri: "https://api.razorpay.com/v1/payments/" + req.params.id,
    headers: {
      authorization:
        "Basic cnpwX3Rlc3Rfa0hiVWVmN1diTVJJQ3M6dUF1UHRRRExBbXN3aEZHb0NDYklCdWZz"
    },
    json: true
  };
  Request(options).then(data => res.json(...data));
};

exports.refundFetch = (req, res) => {
  var options = {
    uri: "https://api.razorpay.com/v1/payments/" + req.params.id + "/refunds",
    headers: {
      authorization:
        "Basic cnpwX3Rlc3Rfa0hiVWVmN1diTVJJQ3M6dUF1UHRRRExBbXN3aEZHb0NDYklCdWZz"
    },
    json: true
  };
  Request(options).then(data => res.json(...data));
};
