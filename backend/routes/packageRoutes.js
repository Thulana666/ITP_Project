//packageRoutes.js
const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController'); // Ensure correct path

// Define routes
router.get('/', packageController.getPackages);
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);
router.post('/seed', packageController.seedPackages);

// New Route for Generating Report
router.post('/generate-report', packageController.generateReport);
module.exports = router;
