import { getGameAssets } from '../init/assets.js';

const INTERVAL_MIN = 1;
let getItemTime = null;

export const ItemHandler = (userId, payload) => {
  const { items, itemUnlocks } = getGameAssets();

  const { itemId, score, stageId, timestamp } = payload;

  const index = items.data.findIndex((e) => e.id === itemId);
  if (score !== items.data[index].score) {
    return { status: 'fail', message: 'item score verification failed' };
  }

  const unlockIndex = itemUnlocks.data.findIndex((e) => e.stage_id === stageId);

  if (!itemUnlocks.data[unlockIndex].item_id.includes(itemId)) {
    return { status: 'fail', message: 'item unlock stage verification failed' };
  }

  if (!getItemTime) {
    getItemTime = timestamp;
    return { status: 'success', message: 'begin item aquire verification' };
  }  

  const elapsedTime = (timestamp - getItemTime) / 1000;
  
  // 1초 이상
  if (elapsedTime >= INTERVAL_MIN) {
    return { status: 'fail', message: 'item aquire verification failed' };
  }

  getItemTime = timestamp;

  return {
    status: 'success',
    message: 'item score & unlock stage & aquire verification successfully',
  };
};