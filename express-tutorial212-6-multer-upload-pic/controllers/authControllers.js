const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto')
/// uti
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
}
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true
  }
  res.cookie('jwt', token, cookieOptions)
  user
  res.status(statusCode).json({
    status: 'success',
    user,
    token
  })

}

exports.signUp = catchAsync(async (req, res) => {
  const filteredBody = {};
  filteredBody.email = req.body.email;
  filteredBody.name = req.body.name;
  filteredBody.password = req.body.password;
  filteredBody.passwordConfirm = req.body.passwordConfirm;
  filteredBody.cats = req.body.cats;

  const newUser = await User.create(filteredBody);
  /*  const token = signToken(newUser._id);
   const token = await promisify(jwt.sign)({id:newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES}) 
   res.status(201).json({
       status:'success', 
       data: newUser,
       token
   })
 */
  createAndSendToken(newUser, 200, res);
})
exports.login = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !await user.checkPassword(req.body.password, user.password)) return next(new AppError(404, 'Email or password not valid'));
  /*  const token = signToken(user._id)

res.status(201).json({
    status:'success', 
    token
}) */
  createAndSendToken(user, 200, res);

})

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) return next(new AppError(403, 'Please login'))
  const token = req.headers.authorization.split(' ')[1];
  //console.log(token)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  console.log(decoded)
  if (!decoded) return next(new AppError(403, 'Please login '))
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError(403, 'Please login '))


  req.user = user;


  next();
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return next(new AppError(404, "We havent found user with this email"));
  const resetToken = user.createPasswordResetToken()

  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
  console.log(resetUrl);

  const message = `Please follow this link to reset your password. The link is valid for 10 min ${resetUrl}`
  try {
    await sendEmail({
      emailTo: user.email,
      subject: 'Password reset link',
      text: message
    })
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    })
  }
  catch (err) {
    //user.passwordResetToken = undefined;
    // user.passwordResetExpires = undefined;
    //await user.save({validateBeforeSave:false})
    return next(new AppError(500, 'There was a problem sending email'))

  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const passwordResetToken = crypto.createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne(
    {
      passwordResetToken: passwordResetToken,
      passwordResetExpires: { $gt: Date.now() }
    }
  );
  if (!user) return next(new AppError(400, 'Password reset link invalid or expired'))
  user.password = req.body.password,
    user.passwordConfirm = req.body.passwordConfirm,
    user.passwordResetToken = undefined,
    user.passwordResetExpires = undefined

  await user.save()
  createAndSendToken(user, 200, res);
})