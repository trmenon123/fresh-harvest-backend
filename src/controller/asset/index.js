const path = require('path');
const fs = require('fs');

const { uploadFile} = require('../../middleware');

const uploadController = async (req, res) => {
  console.log("Initiating upload process to server");
  uploadFile(req, res, function (err) {
    if (err){
        console.log(JSON.stringify(err));
        res.status(200)
        .json({
          success: false, 
          message: "api failed", 
          fileName: ""
        });
    } else {
        console.log('The filename is ' + res.req.file.filename);
        res.status(200)
        .json({
          success: true, 
          message: "File Uploaded to server", 
          fileName: res.req.file.filename
        });  
    }
  });
};

// Getting Stock Media
const getStockMediaController = (req, res)=> {
  try {
    const file = req.params.file;
    const fileLocation = path.join(`${__basedir}/assets/`, file);
    res.sendFile(`${fileLocation}`);
  }catch(err) {
    console.log(err);
    res.status(200)
    .json({
      success: false, 
      message: "api failed", 
      asset: {}
    });
  }
}

module.exports = {
  uploadController,
  getStockMediaController,
}
