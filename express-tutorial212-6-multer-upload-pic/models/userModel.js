
const mongoose = require( 'mongoose' );
const validator = require( 'validator' );
const bcrypt = require( 'bcrypt' );
const crypto = require( 'crypto' );
const Cat = require( './catModel' );

const userSchema = new mongoose.Schema( {

    name: {
        type: String,
        required: [true, 'The user must have a name']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email not valid']
    },
    password: {
        type: String,
        required: [true, 'The user must have a password'],
        minlength: 8,
        select: false

    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm password'],
        validate: {
            validator: function ( passwordConfirm )
            {
                return this.password === passwordConfirm;
            },
            message: 'Plese confirm password'
        }

    },

    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    cats:[ {
        type: mongoose.Schema.ObjectId,
        ref:'Cat',
        
    }]

}

);
/* userSchema.pre( 'save', async function ( next )
{
    const catsPromises = this.cats.map( async id => await Cat.findById( id ) );

    this.cats = await Promise.all( catsPromises );
    console.log( this.cats );
    next();
} ); */
userSchema.pre( 'save', async function ( next )
{
    if ( !this.isModified( 'password' ) ) return next();
    this.password = await bcrypt.hash( this.password, 12 );
    next();
} );
userSchema.pre( 'save', function ( next )
{
    this.passwordConfirm = undefined;
    next();
} );
userSchema.methods.checkPassword = async function ( reqPassword, userPassword )
{
    return await bcrypt.compare( reqPassword, userPassword );
};
userSchema.methods.createPasswordResetToken = function ()
{
    const resetToken = crypto.randomBytes( 32 ).toString( 'hex' );
    this.passwordResetToken = crypto.createHash( 'sha256' )
        .update( resetToken )
        .digest( 'hex' );

    //console.log(resetToken,this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = mongoose.model( 'User', userSchema );

module.exports = User;