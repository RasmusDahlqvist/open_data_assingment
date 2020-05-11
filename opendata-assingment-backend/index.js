const express = require('express');
const cors = require('cors');
const DataStore = require('nedb');
const axios = require('axios');

const app = express();

//app.use(express.json());//

app.use(express.static('build'))



app.use(cors());



const database = new DataStore('database.db'); 
//const db = new DataStore('sensordata.db');
database.loadDatabase();

const acces_token = process.env.NODE_APP_ACCES_TOKEN;



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const getData = () => {
  console.log('called getData');
  axios.
  get('https://opendata.hopefully.works/api/events',
{ headers: 
{
 "Authorization" : `Bearer ${acces_token}`,
 }})
    .then(response =>  {
      const data = response.data;
      console.log(response.data);
       const timestamp = new Date();
    
        data.timestamp = timestamp.toString(); 
        database.insert(data);

     
   
  })
  .catch(function (error) {
    console.log(error);
  })
}
getData();

setInterval(() => {
  getData();
}, 1000 * 60 * 60);



app.get('/api', (request, response) => {
   database.find({}, (err, data) => {
     if(err)
     {
      response.end(); 
      return; 
     }
     response.json(data)
   })
})



