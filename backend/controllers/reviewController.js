const Review = require("../models/Review");

const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

const checkReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      const error = new Error("review not found");
      error.statusCode = 404;
      return next(error);
    }

    review.check = !review.check;

    await review.save();

    res.json({ message: "review checked" });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findOneAndDelete({ _id: id });

    if (!review) {
      const error = Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      message: "review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReviews, checkReview, deleteReview };
