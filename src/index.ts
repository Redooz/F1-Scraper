import axios from "axios";
import cheerio from "cheerio";

const url:string = "https://www.formula1.com/en/results.html/2022/races.html";
const AxiosInstance = axios.create();
const mysql = require("mysql");

interface infoCarrera {
    prix: string;
    fecha: string;
    ganador: string;
    equipo: string;
    vueltas: number;
    tiempo: string;
}

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "f1"
})

try {
    scraping();
} catch (error) {
    console.error(error);
}

async function scraping() {
    const response = await AxiosInstance.get(url);
    
    const html = response.data;
    const $ = cheerio.load(html);
    const resultadosCarreras = $(".resultsarchive-table > tbody > tr");
    const resultados: infoCarrera[] = [];

    resultadosCarreras.each(function (i, element) {
        const prix: string = $(element).find("td:nth-child(2) > a")
        .text()
        .replace(/(\r\n|\n|\r)/gm, "")
        .trim();

        //Ya que se está haciendo uso de una tabla, pues toca ir recorriendo cada fila
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

    con.connect(function (err) {
        if (err) throw err;
        console.log("Conexion a la bd exitosa");

        resultados.forEach(function (resultado) {
            let sql: string = `INSERT INTO carreras (prix, fecha, ganador, equipo, vueltas, tiempo) VALUES
            ('${resultado.prix}', '${resultado.fecha}', '${resultado.ganador}', '${resultado.equipo}', ${resultado.vueltas}, '${resultado.tiempo}')`;

            con.query(sql, function (err, result) {
                if (err) throw err;
            })
        })
        con.end();
    })
    console.log(resultados);
}
