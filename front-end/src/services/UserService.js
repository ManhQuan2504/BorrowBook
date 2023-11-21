import axios from "axios"


export const BASE_URL = 'http://localhost:3333/api'
export const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const signInAccount = async (email, password) =>
  await axios
    .post(
      BASE_URL + '/user/sign-in',
      {
        email,
        password,
      },
      { withCredentials: false }
    )
    .then((res) => res.data)
    .catch((err) => err)


export const detailUserLogin = async (id, accessToken) => {
  return await apiService
    .get(`/user/get-detail-user/${id}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => err)
}

export const signUpAccount = async (name, email, password, phone, address) =>
  await axios
    .post(BASE_URL + '/user/sign-up', {
      name,
      email,
      password,
      phone,
      address,
    })
    .then((res) => res.data)
    .catch((err) => err)


export const getAllUser = async (accessToken, limit, page) => {
  return await apiService
    .get(`/user/get-all-user`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
      params: {
        limit,
        page,
      },
    })
    .then((res) => res.data)
    .catch((err) => err);
};
export const getAllUserSearch = async (accessToken, limit, page,type,key) => {
  console.log(type, key);
  return await apiService
    .get(`/user/get-all-user-search`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
      params: {
        limit,
        page,
        type,
        key
      },
    })
    .then((res) => res.data)
    .catch((err) => err);
};


export const refreshToken = async (refreshToken) => {
  // console.log('refreshToken', refreshToken)
  const res = await axios.post(`http://localhost:3001/api/user/refresh-token`, {}, {
    headers: {
      token: `Bearer ${refreshToken}`,
    }
  })
  return res.data
}

export const logoutAccount = async (accessToken) => {
  return await apiService
    .post(
      '/user/log-out',
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => err)
}


