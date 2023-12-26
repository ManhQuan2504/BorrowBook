import axios from "axios";

export const AxiosSchema = axios.create();
export const BASE_URL = 'http://localhost:5555/api/v1/';

export const getBooks = async ({ page, perPage }) => {
  try {
    // console.log('Page: ', page);
    const response = await AxiosSchema.get(BASE_URL + `book/get?page=${page}&perpage=${perPage}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDetailBook = async ({ idBook }) => {
  try {
    // console.log('Page: ', page);
    const response = await AxiosSchema.get(BASE_URL + `book/detail/${idBook}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBook = async ({ title, category, countInStock, publishYear, authorBook }) => {
  try {
    const response = await AxiosSchema.post(BASE_URL + `book/create`, {
      title,
      category,
      countInStock,
      publishYear,
      authorBook
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBook = async ({ id }) => {
  try {
    const response = await AxiosSchema.delete(BASE_URL + `book/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllBookSearch = async ( limit, page, type, key) => {
  console.log(type, key);
  return await AxiosSchema
    .get(BASE_URL + `book/get-all-book-search`, {
      
    
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

export const updateBook = async ({ id, title, category, countInStock, publishYear, authorBook }) => {
  try {
    const response = await AxiosSchema.put(BASE_URL + `book/update/${id}`, {
      title,
      category,
      countInStock,
      publishYear,
      authorBook
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const exportExcel = async (accessToken) => {
  try {
    const response = await AxiosSchema.get(BASE_URL + `book/export`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // Đặt kiểu dữ liệu trả về là arraybuffer
    });
    // console.log(response);
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'BookList.xlsx'); // Bạn có thể đặt tên file tùy ý ở đây
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};

// export const detailUserLogin = async (id, accessToken) => {
//   return await AxiosSchema
//     .get(`/user/get-detail-user/${id}`, {
//       headers: {
//         token: `Bearer ${accessToken}`,
//       },
//     })
//     .then((res) => res.data)
//     .catch((err) => err)
// }
// export const signupUser = async (data) => {
//   const res = await axios.post(`http://localhost:3001/api/user/sign-up`, data)
//   return res.data
// }



// export const deleteUser = async (id, access_token, data) => {
//   const res = await Axios.delete(`http://localhost:3001/api/user/delete-user/${id}`, data, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     }
//   },)
//   return res.data
// }

// export const getAllUser = async (access_token) => {
//   const res = await Axios.get(`http://localhost:3001/api/user/getAll`, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     }
//   },)
//   return res.data
// }

// // export const refreshToken = async () => {
// //     const res = await axios.post(`http://localhost:3001/api/user/refresh-token`, {
// //         withCredentials: true
// //     })
// //     return res.data
// // }

// export const refreshToken = async (refreshToken) => {
//   // console.log('refreshToken', refreshToken)
//   const res = await axios.post(`http://localhost:3001/api/user/refresh-token`, {}, {
//     headers: {
//       token: `Bearer ${refreshToken}`,
//     }
//   })
//   return res.data
// }

// export const logoutAccount = async (accessToken) => {
//   return await Axios
//     .post(
//       '/user/log-out',
//       {},
//       {
//         headers: {
//           token: `Bearer ${accessToken}`,
//         },
//       }
//     )
//     .then((res) => res.data)
//     .catch((err) => err)
// }

// export const updateUser = async (id, data, access_token) => {
//   const res = await Axios.put(`http://localhost:3001/api/user/update-user/${id}`, data, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     }
//   })
//   return res.data
// }

// export const deleteManyUser = async (data, access_token) => {
//   const res = await Axios.post(`http://localhost:3001/api/user/delete-many`, data, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     }
//   })
//   return res.data
// }