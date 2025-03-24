const validateBooking = (req, res, next) => {
  const { eventType, eventDate, expectedCrowd, salonServices } = req.body;

  if (!eventType) {
    console.error("Validation Error: Event type is required");
    return res.status(400).json({ error: "Event type is required" });
  }
  if (!eventDate) {
    console.error("Validation Error: Event date is required");
    return res.status(400).json({ error: "Event date is required" });
  }
  if (!expectedCrowd) {
    console.error("Validation Error: Expected crowd size is required");
    return res.status(400).json({ error: "Expected crowd size is required" });
  }
  if (!salonServices || salonServices.length === 0) {
    console.error("Validation Error: At least one salon service must be selected");
    return res.status(400).json({ error: "At least one salon service must be selected" });
  }

  next();
};

module.exports = validateBooking;
