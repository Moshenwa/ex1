const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/AppError')
const multer = require('multer')

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users')
  },
  filename: (req, file, cb) => {
    //15145415454-1235645478574874.jpg
    const ext = file.mimetype.split('/')[1];
    cb(null, `${req.user.id}-${Date.now()}.${ext}`)
  }
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image'))
    cb(null, true)
  else
    cb(new AppError(404, 'Can only upload image'), false)
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadUserPhoto = upload.single('photo')

const filterObj = (obj, ...allowedFields) => {
  //for (const key in obj)...
  const filteredObj = {}
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredObj[key] = obj[key]
    }
  })
  return filteredObj;
}
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  if (req.body.password || req.body.passwordConfirm) return next(new AppError(404, 'Cannot update password via this route'))
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log(filteredBody);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  })
  res.status(200).json({
    status: 'success',
    user: updatedUser
  })
})

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('cats');
    res.status(200).json({
      status: 'success',
      data: users
    })
  }
  catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message
    })
  }

}
exports.createUser = catchAsync(async (req, res) => {

  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newUser
  })

})