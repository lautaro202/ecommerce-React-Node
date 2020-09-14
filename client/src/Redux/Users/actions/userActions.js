import {
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DELETE_SUCCESS,
} from "../constantes/userConstants";
import axios from "axios";

const getUser = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });
    const { data } = await axios.get("http://localhost:3001/users/");
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_LIST_FAIL, payload: error.message });
  }
};

const getUserDetails = (userId) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const { data } = await axios.get(`http://localhost:3001/users/${userId}`);
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_DETAILS_FAIL, payload: error.message });
  }
};

const deleteUser = (userId) => async (dispatch) => {
  await axios
    .delete(`http://localhost:3001/users/${userId}`, {
      params: userId,
    })
    .then((res) => {
      return res;
    });
  dispatch({ type: USER_DELETE_SUCCESS, payload: userId });
};

const editUser = (user) => {
  axios
    .put(`http://localhost:3001/users/${user.id}`, {
      name: `${user.name}`,
      lastname: `${user.lastname}`,
      email: `${user.email}`,
      password: `${user.password}`,
      phone: `${user.phone}`,
      address: `${user.address}`,
    })
    .then((data) => {
      return data;
    });
  return (window.location = "http://localhost:3000");
};

export { getUser, getUserDetails, deleteUser, editUser };
