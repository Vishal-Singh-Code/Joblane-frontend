export const setupAxiosInterceptors = (
  axiosInstance,
  showLoader,
  hideLoader
) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      // ✅ OPT-IN global loader
      if (config.showGlobalLoader === true) {
        showLoader();
      }
      return config;
    },
    (error) => {
      hideLoader();
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.config.showGlobalLoader === true) {
        hideLoader();
      }
      return response;
    },
    (error) => {
      hideLoader();
      return Promise.reject(error);
    }
  );
};
