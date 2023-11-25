import axios from "axios";

export const AxiosSchema = axios.create();
export const BASE_URL = 'http://localhost:1234/api/';

export const getBorrowBooks = async (page) => {
  try {
    const response = await AxiosSchema.get(BASE_URL + `borrowbook/get?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBorrowBooks = async ({ idUser, email, idBook, borrowDate, dueDate, }) => {
  try {

    const response = await AxiosSchema.post(`${BASE_URL}borrowbook/create`, {
      idUser,
      email,
      idBook,
      borrowDate,
      dueDate
    });

    return response.data;

  } catch (error) {
    throw error.message || "There was an error processing your request.";
  }
};

export const updateBorrowBooks = async ({ id, returnDate, email, idBook }) => {
  try {
    const response = await AxiosSchema.put(`${BASE_URL}borrowbook/update/${id}`, {
      returnDate,
      email,
      idBook
    });

    return response.data;

  } catch (error) {
    throw error.message || "There was an error processing your request.";
  }
};

export const exportExcel = async (accessToken) => {
  try {
    const response = await AxiosSchema.get(BASE_URL + `borrowbook/export`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // Đặt kiểu dữ liệu trả về là arraybuffer
    });
    // console.log(response);
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
}