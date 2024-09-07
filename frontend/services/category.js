import axios from "axios";

axios.defaults.withCredentials = true;

export const addCategory = async (formData) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/store/categories/add",

      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

export const getCategory = async ({ slug }) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/store/categories/${slug}`
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

export const editCategory = async ({ slug, formData }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/store/categories/edit/${slug}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

export const deleteCategory = async ({ id }) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8080/api/store/categories/delete/${id}`
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
