import axios from "axios";

export const MyAxiosData=async()=>{
    const res=await axios({
        method: "get",
        url: "https://mtstech.online/php_api/register.php"
    })
    return res;
}