var Request = require("request-promise");

exports.paymentFetch = (req, res) => {
  var options = {
    uri: "https://api.razorpay.com/v1/payments/" + req.params.id,
    headers: {
      authorization:
        "Basic cnpwX3Rlc3Rfa0hiVWVmN1diTVJJQ3M6dUF1UHRRRExBbXN3aEZHb0NDYklCdWZz",
    },
    json: true,
  };
  Request(options).then((data) => res.json({ ...data }));
};

exports.paymentRefund = (req, res) => {
  var options = {
    method: "POST",
    uri: "https://api.razorpay.com/v1/payments/" + req.params.id + "/refund",
    headers: {
      authorization:
        "Basic cnpwX3Rlc3Rfa0hiVWVmN1diTVJJQ3M6dUF1UHRRRExBbXN3aEZHb0NDYklCdWZz",
    },
    json: true,
  };
  Request(options).then((data) => res.json({ ...data }));
};

exports.refundFetch = (req, res) => {
  var options = {
    uri: "https://api.razorpay.com/v1/payments/" + req.params.id + "/refunds",
    headers: {
      authorization:
        "Basic cnpwX3Rlc3Rfa0hiVWVmN1diTVJJQ3M6dUF1UHRRRExBbXN3aEZHb0NDYklCdWZz",
    },
    json: true,
  };
  Request(options).then((data) => res.json({ ...data }));
};

exports.ticketStatus = (req, res) => {
  var options = {
    uri:
      "https://api.razorpay.com/v1/invoices?type=link&payment_id=" +
      req.query.payment_id,
    headers: {
      authorization:
        "Basic cnpwX3Rlc3Rfa0hiVWVmN1diTVJJQ3M6dUF1UHRRRExBbXN3aEZHb0NDYklCdWZz",
    },
    json: true,
  };
  Request(options)
    .then((data) => res.json({ ...data }))
    .catch((data) => res.json({ ...data }));
};

exports.ticket_book_get = (req, res) => {
  var options = {
    uri: "https://api.razorpay.com/v1/invoices/" + req.params.id,
    headers: {
      authorization:
        "Basic cnpwX3Rlc3Rfa0hiVWVmN1diTVJJQ3M6dUF1UHRRRExBbXN3aEZHb0NDYklCdWZz",
    },
    json: true,
  };
  Request(options).then((data) => res.json({ ...data }));
};
exports.ticket_book_post = (req, res) => {
  var options = {
    method: "POST",
    uri: "https://api.razorpay.com/v1/invoices/",
    body: { ...req.body },
    headers: {
      authorization:
        "Basic cnpwX3Rlc3Rfa0hiVWVmN1diTVJJQ3M6dUF1UHRRRExBbXN3aEZHb0NDYklCdWZz",
    },
    json: true,
  };
  Request(options).then((data) => res.json({ ...data }));
};
