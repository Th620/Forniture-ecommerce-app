import axios from "axios";

axios.defaults.withCredentials = true;

export const getCategories = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:8080/api/store/categories"
    );

    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};
