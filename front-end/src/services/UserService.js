import axios from "axios"


export const BASE_URL = 'api/v1/' 
export const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const signInAccount = async (email, password) =>
  await axios
    .post(
      BASE_URL + 'user/sign-in',
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
    .get(`user/get-detail-user/${id}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => err)
}

export const updatePassword1 = async (access_token, newPassword, confirmNewPassword) => {
  try {

    const { data } = await axios.put(
      BASE_URL + `user/updatePassword`,
      {
        newPassword
        , confirmNewPassword
      },
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    )
    console.log('data', data)
    return data
  } catch (error) {
    console.log(error)
  }
}

export const updatePassword = async (access_token, newPassword, confirmNewPassword, customHeaders = {}) =>
  await axios
    .put(
      BASE_URL + 'user/updatePassword',
      {
        newPassword,
        confirmNewPassword,
      },
      {
        headers: {
          token: `Bearer ${access_token}`,
          ...customHeaders, // Thêm custom headers nếu có
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => err)

export const updateUserInfo = async (access_token, id, dataEdit) => {
  try {
    console.log('dataEdit', dataEdit)
    const { data } = await axios.put(
      BASE_URL + `user/update-user/${id}`,
      {
        dataEdit
      },
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    )
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}

export const deleteUser = async (access_token, id) => {
  try {

    const { data } = await axios.delete(
      BASE_URL + `user/delete-user/${id}`,

      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    )
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}
// In UserService.js
export const deleteManyUser = async (access_token, userIds) => {
  try {
    const res = await axios.delete(
      BASE_URL + `user/delete-many-user`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
        params: {
          ids: userIds.join(','), // Convert array of IDs to comma-separated string
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error deleting multiple users", error);
    throw error;
  }
};

export const signUpAccount = async (name, email, password, phone, address, language) =>
  await axios
    .post(BASE_URL + 'user/sign-up', {
      name,
      email,
      password,
      phone,
      address,
      language
    })
    .then((res) => res.data)
    .catch((err) => err)


export const getAllUser = async (accessToken, limit, page) => {
  return await apiService
    .get(`user/get-all-user`, {
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

export const getDetailUser = async ({ accessToken, idUser }) => {
  console.log();
  return await apiService
    .get(`user/get-detail-user/${idUser}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => err);
};

export const getAllUserSearch = async (accessToken, limit, page, type, key) => {
  console.log(type, key);
  return await apiService
    .get(`user/get-all-user-search`, {
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
  const res = await axios.post(`http://localhost:3001/apiuser/refresh-token`, {}, {
    headers: {
      token: `Bearer ${refreshToken}`,
    }
  })
  return res.data
}

export const logoutAccount = async (accessToken) => {
  return await apiService
    .post(
      'user/log-out',
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

export const exportExcel = async (accessToken) => {
  try {
    const response = await apiService.get(`user/export`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // Đặt kiểu dữ liệu trả về là arraybuffer
    });

    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'UserData.xlsx'); // Bạn có thể đặt tên file tùy ý ở đây
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};