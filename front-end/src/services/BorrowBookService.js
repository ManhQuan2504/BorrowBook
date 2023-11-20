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