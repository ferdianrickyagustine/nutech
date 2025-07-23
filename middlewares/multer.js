const multer  = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split('/')
    if (fileType[0] === 'image' && fileType[1] === 'jpeg' || fileType[1] === 'png') {
        cb(null, true)
    }
    else {
        cb(new Error("Format Image tidak sesuai"), false)
    }
}
const upload = multer({ storage, fileFilter })

module.exports = upload