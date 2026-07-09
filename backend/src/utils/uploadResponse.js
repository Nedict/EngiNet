exports.success = (data) => {

    return {

        success: true,

        message: "Upload successful.",

        data

    };

};

exports.failure = (message) => {

    return {

        success: false,

        message

    };

};
