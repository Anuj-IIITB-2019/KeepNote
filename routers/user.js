const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
// const multer = require('multer')

// CREATE User
router.post('/users',async(req,res)=>{

	const user = new User(req.body)

	try{
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({user,token})
	}catch(e){
		res.status(400).send(e)	
	}
})

// LOGIN User
router.post('/users/login',async(req,res)=>{
try{
	const user = await User.findByCredentials(req.body.email,req.body.password)
	const token = await user.generateAuthToken()
	res.send({user,token})
}
catch(e){
res.status(400).send()
}
})


// LOGOUT Current Account of User
router.post('/users/logout',auth,async(req,res)=>{
	try{
		req.user.tokens = req.user.tokens.filter((token)=>{
			return token.token!== req.token
		})
		await req.user.save()
		res.send()

	}catch(e){
		res.status(500).send()
	}
})


// LOGOUT User from all accounts
router.post('/users/logoutall',auth,async(req,res)=>{
	try{
		req.user.token =[]
		await req.user.save()
		res.send()
	}
	catch(e){
		res.status(500).send()
	}
})

router.get('/users',async(req,res)=>{

	try{
		const users = await User.find({})
		res.send(users)

	}catch(e){
		res.status(500).send()
	}

})

// GET our profile
router.get('/users/me',auth,async(req,res)=>{
	res.send(req.user)
})


// UPDATE User
router.patch('/users/me',auth,async(req,res)=>{

const updates = Object.keys(req.body)
const allowedUpdates = ['name','email','password','age']

const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

if(!isValidOperation){
return res.status(400).send({error :'invalid updates'})
}
	 try{
	 	updates.forEach((update)=>req.user[update]=req.body[update])
	 	await req.user.save()
	 	res.send(req.user)
	 	if(!user){
	 		return res.status(404).send()
	 	}
	 	res.send(req.user)
	 }catch(e){
	 	res.status(400).send(e)
	 }
})


// DELETE User
router.delete('/users/me',auth, async(req,res)=>{


	try{
		await req.user.remove()
		res.send(req.user) 

	}catch(e){
		res.status(500).send(e)
	}
})

const upload = multer({
	limits:{
		fileSize:1000000,
	},
	fileFilter(req,file,cb){
		if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
		{
			return cb(new Error('Please Upload jpg or jpeg or jpeg file'))
		}
		cb(undefined,true)
	}

})
router.post('/users/me/avatar', auth, upload.single('avatar'),async(req,res)=>{
	req.user.avatar = req.file.buffer
	await req.user.save()
	res.send();
},(error,req,res,next)=>{
	res.status(400).send({error:error.message})
});

router.delete('/users/me/avatar', auth, upload.single('upload'), async(req,res)=>{
	req.user.avatar = undefined
	await req.user.save();
	res.send();
})

router.get('user/:id/avatar', async(req,res)=>{
	try{
		const user = await User.findById(req.param.id)

		if(!user || !user.avatar){
			throw new Error()
		}

		res.set('Content-type','image/jpg')
		res.send(user.avatar)
	}catch(e){
		res.status(404).send()
	}
})

// Configure multer
// const upload = multer({
// 	dest:'avatars'
// })

// Upload User profile pic
// router.post('/users/me/avatar',upload.single('avatar'),async(req,res)=>{
// res.send()
// })

module.exports= router