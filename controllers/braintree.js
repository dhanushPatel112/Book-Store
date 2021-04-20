const User = require("../models/user");
const braintree = require("braintree");
require("dotenv").config();

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "gngpzft8ch72f7tm",
    publicKey: "xdxts4sw7h99jbbp",
    privateKey: "66b88edcbbf9902620e635c015613b55"
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};
