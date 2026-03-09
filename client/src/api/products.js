import http from "./http";

export const getProducts = async (params) => {
  const { data } = await http.get("/products", { params });
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await http.post("/products", payload);
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await http.put(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await http.delete(`/products/${id}`);
  return data;
};
