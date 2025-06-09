import constant from "./constant";

const GetLabel = () => {
   var language = localStorage.getItem("language");
   if (!language || !constant.Languages[language]) {
      language = constant.Languages.EN;
   }
   return constant.Label[language];
};
function IsEmpty(str) {
   if(!str) return true
   return !str.trim();
}

function UpperCaseFirstChar(string) {
   // console.log(string)
   if (!string) return ""; // Mengembalikan string kosong jika inputnya kosong
   return string.charAt(0).toUpperCase() + string.slice(1);
}
function GenerateRandomUUID(length = 36) {
   const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
   const uuidArray = [];

   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uuidArray.push(characters[randomIndex]);
   }

   return uuidArray.join("");
}
function ConvertNumberFormat(value) {
   if (!value) return '0';
 
   const numericValue = parseFloat(value);
 
   const fixedValue = numericValue.toFixed(2);
 
   const [integerPart, decimalPart] = fixedValue.split('.');
 
   const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
 
   return formattedInteger + ',' + decimalPart;
 }

export default {
   GetLabel,
   UpperCaseFirstChar,
   GenerateRandomUUID,
   ConvertNumberFormat,
   IsEmpty
};
