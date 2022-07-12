
const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
   id:{
       type:Number,
       required:[true, 'The cat must have an id'],
       unique:[true, 'Please provide unique id']
   },
   catBread: {
       type:String,
       required:[true, 'The cat must have a name'],
       minlength:[4 , 'The breed must be at least 4 characters']
   },
   imageUrl: String,
   from: String,
   coat: {
       type:String,
       enum:{
           values:['short','medium','long'],
           message:'The coat must be either short medium or long'
       },
       default:'medium'
    },
    color: String,
    size:{
        type: String,
        enum:{
            values:['small', 'medium','large','small to medium', 'medium to large'],
            message:'The size must be either small, medium, large, small to medium or medium to large'
        }
    },
    friendly: {
        type: Boolean, 
        default: true
    },
    description:{
        type: String,
        maxLength:[400, 'The description must be up to 400 characters'] 
    },
    servant:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'The cat must have a human']
    }
       
   }
);
const Cat = mongoose.model('Cat', catSchema);


module.exports = Cat;
































