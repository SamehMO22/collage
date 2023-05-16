import { nanoid } from "nanoid"
import cloudinary from "../../utiles/cloudinary.js"
import newsModel from "../../../DB/model/newa.model.schema.js"

export const addnews = async(req , res , next)=>{

    // const {text}=req.body
    const text = req.body.text

    if(!req.file){
        return res.json({message:"please select your photo"})
    }

    const newname = nanoid(10)

    const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder : `${process.env.PROJECT_FOLDER}/news/${newname}`



    })


    const savenews = await newsModel.create({
        text,
        image:{
            path:secure_url,
            public_id
        }



    })




    if (savenews){
        res.status(200).json({message:"we uploud the news for you"})
            
    }

    else{
        res.status(400).json({message:"sorry fail"})
    }









    }