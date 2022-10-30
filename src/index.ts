import axios from "axios";

const url:string = "https://www.formula1.com/en/results.html/2022/races.html";
const AxiosInstance = axios.create();

AxiosInstance.get(url)
.then( function (response) {
    const html = response.data;

    console.log(html);
    
})
