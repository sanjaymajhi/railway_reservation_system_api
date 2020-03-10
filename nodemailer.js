var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "web.developer.sanjay.majhi@gmail.com",
    pass: "DeveloperSanjay@"
  }
});

var mailoption = {
  from: "web.developer.sanjay.majhi@gmail.com",
  to: user.email,
  subject: "Singup successful",
  text:
    "Welcome " +
    user.f_name +
    " , to Indian railways ticket booking website. \nHere, you can book tickets and check pnr. \nThanks from Sanjay Majhi"
};

transporter.sendMail(mailoption, (err, info) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Email sent : " + info.response);
  }
});
