/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const adressebrand = require('./sources/adressebrand');

//https://www.montlimart.com/toute-la-collection.html
//https://www.dedicatedbrand.com/en/men/news
//https://adresse.paris/630-toute-la-collection
//'https://adresse.paris/630-toute-la-collection'

async function sandbox (eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    if(eshop === "https://adresse.paris/630-toute-la-collection"){
      const products = await adressebrand.scrape(eshop);
      console.log(products);
      console.log('done');
      process.exit(0);
    }
    else if(eshop === "https://www.dedicatedbrand.com/en/men/news"){
      const products = await dedicatedbrand.scrape(eshop);
      console.log(products);
      console.log('done');
      process.exit(0);
    }
    else{
      const products = await montlimartbrand.scrape(eshop);
      console.log(products);
      console.log('done');
      process.exit(0);
    }

    //const products = await dedicatedbrand.scrape(eshop);
    //const products = await montlimartbrand.scrape(eshop);
    

    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
