import axios from "axios";

axios.defaults.withCredentials = true;

export const addMessage = async ({ content, name, email, phone }) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/custom-orders",
      {
        content,
        name,
        email,
        phone,
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

export const getMessages = async ({ d, page }) => {
  try {
    const { data, headers } = await axios.get(
      "http://localhost:8080/api/custom-orders",
      {
        params: { d, page },
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

export const approveCustomOrder = async ({ id, meetingDate }) => {
  try {
    console.log(meetingDate);

    const data = await axios.put(
      `http://localhost:8080/api/custom-orders/approve/${id}`,
      { meetingDate }
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

export const rejectCustomOrder = async ({ id }) => {
  try {
    const data = await axios.put(
      `http://localhost:8080/api/custom-orders/reject/${id}`
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

export const rescheduleCustomOrder = async ({ id, meetingDate }) => {
  try {
    const data = await axios.put(
      `http://localhost:8080/api/custom-orders/reschedule/${id}`,
      { meetingDate }
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

export const getMeetings = async ({ d }) => {
  try {
    const data = await axios.get(
      `http://localhost:8080/api/custom-orders/meetings`,
      { params: { d } }
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
