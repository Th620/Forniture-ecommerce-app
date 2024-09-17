import axios from "axios";

axios.defaults.withCredentials = true;

export const getProductReviews = async ({ slug, page }) => {
  try {
    const { data, headers } = await axios.get(
      `http://localhost:8080/api/products/${slug}/reviews`,
      { params: { page } }
    );

    return { data, headers };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};

export const checkReview = async ({ id }) => {
  try {
    const data = await axios.put(`http://localhost:8080/api/reviews/check/${id}`);

    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};

export const deleteReview = async ({ id }) => {
    try {
      const data = await axios.delete(`http://localhost:8080/api/reviews/delete/${id}`);
  
      return data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An unexpected error occured. Please try again");
      }
    }
  };
  