import Linktree from "../models/linktreeModel.js";
import Button from "../models/buttonModels.js";
import cryptoRandomString from "crypto-random-string";
import { __dirname } from "../../path.js";
import path from "path";
import { shorten } from "./shortlinkController.js";

async function isIDunique(id) {
  const result = await Linktree.exists("id_linktree", id);
  return !result.rows[0]["exists"];
}

async function uniqueRandomID() {
  let id;
  while (true) {
    id = cryptoRandomString({ length: 4, type: "alphanumeric" });
    if (await isIDunique(id)) {
      break;
    }
  }
  return id;
}

const linktreeMenu = async (req, res) => {
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname, "src", "views", "samakok.html"));
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

const sendLinktreeData = async (req, res) => {
  try {
    const linktreeData = await Linktree.getBy("id", req.params.id);
    const buttonData = await Button.getBy("linktree_id", req.params.id);
    res.status(200).send({
      linktreeData: linktreeData.rows,
      buttonData: buttonData.rows,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

const createRoom = async (req, res) => {
    try{
        const { body } = req;
        let custom;
        const id = await uniqueRandomID();
        if (body.customUrl.length > 0){
            custom = body.customUrl;
        }
        else{
            custom = id;
        }
        const shortUrl = await shorten(`http://localhost:8000/linktree/res?id=${id}`, null, custom);
        await Linktree.insert(id, body.title, custom, null, body.style);
        res.status(303).redirect(`http://localhost:8000/linktree/room-edit?id=${id}`);
    }
    catch (e){
        console.log(e.message);
        res.status(500).send(e.message);
    }
}

const saveButtons = async (req, res) => {
    try{
        const { body } = req;
        const id = req.params.id;
        await insertButtons(id, body);
        res.status(200).send("success");
    }
    catch (e){
        console.log(e.message);
        res.status(500).send(e.message);
    }
}

async function jsonfyButtons(id){

};

const linktreeRes = async (req, res) => {
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname, "src", "views", "buildlinktree.html"));
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

async function insertButtons(id, buttonData, email = null) {
  buttonData.forEach(async (button, index) => {
    let slID = await shorten(button.url, email);
    if (slID === null) {
      throw new Error("Shortlink error");
    }
    await Button.insert(button.name, index, id, slID);
  });
}

const getLinktree = async (req, res) => {
  try {
    const result = await Linktree.getBy("id_linktree", req.params.id);
    res.status(200).send({
      id: result.rows[0]["id_linktree"],
      title: result.rows[0]["linktree_title"],
      url: "http://localhost:8000/" + result.rows[0]["linktree_url"],
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

export default {
    linktreeMenu,
    sendLinktreeData,
    createRoom,
    linktreeRes,
    getLinktree
}
