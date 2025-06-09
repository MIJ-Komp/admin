import axios from "axios";
import constant from "../constant/constant";
import helper from "../constant/helper";
// import showToast from "../components/toast";

var processing = []
const cache = new Map();
// Membuat instance Axios
// // console.log('API Base URL:', import.meta);
// // console.log('API Base URL:', process.env);

const apiClient = axios.create({
   baseURL: constant.apiURL, // Ganti dengan URL API Anda
   timeout: 60000, // Waktu tunggu (optional)
});


// Menambahkan interceptor untuk menambahkan header
apiClient.interceptors.request.use(
   async (config) => {
      config.method = config.method ? config.method.toUpperCase() : "GET";
      config.metadata = { startTime: new Date() };

      const token = localStorage.getItem("authorization");
      const queryParams = new URLSearchParams();
      queryParams.append('isFromAdmin', true);

      config.params = {
         ...config.params,
         ...Object.fromEntries(queryParams.entries()),
      };

      if (token) {
         config.headers["Authorization"] = token; // Menambahkan token Bearer
      }

      const requestData = {
         url: config.url,
         headers: JSON.stringify(config.headers),
         data: JSON.stringify(config.data),
         params: JSON.stringify(config.params),
         method: config.method,
      };

      return config
      let existingRequest = processing.find((data) =>
         data.url === requestData.url &&
         data.data === requestData.data &&
         data.headers === requestData.headers &&
         data.params === requestData.params &&
         data.method === requestData.method
      );
      if(!existingRequest){
         let resolvePromise;

         const cancelTokenSource = axios.CancelToken.source(); 
         const requestPromise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
            cancelTokenSource.token.promise = reject;
         });

         // Tambahkan request baru ke dalam daftar processing
         processing.push({
            config,
            ...requestData,
            promise: requestPromise,
            resolve: resolvePromise,
            cancelTokenSource
         });
         config.cancelToken = cancelTokenSource.token;

         return config;
      }
      else{
         console.log("Menunggu request sebelumnya selesai:", existingRequest);
         try{
         const data = await existingRequest.promise
         console.log(data)
            return Promise.resolve(data)
         }
         catch(err){
            return Promise.reject(err)
         }
      }
   },
   (error) => {
      return Promise.reject(error);
   }
);

//set sesuai response backend
apiClient.interceptors.response.use(
   (response) => {
      // var return null

      // Proses respons jika berhasil
      if (response && response.data && response.data.code != 0) {
         if (response.data.msg) {
            return Promise.reject(response.data.msg);
         }
         else
            return Promise.reject(response.data);
      }
      else if (response.data && (response.data.data || response.data.code == 0)) {
         return response.data.data || response.data.msg;
      }
      else
         return response.data; // Mengembalikan data langsung

      
      // const requestIndex = processing.findIndex((data) =>
      //    data.url === response.config.url &&
      //    data.data === JSON.stringify(response.config.data) &&
      //    data.headers === JSON.stringify(response.config.headers) &&
      //    data.params === JSON.stringify(response.config.params) &&
      //    data.method === response.config.method
      // );

      // if (requestIndex !== -1 && returnData) {
      //    cache.set(getKey(processing[requestIndex]), returnData)
      //    processing[requestIndex].resolve(returnData);
      //    // processing.splice(requestIndex, 1); // Hapus dari processing
      // }

      return returnData;
   },
   (error) => {
      console.log(error)
      
      // var return null

      if (error.code === "ECONNABORTED") {
         return Promise.reject("Request timed out. Please try again later.");
      }
      
      // Tangani error di sini
      if (error.response) {
         if (error.response.status === 401 && !import.meta.env.VITE_IS_DEVELOPMENT) {
            window.location.href = "/login";
            localStorage.removeItem("authorization");
            localStorage.removeItem("user");
         }
      } else {
         console.log("Network error:", error);
      }
      // console.log(error);
      if (
         error.response &&
         error.response.data &&
         error.response.data.code != 0
      ) {
         if (error.response.data.data && Array.isArray(error.response.data.data) && error.response.data.data.length > 0) {
            const firstError = Object.keys(
               error.response.data.data[0].error
            )[0];
            const msg = error.response.data.data[0].error[firstError];
            return Promise.reject(msg);
         } else if (error.response.data.msg) {
            if(error.response.data.msg.name && error.response.data.msg?.original?.sqlMessage){
               return Promise.reject(`${error.response.data.msg.name}\n${error.response.data.msg?.original?.sqlMessage}`);
            }
            else
               return Promise.reject(error.response.data.msg);
         }
         else
            return Promise.reject(error.response.data);
      }
      else{
         return Promise.reject(error);
      }

      // const requestIndex = processing.findIndex((data) =>
      //    data.url === error.config?.url &&
      //    data.headers === JSON.stringify(error.config?.headers) &&
      //    data.data === JSON.stringify(error.config?.data) &&
      //    data.params === JSON.stringify(error.config?.params) &&
      //    data.method === error.config?.method
      // );

      // if (requestIndex !== -1) {
      //    cache.set(getKey(processing[requestIndex]), returnData)
      //    processing[requestIndex].resolve(returnData);
      //    // processing.splice(requestIndex, 1); // Hapus dari processing
      // }
   }
);

function getKey(request){
   return `${request.url}-${request.data}-${request.method}-${request.params}-${request.headers}`;
}

// Ekspor instance Axios
export default apiClient;
