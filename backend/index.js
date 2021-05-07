const express = require('express')
const app = express()
const testFolder = './senko';
const fs = require('fs');

app.get('/senko', async function (req, res) {
  let fileList = []
  await fs.readdirSync(testFolder).forEach(file => {
      fileList.push(file)
  });
  let picNumber = Math.floor(Math.random() * 97)
  res.json({path: `./backend/senko/${fileList[picNumber]}`, image: `${fileList[picNumber]}`})
})
 
app.listen(3000)