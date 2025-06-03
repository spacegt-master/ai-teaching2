import axios from "@/axios/index.js";

export function getResponse(content) {
  return axios({
    url: "https://qwen2llm.yigee.cn/get_response",
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      text: content,
    },
  });
}

export function speechText(blob) {
  const file = new File([blob], "audio.wav", {
    type: "audio/wav",
  });
  return axios({
    url: import.meta.env.VITE_APP_BASE_SERVER + "/speech-text",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file: file,
    },
  });
}
