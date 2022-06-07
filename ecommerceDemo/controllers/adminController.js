import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import productModel from "../models/productsModel.js"
import "dotenv/config"
import jwt from "jsonwebtoken"

export default class AdminController {

    async homepage(req, res) {
        try {
            const prod = await productModel.findAll();
            if (prod === null && usr===null )
            {
                return res.json([]);
            }
            else 
            {
            res.render("admin/home",{prod})
            }
          } catch (err) {
            res.json(err);
          }
    }

    async addAdminGet(req,res){
        res.render("admin/sighup")
    }
    async addAdmin(req,res){
        const email=req.body.email;
        if(email){
            res.json("email already exists")
        }
        else{
        try {
            const data=await adminModel.create({...req.body});
            // res.json(data)
            res.redirect("/admin/login")
        } catch (error) {
            res.json({
                "message":error
            })
        }
    }
    }

    async deleteProduct(req,res){
        const {id} =req.params;
        if(id){
            const data=await productModel.destroy({
                where:{
                    id
                }
            });
            
            if(data){
                res.redirect("/admin")

            }
            else{
                res.json("Couldn't Delete User")
            }
        }
        else{
            res.json({
                message:"User Id not Provided"
            })
        }
        
    }

    async deleteUser(req,res){
        const {id} =req.params;
        if(id){
            const data=await usersModel.destroy({
                where:{
                    id
                }
            });
            
            if(data){
                res.json({
                    message:"User Deleted"
                })
            }
            else{
                res.json("Couldn't Delete User")
            }
        }
        else{
            res.json({
                message:"User Id not Provided"
            })
        }
    }

    async adminLoginGet (req,res){
        res.render("admin/login")
    }

    async adminLogin(req,res){
            try {
            const response=await adminModel.findOne({
                where:{
                    email:req.body.email,
                },
            });
            if(response===null){
                return res.json({
                    message: "User does not exist" 
                })
            }
            else{
                const match=bcrypt.compareSync(req.body.password,response.password);
                if(match){
                    const token=jwt.sign({id:response.id},process.env.JWT_SECRET_ADMIN,{expiresIn:"3600000"});
                        delete response.dataValues.password;
                        response.dataValues.token=token;
                        // res.json(response)
                        res.cookie("token",token)
                        res.cookie("email",response.dataValues.email)
                        res.redirect("/admin")
                }
                else{
                    res.json({
                        message:"Invalid Credentials"
                    })
                }
            }
        } catch (error) {
            res.json(error)
        }        
    }

    async adminLogout(req,res){
        res.clearCookie("token")
        res.redirect("/admin/login")
    }

    async addProductGet(req,res){
        res.render("admin/add")
    }

    async addProduct(req,res,imageName){
        try {
            const data= await productModel.create({
                ...req.body,image:imageName
            })
            console.log(data);
            res.redirect("/admin")
        } catch (error) {
            res.json({
                "message":error
            })            
        }
    }

    async updateProductGet(req,res){
        const id=req.params.id
        if(id){
            const data=await productModel.findOne({
                
                where:{
                    id
                }
            })
            res.render("admin/edit",{data})
        }
        else{
            res.json({
                message:"No id provided"
            })
        }
    }
    async updateProduct(req,res){
        const id=req.params.id
        console.log(id);
        if(id){
            const {name,price,image}=req.body;

            const data=await productModel.update(
                {name,price},
               {
                where:{
                    id
                }
            })
            console.log(data);
            if(data[0]){
                res.redirect("/admin")
            }
            else{
                res.json({
                    message:"Unable to Update Product"
                })
            }
        }
        else{
            res.json({
                message:"Product Id not Provided"
            })
        }
    }

}