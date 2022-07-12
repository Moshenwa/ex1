const Cat = require('./../models/catModel');
const APIfIltering = require('./../utils/APIFiltering')
const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

//
exports.getCat =catchAsync(async (req, res) =>{

  const cat = await Cat.findById(req.params.id)
  if (!cat) return next(new AppError(404, 'The cat you are looking forcannot be found'))
  res.status(200).json({
      status:'success',
      cat
  })


})

exports.createCat = catchAsync( async (req, res) =>{
  if (! req.body) return next(new AppError(400,'Cannot create new resource - bad request'))
  const newCat = await Cat.create(req.body);
  res.status(201).json({
      status:'success',
      message: 'New cat has been created in DB',
      newCat
  })
}

)
exports.getCats = async (req, res) =>{
   /* const filterObj =  { ...req.query };
   const filteredOut = ['sort','page','limit','fields'];
   //filteredOut.forEach(el=> delete filterObj[el])
    delete filterObj.sort;
   delete filterObj.page
   delete filterObj.limit
   delete filterObj.fields
 
   
        ///filter
        console.log(filterObj);
      let catsQuery =  Cat.find(filterObj);
      ///sort
       if(req.query.sort){ 
       const sortObj = req.query.sort.split(',').join(" ");
      catsQuery = catsQuery.sort(sortObj)
   } 
    ///select fields
    let fields;
    if (req.query.fields){
       fields = req.query.fields.split(',').join(' ');
    }
    else{
        fields = '-__v';
    }
     catsQuery = catsQuery.select(fields);
     ///pagination
     let page = 1;
     let limit = 10;
     if(req.query.page){
          page = req.query.page;
          limit = req.query.limit;
         const skip = (page - 1) * limit;
         catsQuery = catsQuery.skip(skip).limit(limit); 
   const apiFiltering = new APIfIltering(Cat.find(), req.query)
     }*/ 
     const apiFiltering = new APIfIltering(Cat.find(), req.query)
      apiFiltering
      .filter()
      .sort()
      .select()
      .paginate()
     try{

      const cats = await apiFiltering.modelQuery;
      
      res.status(200).json({
          status:'success',
          cats
      })
    }catch(err){
        res.status(400).json({
            status:'fail',
            err
        })
    }
    
    
}