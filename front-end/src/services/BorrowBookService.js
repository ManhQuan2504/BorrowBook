import axios from "axios";

export const AxiosSchema = axios.create();
export const BASE_URL = 'http://localhost:1234/api/v1/';

export const getBorrowBooks = async ({ page, perPage }) => {
  try {
    const response = await AxiosSchema.get(BASE_URL + `borrowbook/get?page=${page}&perpage=${perPage}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchBorrowBookByDate = async ({ startDate, endDate, typeDate, page, perPage }) => {
  try {
    console.log("S: ", typeof startDate, "---", startDate);
    console.log("E: ", typeof endDate, "---", endDate);
    console.log("T: ", typeDate);
    const response = await AxiosSchema.get(
      BASE_URL + `borrowbook/searchbydate?startdate=${startDate}&enddate=${endDate}&typedate=${typeDate}&page=${page}&perpage=${perPage}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const aggregateByMonth = async ({ getBy, month, year }) => {
  try {
    console.log("G: ",getBy);
    const response = await AxiosSchema.get(
      BASE_URL + `borrowbook/aggregatebymonth?type=${getBy}&month=${month}&year=${year}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const aggregateByMonth1 = async ({ month, year }) => {
  try {
    console.log("M: ", typeof month, "---", month);
    console.log("Y: ", typeof year, "---", year);
    const response = await AxiosSchema.get(
      BASE_URL + `borrowbook/aggregatebymonth1?month=${month}&year=${year}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const aggregateByMonth2 = async ({ month, year }) => {
  try {
    console.log("M: ", typeof month, "---", month);
    console.log("Y: ", typeof year, "---", year);
    const response = await AxiosSchema.get(
      BASE_URL + `borrowbook/aggregatebymonth2?month=${month}&year=${year}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchBorrowBookByIdBookIdUser = async (keyWord) => {
  try {
    const response = await AxiosSchema.get(BASE_URL + `borrowbook/search-borrow-by-idBook-idUser?keyWord=${keyWord}`);
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