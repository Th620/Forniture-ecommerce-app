import axios from "axios";

axios.defaults.withCredentials = true;

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

export const logout = async () => {
  try {
    const { data } = await axios.post("http://localhost:8080/api/users/logout");

    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};

export const getProfile = async () => {
  try {
    const { data } = await axios.get("http://localhost:8080/api/users/profile");

    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(
        JSON.stringify({
          status: error.response.status,
          message: error.response.data.message,
        })
      );
    } else {
      throw new Error(
        JSON.stringify({
          message: "An unexpected error occured. Please try again",
        })
      );
    }
  }
};

export const updateProfile = async ({
  firstName,
  lastName,
  email,
  phone,
  country,
  state,
  city,
  adress,
}) => {
  try {
    const { data } = await axios.put(
      "http://localhost:8080/api/users/updateProfile",
      { firstName, lastName, email, phone, country, state, city, adress }
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

export const forgotPassword = async ({ email }) => {
  try {
    await axios.post("http://localhost:8080/api/users/forgot-password", {
      email,
    });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};

export const resetPassword = async ({ id, token, password }) => {
  try {
    await axios.post(
      `http://localhost:8080/api/users/reset-password/${id}/${token}`,
      {
        password,
      }
    );
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};

export const getUsers = async () => {
  try {
    const { data } = await axios.get("http://localhost:8080/api/users");

    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};

export const getAdmins = async () => {
  try {
    const { data } = await axios.get("http://localhost:8080/api/users", {
      params: { role: "admin" },
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

export const updateUserRole = async ({ id }) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/users/updateUser/${id}`
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

export const deleteUser = async ({ id }) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8080/api/users/delete/${id}`
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

export const getUser = async ({ id }) => {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/users/${id}`);

    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occured. Please try again");
    }
  }
};
