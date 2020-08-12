// user.js

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = new mongoose.Schema(

{
	name:{
		default:'Anonymous',
		type:String,
		required:true,
		trim:true
	},
	email:{
		type:String,
		unique:true,
		required:true,
		trim:true,
		lowercase:true,
		validate(value){
			if(!validator.isEmail(value)){
				throw new Error('email is invalid')
			}
		}
	},
	age:{
		type:Number,
		default:0,
		validate(value){
			if(value<0){
				throw new Error('U can\'t age negative')
			}
		}
	},

	password:{
		type:String,
		minlength:7,
		required:true,
		trim:true,
		validate(value){
			if(value.toLowerCase().includes('password')){
				throw new Error('password can\'t be \'password\' ')
			}
		}
	},
	tokens:[{
		token:{
			type:String,
			required:true }
	}],
	avatar:{
		type:Buffer
	}
},
	{timestamps:true}
	);

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true
})

userSchema.virtual('tasks',{
	ref:'Task',
	localField:'_id',
	foreignField:'owner'
})

userSchema.methods.toJSON =function(){
	const user=this
	const userObject = user.toObject()

	delete userObject.password
	delete userObject.tokens
	delete userObject.avatar
	return userObject
}

userSchema.methods.generateAuthToken =async function(){
	const user = this

	const token = jwt.sign({ _id:user._id.toString() },'thisissecret')
	user.tokens = user.tokens.concat({token})

	await user.save()
	return token
}


userSchema.statics.findByCredentials = async(email,password)=>{
const user = await User.findOne({email})

if(!user){
	throw new Error('Unable to login')
}

const isMatch = await bcrypt.compare(password, user.password)
if(!isMatch)
{
	throw new Error('Unable to login')
}
return user
}




// Hash the plain text password before saving
userSchema.pre('save',async function(next){
	const user = this
	if(user.isModified('password')){
		user.password= await bcrypt.hash(user.password,8)
	}
	console.log('just before saving')

	next()
})

// Delete user tasks when user is deleted
userSchema.pre('remove',async function(next){
	
	const user =this
	await Task.deleteMany({	owner:user._id	})
	next()
})


const User = mongoose.model('User',userSchema)

module.exports =User