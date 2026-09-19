exports.ok = (res, status, message, data) => res.status(status).json({ success: true, message, data });
exports.fail = (res, status, message, code) => res.status(status).json({ success: false, message, error: { code } });
