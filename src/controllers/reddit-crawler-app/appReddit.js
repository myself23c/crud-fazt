

import {descargador,nuevosCapturados,saveUrlsToFile} from "./redditCrawler.js"
//require = require('esm')(module /*, options*/);
import { compresor } from './compresor.js'
import { deleteFiles } from "./eliminarArchivos.js"



/*

exports.appReddit = async function (url, archiveName, numberScrolls){
    const urlsCapturadas = await saveUrlsToFile(url, numberScrolls)

    const urlsParseadas = await nuevosCapturados(urlsCapturadas)

    console.log(urlsParseadas)

    const urlsDescargadas = await descargador(urlsParseadas,archiveName)

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const comprimidor = await compresor(archiveName);

    await await new Promise((resolve) => setTimeout(resolve, 60000));

    await deleteFiles(archiveName)
  
  }
  */

  



  
export async function appReddit(url, archiveName, numberScrolls){
  const urlsCapturadas = await saveUrlsToFile(url, numberScrolls)

  const urlsParseadas = await nuevosCapturados(urlsCapturadas)

  console.log(urlsParseadas)

  const urlsDescargadas = await descargador(urlsParseadas,archiveName)

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const comprimidor = await compresor(archiveName);

  await await new Promise((resolve) => setTimeout(resolve, 60000));

  await deleteFiles(archiveName)

}



//appReddit("https://www.reddit.com/r/2busty2hide/", "bustitohide", 500)