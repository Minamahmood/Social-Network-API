const router = require("express").Router();

const userRoutes = require("./user-routes");
const thoughtRoutes = require("./thoughts-routes");

router.use("/api/users", userRoutes);
router.use("/api/thoughts", thoughtRoutes);

module.exports = router;