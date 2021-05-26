"use strict";
const getAdmin = (req, res) => {
    res.json({
        ok: true,
        admin: []
    });
};
module.exports = {
    getAdmin,
};
