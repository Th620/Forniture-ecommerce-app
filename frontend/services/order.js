import axios from "axios";

axios.defaults.withCredentials = true;

export const getOrders = async ({
  country = "",
  status = "",
  page,
  period,
}) => {
  try {
    const { data, headers } = await axios.get(
      "http://localhost:8080/api/orders",
      {
        params: { country, status, page, period },
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

export const getOrder = async ({ id }) => {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/orders/${id}`);

    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};

export const confirmOrder = async ({ id }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/orders/confirm/${id}`
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

export const cancelOrder = async ({ id }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/orders/cancel/${id}`
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

export const deliverOrder = async ({ id }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/orders/delivery/${id}`
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

export const productSoldAndProfits = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/orders/products`
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
