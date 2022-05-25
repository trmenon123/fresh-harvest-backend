const multer = require('multer');
const uuid = require('uuid');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, callback)=> {
      callback(null, __basedir + "/assets/");
    },
    filename: (req, file, callback)=> {
        const sliceIndex = file.mimetype.indexOf('/') + 1;
        const newName = uuid.v4() + `.${file.mimetype.slice(sliceIndex)}`;
        callback(null, newName);
    }
  })


  
const uploadFile = multer({storage: fileStorageEngine}).single('file');

module.exports = {
  uploadFile
}