


export class Bullet {
    public xPos = 0;
    public yPos = 0;
    public ID = 0;

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        startXPos: number,
        startYPos: number
    ) {
        this.context = context;
        this.canvas = canvas;
        this.xPos = startXPos;
        this.yPos = startYPos;

        this.ID = Math.floor((Math.random() * 100000000) + 1000);
    }

    public draw() {
        this.context.beginPath();
        this.context.moveTo(this.xPos, this.yPos);
        this.context.setLineDash([]);
        this.context.lineTo(this.xPos, this.yPos - 20);
        this.context.strokeStyle = 'red';
        this.context.stroke();

        this.context.closePath();
    }
}


export class PlayerShip {
    public xPos = 0;
    public yPos = 0;
    public userShipSize = 0;

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, shipSize: number = 10) {
        this.context = context;
        this.canvas = canvas;
        this.userShipSize = shipSize;
    }

    public drawPlayerShip() {
        this.context.beginPath();
        this.context.moveTo(this.xPos, this.yPos - this.userShipSize);
        this.context.lineTo(this.xPos + this.userShipSize, this.yPos + this.userShipSize);
        this.context.lineTo(this.xPos - this.userShipSize, this.yPos + this.userShipSize);
        this.context.lineTo(this.xPos, this.yPos - this.userShipSize);
        this.context.fillStyle = 'green';
        this.context.fill();
        this.context.closePath();
    }

}


export class EnemyShip {
    public xPos = 0;
    public yPos = 0;
    public userShipSize = 0;

    public shipBottom = 0;
    public shipLeft = 0;
    public shipRight = 0;
    private velocity = Math.floor((Math.random() * 4) + 2);

    public bulletCount = [];

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, shipSize: number, x: number, y: number) {
        this.context = context;
        this.canvas = canvas;
        this.userShipSize = shipSize;
        this.xPos = x;
        this.yPos = y;

        this.shipBottom = y + shipSize;
        this.shipLeft = x - (shipSize / 2);
        this.shipRight = x + (shipSize / 2);
    }

    public draw() {
        let y = this.yPos * this.velocity;

        this.context.beginPath();
        let topLeftCornerX = this.xPos - (this.userShipSize / 2);
        let topLeftCornerY = y - (this.userShipSize / 2);

        this.context.rect(
            topLeftCornerX,
            topLeftCornerY,
            this.userShipSize,
            this.userShipSize
        );

        this.context.fillStyle = `rgba(0, 0, 225, ${1 - (this.bulletCount.length / 11)})`;
        this.context.fill();
        this.context.closePath();

        this.context.beginPath();
        this.context.arc(this.xPos, y, 10, 0, 2 * Math.PI)
        this.context.fillStyle = 'yellow';
        this.context.fill();
        this.context.closePath();

        this.shipBottom = y + this.userShipSize;
    }

    public isWithinXBounds(xPosition: number) {
        return (xPosition >= this.shipLeft) && (xPosition <= this.shipRight);
    }

    public hitByBullet(bullet: Bullet) {
        return this.isWithinXBounds(bullet.xPos) && bullet.yPos <= this.shipBottom;
    }
}