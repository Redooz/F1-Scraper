import axios from "axios";
import cheerio from "cheerio";

const url:string = "https://www.formula1.com/en/results.html/2022/races.html";
const AxiosInstance = axios.create();

interface infoCarrera {
    prix: string;
    fecha: string;
    ganador: string;
    equipo: string;
    vueltas: number;
    tiempo: string;
}

AxiosInstance.get(url)
.then( function (response) {
    const html = response.data;
    const $ = cheerio.load(html);
    const resultadosCarreras = $(".resultsarchive-table > tbody > tr");
    const resultados: infoCarrera[] = [];

    resultadosCarreras.each(function (i, element) {
        const prix: string = $(element).find("td:nth-child(2) > a")
        .text()
        .replace(/(\r\n|\n|\r)/gm, "")
        .trim();

        let strFecha:string = "tr:nth-child(" + (i+1) + ") > td.dark.hide-for-mobile";
        const fecha: string = $(element).find(strFecha).text().trim();

        const nombreGanador: string = $(element).find("td:nth-child(4) > span.hide-for-tablet").text();
        const apellidoGanador: string = $(element).find("td:nth-child(4) > span.hide-for-mobile").text();
        const ganador: string = nombreGanador + " " + apellidoGanador;

        let strEquipo:string = "tr:nth-child(" + (i+1) +") > td.semi-bold.uppercase";
        const equipo: string = $(element).find(strEquipo).text();

        let strVueltas: string = "tr:nth-child(" + (i+1) + ") > td.bold.hide-for-mobile";
        const vueltas: number = parseInt($(element).find(strVueltas).text());

        let strTiempo: string = "tr:nth-child(" + (i+1) + ") > td.dark.bold.hide-for-tablet";
        const tiempo: string = $(element).find(strTiempo).text();

        resultados.push({
            prix,
            fecha,
            ganador,
            equipo,
            vueltas,
            tiempo
        })

    })

    console.log(resultados);
    
}).catch(console.error);

