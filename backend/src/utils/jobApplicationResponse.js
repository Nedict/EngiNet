exports.success = (data, message = "Success") => ({

    success: true,

    message,

    data

});

exports.failure = (message) => ({

    success: false,

    message

});
