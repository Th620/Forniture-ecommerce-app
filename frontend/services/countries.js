import axios from "axios";

axios.defaults.withCredentials = true;

export const getCountries = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/store/countries`
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

export const deleteCountry = async ({ id }) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8080/api/store/countries/delete/${id}`
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

export const editCountry = async ({ id, country }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/store/countries/edit/${id}`,
      { country }
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

export const addCountry = async ({ country }) => {
  try {
    const { data } = await axios.post(
      `http://localhost:8080/api/store/countries/add`,
      { country }
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

export const getCountry = async ({ id }) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/store/countries/${id}`
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

export const editState = async ({ id, state, shippingFees }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/store//countries/states/edit/${id}`,
      { state, shippingFees }
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

export const deleteState = async ({ id }) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8080/api/store/countries/states/delete/${id}`
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

export const addState = async ({ countryId, state, shippingFees }) => {
  try {
    const { data } = await axios.post(
      `http://localhost:8080/api/store/countries/${countryId}/add`,
      { state, shippingFees }
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
