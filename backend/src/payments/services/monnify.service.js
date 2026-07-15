const axios = require("axios");

const BASE_URL = process.env.MONNIFY_BASE_URL;
const API_KEY = process.env.MONNIFY_API_KEY;
const SECRET_KEY = process.env.MONNIFY_SECRET_KEY;
const CONTRACT_CODE = process.env.MONNIFY_CONTRACT_CODE;

let accessToken = null;

async function authenticate() {

    const auth = Buffer
        .from(`${API_KEY}:${SECRET_KEY}`)
        .toString("base64");

    const response = await axios.post(

        `${BASE_URL}/api/v1/auth/login`,

        {},

        {

            headers: {

                Authorization: `Basic ${auth}`

            }

        }

    );

    accessToken = response.data.responseBody.accessToken;

    return accessToken;

}

async function getToken() {

    if (!accessToken) {

        await authenticate();

    }

    return accessToken;

}

exports.initializeTransaction = async (payload) => {

    const token = await getToken();

    return axios.post(

        `${BASE_URL}/api/v1/merchant/transactions/init-transaction`,

        {

            ...payload,

            contractCode: CONTRACT_CODE

        },

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

};

exports.verifyTransaction = async (reference) => {

    const token = await getToken();

    return axios.get(

        `${BASE_URL}/api/v2/merchant/transactions/query?paymentReference=${reference}`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

};
