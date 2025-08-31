import masterConstants from "../constants/masterConstants.js";
const endpointToActionMap = [
  {
    endpoint: masterConstants.API_ENDPOINTS.CREATE_USER,
    method: "POST",
    action: masterConstants.ACTION.CREATE_USER,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_ALL_USERS,
    method: "GET",
    action: masterConstants.ACTION.FETCH_ALL_USERS,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_USER,
    method: "GET",
    action: masterConstants.ACTION.FETCH_USER,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.UPDATE_USER,
    method: "PUT",
    action: masterConstants.ACTION.UPDATE_USER,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.DELETE_USER,
    method: "DELETE",
    action: masterConstants.ACTION.DELETE_USER,
  },

  {
    endpoint: masterConstants.API_ENDPOINTS.LOGIN,
    method: "POST",
    action: masterConstants.ACTION.LOGIN,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.REFRESH_TOKEN,
    method: "POST",
    action: masterConstants.ACTION.REFRESH_TOKEN,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.LOGOUT,
    method: "POST",
    action: masterConstants.ACTION.LOGOUT,
  },

  {
    endpoint: masterConstants.API_ENDPOINTS.CREATE_ROLE,
    method: "POST",
    action: masterConstants.ACTION.CREATE_ROLE,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_ALL_ROLES,
    method: "GET",
    action: masterConstants.ACTION.FETCH_ALL_ROLES,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_ROLE,
    method: "GET",
    action: masterConstants.ACTION.FETCH_ROLE,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.UPDATE_ROLE,
    method: "PUT",
    action: masterConstants.ACTION.UPDATE_ROLE,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.DELETE_ROLE,
    method: "DELETE",
    action: masterConstants.ACTION.DELETE_ROLE,
  },

  {
    endpoint: masterConstants.API_ENDPOINTS.CREATE_PERMISSION,
    method: "POST",
    action: masterConstants.ACTION.CREATE_PERMISSION,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_ALL_PERMISSIONS,
    method: "GET",
    action: masterConstants.ACTION.FETCH_ALL_PERMISSIONS,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_PERMISSION,
    method: "GET",
    action: masterConstants.ACTION.FETCH_PERMISSION,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.UPDATE_PERMISSION,
    method: "PUT",
    action: masterConstants.ACTION.UPDATE_PERMISSION,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.DELETE_PERMISSION,
    method: "DELETE",
    action: masterConstants.ACTION.DELETE_PERMISSION,
  },

  {
    endpoint: masterConstants.API_ENDPOINTS.CREATE_ROLE_PERMISSION,
    method: "POST",
    action: masterConstants.ACTION.CREATE_ROLE_PERMISSION,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_ALL_ROLE_PERMISSIONS,
    method: "GET",
    action: masterConstants.ACTION.FETCH_ALL_ROLE_PERMISSIONS,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_ROLE_PERMISSION,
    method: "GET",
    action: masterConstants.ACTION.FETCH_ROLE_PERMISSION,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.UPDATE_ROLE_PERMISSION,
    method: "PUT",
    action: masterConstants.ACTION.UPDATE_ROLE_PERMISSION,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.DELETE_ROLE_PERMISSION,
    method: "DELETE",
    action: masterConstants.ACTION.DELETE_ROLE_PERMISSION,
  },

  {
    endpoint: masterConstants.API_ENDPOINTS.CREATE_BLOG,
    method: "POST",
    action: masterConstants.ACTION.CREATE_BLOG,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_ALL_BLOGS,
    method: "GET",
    action: masterConstants.ACTION.FETCH_ALL_BLOGS,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.FETCH_BLOG,
    method: "GET",
    action: masterConstants.ACTION.FETCH_BLOG,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.UPDATE_BLOG,
    method: "PUT",
    action: masterConstants.ACTION.UPDATE_BLOG,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.DELETE_BLOG,
    method: "DELETE",
    action: masterConstants.ACTION.DELETE_BLOG,
  },

  {
    endpoint: masterConstants.API_ENDPOINTS.IMAGE_UPLOAD,
    method: "POST",
    action: masterConstants.ACTION.IMAGE_UPLOAD,
  },

  {
    endpoint: masterConstants.API_ENDPOINTS.TWO_FACTOR_AUTHENTICATION_SETUP,
    method: "POST",
    action: masterConstants.ACTION.TWO_FACTOR_AUTHENTICATION_SETUP,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.TWO_FACTOR_AUTHENTICATION_VERIFY,
    method: "POST",
    action: masterConstants.ACTION.TWO_FACTOR_AUTHENTICATION_VERIFY,
  },
  {
    endpoint: masterConstants.API_ENDPOINTS.TWO_FACTOR_AUTHENTICATION_DISABLE,
    method: "POST",
    action: masterConstants.ACTION.TWO_FACTOR_AUTHENTICATION_DISABLE,
  },
];

export default endpointToActionMap;
