const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);


//ENDPOINTS 2
// request contain limit (if not we put 10), brand and price
app.get('/products/search', async(request, response) => {
  
  var match = {};
  var queryArguments = [];
  
  const limit = parseInt(request.query.limit);
  const brand = request.query.brand;
  const price = parseInt(request.query.price);
  var sort = parseInt(request.query.sort);

  if (isNaN(sort)){ 
    sort = 1;
  }
  if (brand !== undefined){
    match["brand"] = brand;
  }
  if (isNaN(price)){
  }
  else{
  console.log("not different");
  match["price"] = {$lt:price};
  }
  if(isNaN(limit)){
    queryArguments.push({$match : match});
    queryArguments.push({ $sort: { price: sort } });
    result = await db.aggregate(queryArguments);
  }
  else{
    queryArguments.push({$match : match});
    queryArguments.push({$limit : limit});
    queryArguments.push({ $sort: { price: sort} });
    console.log("query : ", queryArguments);
    result = await db.aggregate(queryArguments);
  }
  console.log(result.length);
  response.send({"limit" : limit, "total" : result.length, "result" : result});
});

//ENDPOINTS 1 
//Search product by id
app.get('/products/:id', (request, response) => {

  product = db.find({'_id': request.params.id});
  product.then((value) => {
    response.send({'id' : request.params.id,
                 'product': value});
  })
  
});
