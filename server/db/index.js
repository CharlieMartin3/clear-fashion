require('dotenv').config();
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
//const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI = 'mongodb+srv://CharlieMartin:nat0897@cluster0.kk7vs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'; //sur mongoDB : connect

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }
    //console.log(MongoClient)
    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);





    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.log('erreur ici');

    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    
    const collection = db.collection(MONGODB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': error.result.nInserted
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async query => {
  try {
    const db = await getDB();
    //console.log(db);
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};



//useless function associated with limit to make search request
module.exports.sort = async (find_query, sort_query) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(find_query).sort(sort_query).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};


module.exports.limit = async (find_query, limit_query) => {
  try {
    const db = await getDB();
    
    const collection = db.collection(MONGODB_COLLECTION);
    
    const result = await collection.find(find_query).sort(limit_query).toArray();

    console.log(find_query)

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

// we going to use this function for search request :  
module.exports.aggregate = async query => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.aggregate(query).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};




/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};
