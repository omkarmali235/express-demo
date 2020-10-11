const express=require('express');
const app=express();

const Joi=require('joi');
const helmet=require('helmet');//for security majors
//const config=require('config');
const morgon=require('morgan');//writing log files
const logger=require('./middleware/logger');//Custom Middleware 1
const auth=require('./middleware/authentication');//Custom Middleware 2

//console.log(`NODE_ENV:- ${process.env.NODE_ENV}`); //By default Undefined 
console.log(`app:-${app.get('env')}`);  //BY default Development
//for setting env variable set NODE_ENV=development


app.use(express.json());//req.body
//app.use(express.urlencoded({extended=true}));//key=value&key=value
app.use(express.static('public'));//statics files store here
app.use(helmet());
app.use(logger);//Using Custom Middleware 1
app.use(auth);//Using Custom Middleware 2

if(app.get('env')==='development'){//When it is Development stage this code is executed
    app.use(morgon('tiny'));
    console.log("Morgon Enabled.....");//it is method of logging get,put req
}

const courses=[
    {id:1,name:'Omkar'},
    {id:2,name:'Vivek'},
    {id:3,name:'Aniket'},
];
//Get:- for getting single or multiple records
app.get('/',(req,res)=>{
    res.send("Welcome to Homepage....");
});

app.get('/api/courses',(req,res)=>{
    res.send(courses);
});

app.get('/api/courses/:id',(req,res)=>{
    const course=courses.find(c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).send('Course With Given Id Not Found');  
    res.send(course);
});

//Post:-for creating New Record
app.post('/api/courses/',(req,res)=>{
    const {error}=validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const course={
        id: courses.length+1 ,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);

});

//Put:- Used for updating 
app.put('/api/courses/:id',(req,res)=>{
    //Find
    const found=courses.find(c => c.id === parseInt(req.params.id));
    if(!found) return res.status(404).send('The Course with given Id not Found');

    //Validate
    const {error}=validateCourse(req.body);
    if(error) return res.status(400).send(result.error.details[0].message);

    //Update
    found.name=req.body.name ;
    res.send(found);
});


//Delete: deletion of element
app.delete('/api/courses/:id',(req,res)=>{
    //Check Exist or not
    const found=courses.find(c => c.id === parseInt(req.params.id));
    if(!found) return res.status(404).send('The Course with given Id not Found');

    //Delete
    const index=courses.indexOf(found);
    courses.splice(index,1);

    res.send(found);
});


function validateCourse(body) {
    const skeema=Joi.object({
        name:Joi.string().min(3).required()
    });
   
    return skeema.validate(body);
}


app.listen(3000,()=> console.log("Listening to port 3000...."));