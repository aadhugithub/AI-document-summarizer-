import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export const summarizeDocument = async (text = "", file = null) => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  } else if (text.trim()) {
    formData.append("text", text);
  } else {
    throw new Error("Please provide text or a PDF file");
  }

  const response = await axios.post(`${API_BASE}/summarize/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getSummaries = async () => {
  const response = await axios.get(`${API_BASE}/summaries/`);
  return response.data;
};

export const deleteSummary = async (id) => {
  await axios.delete(`${API_BASE}/summaries/${id}/`);
};