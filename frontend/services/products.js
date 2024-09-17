import axios from "axios";

axios.defaults.withCredentials = true;

export const createProduct = async (formData) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/products/create",

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

export const getProducts = async ({
  category,
  sort,
  size,
  color,
  searchKeyword,
  page,
  pageSize = 16,
}) => {
  try {
    const { data, headers } = await axios.get(
      `http://localhost:8080/api/products`,
      {
        params: {
          color,
          size,
          searchKeyword,
          size,
          sort,
          category,
          page,
          pageSize,
        },
      }
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

export const getProduct = async ({ slug }) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/products/${slug}`
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

export const getBestSellers = async ({ category }) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/products/store/bestsellers`,
      { params: { category } }
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

export const editProduct = async ({ slug, formData }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/products/edit/${slug}`,
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

export const deleteProduct = async ({ id }) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8080/api/products/delete/${id}`
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

export const addReview = async ({ slug, content }) => {
  try {
    const { data } = await axios.post(
      `http://localhost:8080/api/products/${slug}/review`,
      { content }
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
