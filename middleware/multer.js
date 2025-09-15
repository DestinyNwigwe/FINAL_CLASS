const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images');

    },

    filename:(res,file,cb) => {
        console.log("File",file)
        const uniquesuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
      const ext = file.mimetype.split('/')[1];
      cb(null, `IMG_${uniquesuffix}.${ext}`);
    }
});

const fileFilter = (req,file, cb)=>{
    if (file.mimetype.startsWith('image/')){
        cb(null, true)

    } else {
       throw new Error('Invalid fie format: Image only')
    }
} ;

const limits = {
    fileSize: 1024 
};


const uploads = multer({
  storage,
  fileFilter,
  limits
})

module.exports = uploads;