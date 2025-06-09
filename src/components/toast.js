import { useToast } from "primevue/usetoast";
const createToast = (toast) => {
   return {
      success: (title, message, duration = 3000) => {
         toast.add({
            severity: "success",
            summary: title,
            detail: message,
            life: duration,
         });
      },
      info: (title, message, duration = 3000) => {
         toast.add({
            severity: "info",
            summary: title,
            detail: message,
            life: duration,
         });
      },
      warn: (title, message, duration = 3000) => {
         toast.add({
            severity: "warn",
            summary: title,
            detail: message,
            life: duration,
         });
      },
      error: (title, message, duration = 3000) => {
         // console.log(toast)
         toast.add({
            severity: "error",
            summary: title,
            detail: message,
            life: duration,
         });
      },
      secondary: (title, message, duration = 3000) => {
         toast.add({
            severity: "secondary",
            summary: title,
            detail: message,
            life: duration,
         });
      },
      contrast: (title, message, duration = 3000) => {
         toast.add({
            severity: "contrast",
            summary: title,
            detail: message,
            life: duration,
         });
      },
   };
};

export default createToast;
