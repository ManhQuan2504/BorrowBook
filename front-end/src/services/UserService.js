import axios from "axios"

export const axiosJWT = axios.create()
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

export const deleteUser = async (id, access_token, data) => {
  const res = await axiosJWT.delete(`http://localhost:3001/api/user/delete-user/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    }
  },)
  return res.data
}
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
// export const getAllUser1 = async (access_token) => {
//   const res = await axiosJWT.get(`http://localhost:3001/api/user/getAll`, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     }
//   },)
//   return res.data
// }

// export const refreshToken = async () => {
//     const res = await axios.post(`http://localhost:3001/api/user/refresh-token`, {
//         withCredentials: true
//     })
//     return res.data
// }

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

export const updateUser = async (id, data, access_token) => {
  const res = await axiosJWT.put(`http://localhost:3001/api/user/update-user/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    }
  })
  return res.data
}

export const deleteManyUser = async (data, access_token) => {
  const res = await axiosJWT.post(`http://localhost:3001/api/user/delete-many`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    }
  })
  return res.data
}