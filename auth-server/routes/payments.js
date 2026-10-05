const express = require('express');
const router = express.Router();

router.post("/", async (req, res) => {
    try {

    } catch (err) {
        console.error("Payment route error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;