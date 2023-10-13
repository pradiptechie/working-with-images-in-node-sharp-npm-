const sharp = require ('sharp');


// sharp('1.jpg')
// .resize( 200, 200)
// .toFile('out.jpg', (err,data)=>{
//     if(err){
//         console.log(err)
//     }else{
//         console.log("Resized succesfully");
//     }
// })

const path = require('path');
const multer = require('multer');
const express =  require('express');
const app = new express;

const bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extended:true}));


app.set("view engine", "hbs");


app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/img",(req,res)=>{
    res.render("index");
})


// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post('/upload', upload.single('image'), (req, res) => {
  //body-parser le body tag vitra ko elements lai direct access garn milx, likr: req.body.element-Name
  const hight = Number(req.body.hight);
  const width = Number(req.body.width);
  // console.log(hight);
  // console.log(width);

  // req.file contains the uploaded image as a buffer
  const imageBuffer = req.file.buffer;
  sharp(imageBuffer)
  .resize(width, hight)
  .toBuffer()
  .then((processedImage) => {
    const imageBase64 = processedImage.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${imageBase64}`;
    res.send(dataUrl);
  })
  .catch((err) => {
    res.status(500).send('Image processing error');
  });

});




app.listen((4500),()=>{
    console.log("server running on port 4500");
});