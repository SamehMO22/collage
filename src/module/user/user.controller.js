
    import { tokenGeneration, tokenDecode } from "../../utiles/GenerateAndVerifyToken.js"
    import sendEmail from "../../utiles/sendEmail.js"
    
    import pkg from 'bcryptjs'
    
    
    
    import userModel from "../../../DB/model/auth.mode.js"

    
    
    
    export const addUser= async(req , res ,next)=>{
    
    
        const { 
            userName,
            email,
            password,
            phon,
            
    
        } = req.body
        const checkemail = await userModel.findOne({ email }).select('_id email')
        if (checkemail){
            return next (new Error('please enter anoter email',{cause:400}))
        }
    
    
    
        const newUser = new userModel({
            userName,
            email,
            password,
            phon,
            
    
        })
    
    
        // confimation
        const token =  tokenGeneration({ payload: { _id: newUser._id, email: newUser.email } })
         
        if (!token) {
            return next(new Error('Token Generation Fail', { cause: 400 }))
        }
    
    
    
    
        const confirmationLink =
            `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    
        const message = `<a href= ${confirmationLink}>Click to confirm</a>`
        const sentEmail = await sendEmail({
            to: email,
            message,
            subject: "Confirmation Email"
        })
        if (!sentEmail) {
            return next(new Error('Send Email Service Fails', { cause: 400 }))
        }
        await newUser.save()
        res.status(201).json({ message: "registration success , please confirm your email" })
    }
    
    
    
    
    // confirmation email
    
    
    
    export const confirmEmail = async (req, res, next) => {
        const { token } = req.params
    
        const decode = tokenDecode({ payload: token })
        if (!decode?._id) {
            return next(new Error('Decoding Fails', { cause: 400 }))
        }
        const userConfirmed = await userModel.findOneAndUpdate({ _id: decode._id }, {
            isConfirmed: true
        })  

        if (!userConfirmed) {
            return next(new Error('please check if you already confirm you email , if not please try to signup again', { cause: 400 }))
    
        }
        return res.status(200).json({ message: "Your email confirmed", decode })
    }
    // axios
    
// ===================================login Api===========================================================================================
    export const login = async (req, res, next) => {
        const { email, password } = req.body
        const user = await userModel.findOne({ email})
        if (!user) {
            return next(new Error('please if enter a valid email or make sure that you confirm your email', { cause: 400 }))
        }
        const match = pkg.compareSync(password, user.password)
        if (!match) {
            return next(new Error('in-valid login information', { cause: 400 }))
        }
        const token = tokenGeneration({
            payload: {
                _id: user._id,
                email: user.email,
                isLoggedIn: true
            }
        })
        await userModel.findOneAndUpdate({ email })
        return res.status(200).json({ message: "Login Done", token })
    
    }
        




















































