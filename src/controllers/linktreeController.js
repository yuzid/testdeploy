import Linktree from "../models/linktreeModel.js";
import Button from "../models/buttonModels.js"
import cryptoRandomString from 'crypto-random-string';
import { __dirname } from '../../path.js'; 
import path from 'path';
import { shorten } from "./shortlinkController.js";

async function isIDunique(id){
    const result = await Linktree.exists('id_shortlink', id);
    return !result.rows[0]['exists'];
}

async function uniqueRandomID(){
    let id;
    while (true){
        id = cryptoRandomString({length: 4, type:'alphanumeric'});
        if (await isIDunique(id)){
            break;
        }
    }
    return id;
}

const linktreeMenu = async (req, res) => {
    try{
        res.status(200).sendFile(__dirname, 'src', 'views', 'linktree.html');
    }
    catch (e){
        console.log(e.message);
        res.status(500).send(e.message);
    }
}

const sendLinktreeData = async (req,res) => {
    try{
        const linktreeData = await Linktree.getBy("id", req.params.id);
        const buttonData = await Button.getBy("linktree_id", req.params.id);
        res.status(200).send({
            "linktreeData" : linktreeData.rows,
            "buttonData" : buttonData.rows 
        })
    }
    catch (e){
        console.log(e.message);
        res.status(500).send(e.message);
    }
}

export default {
    linktreeMenu,
    sendLinktreeData
}