const express = require('express')
const app = express()
const redis = require('redis')
const senkoFolder = './senko';
const bonkFolder = './bonk';
const waifuFolder = './waifu';
const waifuSources = require('./sources/waifu.json')
const senkoSources = require('./sources/senko.json')
const { redis_url } = require('../config.json');
const fs = require('fs');
let senkoFileList = [];
let bonkFileList = [];
let waifuFileList = [];

const redisClient = redis.createClient(redis_url);

redisClient.on("error", function (error) {
  console.error(error);
});

app.get('/senko', async function (req, res) {
  let picNumber = Math.floor(Math.random() * 97)
  res.json({ path: `./backend/senko/${senkoFileList[picNumber]}`, image: `${senkoFileList[picNumber]}`, source: `${senkoSources[senkoFileList[picNumber]]}` })
});

app.get('/bonk', async function (req, res) {
  let picNumber = Math.floor(Math.random() * 19)
  res.json({ path: `./backend/bonk/${bonkFileList[picNumber]}`, image: `${bonkFileList[picNumber]}` })
});

app.get('/waifu', async function (req, res) {
  let picNumber = Math.floor(Math.random() * 112)
  res.json({ path: `./backend/waifu/${waifuFileList[picNumber]}`, image: `${waifuFileList[picNumber]}`, source: `${waifuSources[waifuFileList[picNumber]]}` })
});

app.get('/serversCount', async function (req, res) {
  redisClient.get("serversAmount", function (err, value) {
    let serverCount = value
    res.header("Access-Control-Allow-Origin", "*");
    res.json({ serversCount: serverCount })
  })

});

app.get('/lick', async function (req, res) {
  const imageArr = [
    `https://media1.tenor.com/images/5f73f2a7b302a3800b3613095f8a5c40/tenor.gif?itemid=10005495`,
    `https://media1.tenor.com/images/5c5828e51733c8ffe1c368f1395a03d0/tenor.gif?itemid=14231351`,
    `https://media1.tenor.com/images/dbc120cf518319ffe2aedf635ad2df93/tenor.gif?itemid=16600144`,
    `https://media1.tenor.com/images/1925e468ff1ac9efc2100a3d092c54ff/tenor.gif?itemid=4718221`,
    `https://media1.tenor.com/images/3cbd13d5bd4c0a541d85d1d427c49abd/tenor.gif?itemid=16465188`,
    `https://media1.tenor.com/images/7132e6f39a0e4ada4e33d71056bcde67/tenor.gif?itemid=12858455`,
    `https://media1.tenor.com/images/17dab70fbd9d82b0140407b304517d5f/tenor.gif?itemid=16342211`,
    `https://media1.tenor.com/images/470177a6970bb705188d17ab939b4ba0/tenor.gif?itemid=16926055`,
    `https://media1.tenor.com/images/d00e0a35719ff4f47425583f0158fecc/tenor.gif?itemid=17503762`
  ]

  let picNumber = Math.floor(Math.random() * 9)
  res.json({ link: `${imageArr[picNumber]}` })
});

app.get('/bite', async function (req, res) {
  const imageArr = [
    `https://media1.tenor.com/images/128c1cfb7f4e6ea4a4dce9b487648143/tenor.gif?itemid=12051598`,
    `https://media1.tenor.com/images/1169d1ab96669e13062c1b23ce5b9b01/tenor.gif?itemid=9035033`,
    `https://media1.tenor.com/images/f308e2fe3f1b3a41754727f8629e5b56/tenor.gif?itemid=12390216`,
    `https://media1.tenor.com/images/418a2765b0bf54eb57bab3fde5d83a05/tenor.gif?itemid=12151511`,
    `https://media1.tenor.com/images/785facc91db815ae613926cddb899ed4/tenor.gif?itemid=17761094`,
    `https://media1.tenor.com/images/432a41a6beb3c05953c769686e8c4ce9/tenor.gif?itemid=4704665`,
    `https://media1.tenor.com/images/6b42070f19e228d7a4ed76d4b35672cd/tenor.gif?itemid=9051585`,
    `https://media1.tenor.com/images/a74770936aa6f1a766f9879b8bf1ec6b/tenor.gif?itemid=4676912`,
    `https://media1.tenor.com/images/ebc0cf14de0e77473a3fc00e60a2a9d3/tenor.gif?itemid=11535890`,
    `https://media1.tenor.com/images/7b9575ccf2a5b33f97d0eaa053e1892c/tenor.gif?itemid=12180198`,
    `https://media1.tenor.com/images/34a08d324868d33358e0a465040f210e/tenor.gif?itemid=11961581`,
    `https://media1.tenor.com/images/fa7c4b34d47d795b2b764324e6ad53fa/tenor.gif?itemid=17444486`
  ]

  let picNumber = Math.floor(Math.random() * 12)
  res.json({ link: `${imageArr[picNumber]}` })
})

app.get('/fluff', async function (req, res) {
  const imageArr = [
    `https://media1.tenor.com/images/641c82c25278968b8c7019765642117d/tenor.gif?itemid=20999243`,
    `https://media1.tenor.com/images/7a024f4f3391f86be7f2d09bfbebbf35/tenor.gif?itemid=20999240`,
    `https://media1.tenor.com/images/010a7933835d915ca383d741c778ac88/tenor.gif?itemid=20999237`,
    `https://media1.tenor.com/images/1dc6c1467fdd2c2f17c58e36f62b61d9/tenor.gif?itemid=20999234`,
    `https://media1.tenor.com/images/003a88ad8c5d43b34f8490c28bf10dae/tenor.gif?itemid=20999232`,
    `https://media1.tenor.com/images/e2bb75681021339a2ffc96ad47da2c9c/tenor.gif?itemid=20999227`,
    `https://media1.tenor.com/images/c7205d518b68b7ef49fd1e8d2d4fe505/tenor.gif?itemid=20999230`,
    `https://media.tenor.com/images/a93c9e811afc06a2c7d79cbc3d68f09b/tenor.gif`
  ]

  let picNumber = Math.floor(Math.random() * 8)
  res.json({ link: `${imageArr[picNumber]}` })
});

fs.readdirSync(senkoFolder).forEach(file => {
  senkoFileList.push(file)
});

fs.readdirSync(bonkFolder).forEach(file => {
  bonkFileList.push(file)
});

fs.readdirSync(waifuFolder).forEach(file => {
  waifuFileList.push(file)
});

app.listen(3000)