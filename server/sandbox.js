/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const adressebrand = require('./sources/adressebrand');

//https://www.montlimart.com/toute-la-collection.html
//https://www.dedicatedbrand.com/en/men/news
//https://adresse.paris/630-toute-la-collection

async function sandbox (eshop = 'https://adresse.paris/630-toute-la-collection') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    //const products = await dedicatedbrand.scrape(eshop);
    //const products = await montlimartbrand.scrape(eshop);
    const products = await adressebrand.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
