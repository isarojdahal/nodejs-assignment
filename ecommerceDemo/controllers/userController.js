import productModel from "../models/productsModel.js";
import "dotenv/config"
import { Op } from "sequelize";
import e from "express";


export default class UserController {

    async homepage(req, res) {
        const q=req.query.search

        try {
            if(q){
                const prod=await productModel.findAll({
                    where:{
                        name:{
                            [Op.like]:`%${q}%`
                        }
                    }
                })
                if(prod){
                    res.render("user/home",{prod})
                    console.log(prod);
                }
                else{
                    res.json({
                        message:"no products"
                    })
                }
            }
            else{
            const prod = await productModel.findAll();
            if (prod === null)
            {
                return res.json({
                    "message":"No Products Available"
                });
            }
            else 
            {
            res.render("user/home",{prod})
            }
            }
          } catch (err) {
            res.json(err);
          }
      } 

async searchProduct(req,res){
    const {name}=req.query
    const data=await productModel.findAll({
        where:{
            [Op.like]:`%${name}%`
        }
    })
    res.json(data)
}

}