import playwright from 'playwright';
import rp from 'request-promise';
import { URL } from 'url';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs'; // Import fs module

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

sqlite3.verbose();

// Directory for the database
const dbDirectory = join(__dirname, '../files/db');

// Check if the db directory exists, if not, create it
if (!fs.existsSync(dbDirectory)){
    fs.mkdirSync(dbDirectory, { recursive: true });
}

// Initialize the database in the specified directory


export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export async function webCrawling(website, name) {

  const db = await new sqlite3.Database(join(dbDirectory, `${name}.db`));

   db.run("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, src TEXT UNIQUE, title TEXT)");
   db.run("CREATE TABLE IF NOT EXISTS media (id INTEGER PRIMARY KEY AUTOINCREMENT, href TEXT UNIQUE, type TEXT)");
   db.run("CREATE TABLE IF NOT EXISTS queue (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT UNIQUE, visited BOOLEAN)");




  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  const visited = new Set();
  const queue = [website];

  const websiteURL = new URL(website);
  const websiteHostname = websiteURL.hostname;

  let contador = 0;
  while (queue.length > 0) {
    console.log("Queue length: " + queue.length + " | Processing item #" + contador);
    contador++;
    const currentUrl = queue.shift();

    let alreadyVisited = false;
    db.get("SELECT visited FROM queue WHERE url = ?", [currentUrl], (err, row) => {
      if (row && row.visited) alreadyVisited = true;
    });

    if (alreadyVisited || visited.has(currentUrl)) continue;

    db.run("INSERT OR IGNORE INTO queue (url, visited) VALUES (?, ?)", [currentUrl, true]);
    visited.add(currentUrl);

    try {
      await Promise.race([
        page.goto(currentUrl, { waitUntil: 'domcontentloaded' }),
        new Promise(resolve => setTimeout(resolve, 8000)) // Wait for a maximum of 8 seconds
      ]);

      // Process images
      const imgInfo = await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, title: img.alt })));
      for (const { src, title } of imgInfo) {
        db.run("INSERT OR IGNORE INTO images (src, title) VALUES (?, ?)", [src, title]);
      }

      // Process media links
      const mediaLinks = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href)
        .filter(href => href.match(/\.(jpg|png|mp4|jpeg)$/i)));
      for (const href of mediaLinks) {
        const type = href.split('.').pop();
        db.run("INSERT OR IGNORE INTO media (href, type) VALUES (?, ?)", [href, type]);
      }

      // Process other links
      const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));
      links.forEach(link => {
        const linkHostname = new URL(link).hostname;
        if (linkHostname === websiteHostname && !visited.has(link)) {
          queue.push(link);
          db.run("INSERT OR IGNORE INTO queue (url, visited) VALUES (?, ?)", [link, false]);
        }
      });

    } catch (error) {
      console.error(`Failed to navigate to ${currentUrl} or extract information: ${error}`);
    }
  }

  await browser.close();
  console.log('Crawling finished');
  db.close();
}

//webCrawling('https://foro.laboutique.vip/',"foroloco");
