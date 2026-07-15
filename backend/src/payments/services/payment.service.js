const supabase = require("../../config/supabase");

const monnify = require("./monnify.service");

exports.initializePayment = async (req, res) => {

    try {

        const {

            product_id,

            amount,

            currency,

            customer_name,

            customer_email

        } = req.body;

        const paymentReference =
            `ENGI-${Date.now()}`;

        const response =
            await monnify.initializeTransaction({

                paymentReference,

                amount,

                currency,

                customerName: customer_name,

                customerEmail: customer_email,

                paymentDescription:
                    "EngiNet Marketplace Purchase",

                redirectUrl:
                    `${process.env.FRONTEND_URL}/payments/success`

            });

        await supabase

            .from("payments")

            .insert({

                buyer_id: req.user.id,

                product_id,

                provider: "monnify",

                provider_reference: paymentReference,

                amount,

                payment_status: "pending"

            });

        return res.json({

            success: true,

            checkout: response.data.responseBody.checkoutUrl

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.verifyPayment = async (req, res) => {

    try {

        const { reference } = req.params;

        const response =
            await monnify.verifyTransaction(reference);

        return res.json({

            success: true,

            transaction: response.data.responseBody

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.webhook = async (req, res) => {

    try {

        const payload = req.body;

        // TODO:
        // Verify webhook signature
        // Update payments table
        // Create order
        // Unlock purchased download

        console.log(payload);

        return res.sendStatus(200);

    } catch (err) {

        return res.sendStatus(500);

    }

};
