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

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


app.set("view engine", "hbs");


app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/imgresizer",(req,res)=>{
    res.render("imgresizer");
})

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/imgresizer', upload.single('image'), (req, res) => {
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



app.get("/watermark",(req,res)=>{
  res.render("watermark");
})
// app.post('/watermark', upload.single('image'), (req,res)=>{
//   const watertext = req.body.watertext;
//   const fontsize = Number(req.body.fontsize);
//   // res.end("HI there");
//   // console.log(watertext);
//   // console.log(fontsize);
//   const imagebuffer = req.file.buffer;
//   // console.log(imagebuffer);

//   sharp(imagebuffer)
//         .composite([{ input: Buffer.from(watertext), top: 10, left: 10 }])
//         .jpeg()
//         .toBuffer()
//         // .toFile('out.jpg', (err,data)=>{
//         //       if(err){
//         //           console.log(err)
//         //       }else{
//         //           console.log("Resized succesfully");
//         //       }
//         //     })

//         .then((processedImage) => {
//           const imageBase64 = processedImage.toString('base64');
//           const dataUrl = `data:image/jpeg;base64,${imageBase64}`;
//           res.send(dataUrl);
//         })
//         .catch((err) => {
//           res.status(500).send('Image processing error');
//         });
// });

app.post('/watermark', upload.single('image'), async (req, res) => {
  try {
      // Get user input from the form
      const watermarkText = req.body.watermarkText;
      const fontSize = parseInt(req.body.fontSize);

      // Process the uploaded image
      const imageBuffer = req.file.buffer;
      const watermarkedImageBuffer = await addWatermark(imageBuffer, watermarkText, fontSize);

      // Send the watermarked image as a data URL
      const dataUrl = `data:image/jpeg;base64,${watermarkedImageBuffer.toString('base64')}`;

      // Render the watermark tool page with the watermarked image
      res.render('watermark', { watermarkedImage: dataUrl });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error processing image.');
  }
});

// Function to add a watermark to an image
async function addWatermark(imageBuffer, text, fontSize) {
  const image = sharp(imageBuffer);
  return await image
      .composite([{ input: Buffer.from(text), top: 10, left: 10 }])
      .jpeg()
      .toBuffer();
}

app.listen((4500),()=>{
    console.log("server running on port 4500");
});