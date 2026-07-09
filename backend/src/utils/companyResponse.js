exports.success = (data, message = "Success") => {

    return {

        success: true,

        message,

        data

    };

};

exports.failure = (message) => {

    return {

        success: false,

        message

    };

};
