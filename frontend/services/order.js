import axios from "axios";

axios.defaults.withCredentials = true;

export const getOrders = async ({
  country = "",
  status = "",
  page,
  period,
  u,
  state,
}) => {
  try {
    const { data, headers } = await axios.get(
      "http://localhost:8080/api/orders",
      {
        params: { country, status, page, period, user: u, state },
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

export const getOrdersToShip = async ({ page, shippingDate }) => {
  try {
    const { data, headers } = await axios.get(
      "http://localhost:8080/api/orders/shipping/to-ship",
      {
        params: { shippingDate, page },
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

export const getUserOrders = async ({ status = "", page }) => {
  try {
    const { data, headers } = await axios.get(
      `http://localhost:8080/api/orders/user`,
      {
        params: { status, page },
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

export const deleteOrder = async ({ id }) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8080/api/orders/delete/${id}`
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

export const setShippingDate = async ({ id, shippingDate }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/orders/shippingDate/${id}`,
      { shippingDate }
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

export const getCartTotalPrice = async ({ items = [] }) => {
  try {
    const { data } = await axios.post(`http://localhost:8080/api/orders/cart`, {
      items,
    });

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
      `http://localhost:8080/api/orders/dashboard/info`
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

export const getEarnings = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/orders/dashboard/earnings`
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

export const newOrder = async ({ products, city, country, state, address }) => {
  try {
    const { data } = await axios.post(`http://localhost:8080/api/orders/new`, {
      products,
      city,
      country,
      state,
      address,
    });

    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};
