import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssests = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
        if(err){
            reject(err);
            return;
        }

        resolve(JSON.parse(data));

    });
  });
};

export const loadGameAssets = async() => {
  try{
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);
  
    gameAssests = { stages, items, itemUnlocks};
    return gameAssests;
  }catch(err){
    throw new Error('Failed to load game assets' + err.message);
  }
}


export const getGameAssets = () => {
  return gameAssests;
};
