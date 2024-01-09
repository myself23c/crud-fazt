import {descargador ,nuevosCapturados ,saveUrlsToFile } from "./twitter.js"
import {compresor,deleteFiles} from "./compresor.js"

export async function twitter(url, archiveName, numberScrolls){ 

    try {
const urlsCapturadas = await saveUrlsToFile(url, numberScrolls);
const urlsParseadas = await nuevosCapturados(urlsCapturadas);
console.log(urlsParseadas);
const descargar = await descargador(urlsParseadas,archiveName);
await new Promise((resolve) => setTimeout(resolve, 3000));
const comprimidor = await compresor(archiveName);
await await new Promise((resolve) => setTimeout(resolve, 60000));
await deleteFiles(archiveName)
}catch(e){console.log(e)}
}



//twitter("https://twitter.com/GyalJade", "wolf", 2)