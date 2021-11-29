var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    const data = {
        data: {
            msg: "To access API, registration and login is required for all requests."
        }
    };

    res.json(data);
});

module.exports = router;
