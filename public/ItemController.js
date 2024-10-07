import Item from "./Item.js";
import item_unlock from './assets/item_unlock.json' with { type: 'json' };
import items from './assets/item.json' with { type: 'json' };


class ItemController {

    INTERVAL_MIN = 3000;

    nextInterval = null;
    itemlist = [];


    constructor(ctx, itemImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.itemImages = itemImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextItemTime(1);
    }

    setNextItemTime(itemId) {
        const index = items.data.findIndex((e) => e.id === itemId);
        const INTERVAL_MAX = items.data[index].responseTime * 1000;
        this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, INTERVAL_MAX);
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createItem(stageIndex) {
        const itemId = item_unlock.data[stageIndex].item_id;
        
        const index = this.getRandomNumber(0, itemId.length - 1);
        // index의 item_id의 값 할당
        const itemInfo = this.itemImages[index];

        const x = this.canvas.width * 1.5;
        const y = this.getRandomNumber(
            10,
            this.canvas.height - itemInfo.height
        );

        const item = new Item(
            this.ctx,
            itemInfo.id,
            x,
            y,
            itemInfo.width,
            itemInfo.height,
            itemInfo.image
        );
        
        this.itemlist.push(item);
    }


    update(gameSpeed, deltaTime, stageIndex) {
        if(this.nextInterval <= 0) {
            this.createItem(stageIndex);
            let lastItem = this.itemlist[this.itemlist.length - 1];
            this.setNextItemTime(lastItem.id);
        }

        this.nextInterval -= deltaTime;

        this.itemlist.forEach((item) => {
            item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        this.itemlist = this.itemlist.filter(item => item.x > -item.width);
    }

    draw() {
        this.itemlist.forEach((item) => item.draw());
    }

    collideWith(sprite) {
        const collidedItem = this.itemlist.find(item => item.collideWith(sprite))
        if (collidedItem) {
            this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height)
            return {
                itemId: collidedItem.id
            }
        }
    }

    reset() {
        this.itemlist = [];
    }
}

export default ItemController;