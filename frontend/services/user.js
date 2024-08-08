import axios from "axios";

export const register = async ({ email, password, firstName, lastName }) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/users/register",
      {
        firstName,
        lastName,
        email,
        password,
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

export const login = async ({ email, password }) => {
  try {
    const { data } = await axios.post("http://localhost:8080/api/users/login", {
      email,
      password,
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
