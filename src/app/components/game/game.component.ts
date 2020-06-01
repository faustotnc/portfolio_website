import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';

import { Bullet, PlayerShip, EnemyShip } from './Helpers';

@Component({
    selector: 'fausto-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
    @ViewChild('gameCanvas', { static: true }) GAME_CANVAS: ElementRef;
    @ViewChild('canvasWrapper', { static: true }) CANVAS_WRAPPER: ElementRef;

    private CANVAS: HTMLCanvasElement;
    private CONTEXT: CanvasRenderingContext2D;

    private currentFrame = 0;
    private userShipPos = { x: 0 };
    private UserShip: PlayerShip;
    private bullets: Bullet[] = [];
    private enemies: EnemyShip[] = []
    private isHoldCtrl = false;
    public bulletCount = 100;
    public defeatedShips = 0;
    private borderLine = 0;
    private isGameOver = false;


    constructor() { }
    ngOnInit() {
        this.CANVAS = this.GAME_CANVAS.nativeElement;
        this.CANVAS.width = this.CANVAS_WRAPPER.nativeElement.offsetWidth;
        this.CANVAS.height = window.innerHeight;
        this.CONTEXT = this.CANVAS.getContext('2d');
        this.CONTEXT.imageSmoothingEnabled = false;

        this.UserShip = new PlayerShip(this.CANVAS, this.CONTEXT, 20);

        this.borderLine = (window.innerHeight - (window.innerHeight / 100) * 20) + 80;

        let animation = () => {
            this.animationLoop();
            window.requestAnimationFrame(animation);
        }
        animation();
    }

    @HostListener('window:mousemove', ['$event']) mouseMove(event: MouseEvent) {
        let pos = event.clientX - (window.innerWidth - this.CANVAS.width);
        this.userShipPos = { x: (pos >= 0) ? pos : 0 }
    }

    @HostListener('window:keyup', ['$event'])
    @HostListener('window:keydown', ['$event']) keyPress(event: KeyboardEvent) {
        this.isHoldCtrl = event.ctrlKey;
    }


    drawEnemiesAndBullets() {
        // Draws the bullets
        for (const [bulletIndex, bullet] of this.bullets.entries()) {
            bullet.yPos = (this.currentFrame % 2) ? bullet.yPos - 20 : bullet.yPos;
            bullet.draw();

            // removes the bullet if it has reached the top of the screen
            if (bullet.yPos <= 0) this.bullets.splice(bulletIndex, 1);

            for (const [enemyIndex, enemy] of this.enemies.entries()) {
                if (enemy.hitByBullet(bullet) && !enemy.bulletCount.includes(bullet.ID)) {
                    // adds the bullet to the list of bullets
                    // that hit the enemy
                    enemy.bulletCount.push(bullet.ID);

                    // removes the ships if 10 bullets have hit it
                    if (enemy.bulletCount.length >= 10) {
                        this.enemies.splice(enemyIndex, 1);
                        this.bulletCount += 10;
                        this.defeatedShips += 1;
                    }

                    // removes the bullet if it hist the enemy
                    this.bullets.splice(bulletIndex, 1);
                }
            }
        };

        // Draws each of the enemies
        for (const [i, enemy] of this.enemies.entries()) {
            enemy.yPos += 0.6;
            enemy.draw();

            if (enemy.shipBottom >= (this.borderLine + 50)) {
                this.gameOver();
            }
        }
    }

    gameOver() {
        this.isGameOver = true;
    }

    animationLoop() {
        if (!this.isGameOver) {
            this.CONTEXT.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);

            this.drawEnemiesAndBullets();

            this.CONTEXT.beginPath()
            this.CONTEXT.moveTo(0, this.borderLine);
            this.CONTEXT.setLineDash([5, 15]);
            this.CONTEXT.lineTo(this.CANVAS.width, this.borderLine);
            this.CONTEXT.strokeStyle = 'red';
            this.CONTEXT.stroke
            this.CONTEXT.stroke();
            this.CONTEXT.closePath()



            // Draws the user ship
            let shipBottom = window.innerHeight - (window.innerHeight / 100) * 5;
            this.UserShip.xPos = this.userShipPos.x;
            this.UserShip.yPos = shipBottom;
            this.UserShip.drawPlayerShip();

            if (this.currentFrame % 10 === 0 && this.isHoldCtrl && this.bulletCount > 0) {
                this.bullets.push(new Bullet(this.CANVAS, this.CONTEXT, this.userShipPos.x, this.UserShip.yPos - 20));

                this.bulletCount -= 1;
            } else if (this.bulletCount <= 0) {
                this.gameOver();
            }

            if (this.currentFrame % (60 * 2.5) === 0) {
                let shipXPos = Math.floor((Math.random() * (this.CANVAS.width - 100)) + 100);
                let shipXWidth = Math.floor((Math.random() * 100) + 50);
                this.enemies.push(new EnemyShip(this.CANVAS, this.CONTEXT, shipXWidth, shipXPos, 0));
            }

            this.currentFrame += 1;
        }
    }
}
