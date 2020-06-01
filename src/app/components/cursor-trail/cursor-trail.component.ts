import { Component, OnInit, ViewChild, ElementRef, HostListener, Input, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TweenLite } from 'gsap/dist/gsap';
import { SilkyScrollService } from '../../silky-scroll';

@Component({
    selector: 'fausto-cursor-trail',
    templateUrl: './cursor-trail.component.html',
    styleUrls: ['./cursor-trail.component.scss']
})
export class CursorTrailComponent implements OnInit {
    @ViewChild('trail', { static: true }) Trail: ElementRef;
    @ViewChild('gradientCanvas', { static: true }) GradientCanvas: ElementRef;

    private CONTEXT: CanvasRenderingContext2D;
    private CANVAS: HTMLCanvasElement;
    // A list of colors made up of the gradient composed by
    // the theme's "rainbow" colors
    private rainbowColors: Number[][] = [[]];
    // The current color of the brush
    private currentColorPos = 0;
    // How many colors there will be
    private gradientLength = 100;
    // A times (setTimeout) used to detect when
    // the mouse stops moving
    private timer: number;
    // the opacity of the trail
    private alpha = 0.05;
    // The size of the brush
    private bubbleSize = 64;
    // the current mouse position
    private mousePos = { x: 0, y: 0 };
    // The current frame in the animation
    private currentAnimationFrame = 0;
    // When the mouse stops moving, the frame in
    // which it stopped is captured inside this variable
    private mouseStoppedFrame = 0;
    // Whether the canvas can be gradually cleared using
    // opaque rectangles (context.fillRect())
    private canClear = false;
    // Whether the mouse has stopped or not
    private mouseStopped = false;
    // The canvas will have a height equal to the "home" and "about"
    // sections together. But because the size changes after the hero image
    // loads, we need to reset the size.
    public shouldHeight = 0;
    @Input() set contentHeight(value: string) {
        this.shouldHeight = (Number.parseInt(value) - 300);
    }
    // Whether the canvas is hidden or not
    private isCanvasHidden = false;

    private scrollY = 0;
    private prevScrollY = 0;



    constructor(
        private RENDER: Renderer2,
        private SCROLL: SilkyScrollService,
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object,
    ) { }
    ngOnInit() {

        if (isPlatformBrowser(this.platform)) {
            // Globally declares the canvas element and context
            this.CANVAS = this.Trail.nativeElement;
            this.CONTEXT = this.CANVAS.getContext('2d');
            this.CONTEXT.imageSmoothingEnabled = false;
            // sets the width. The height is conditionally
            // set in the animationLoop()
            this.CANVAS.width = window.innerWidth;
            // Generates the rainbow gradient
            this.generateGradient();
            this.SCROLL.scrollListener.subscribe(scroll => this.scrollY = scroll.scrollY);

            // High-speed animation loop
            let doAnimation = () => {
                this.animationLoop();
                window.requestAnimationFrame(doAnimation);
            }
            doAnimation();
        }



    }




    /**
     * Listens for the window has resized
     */
    @HostListener('window:resize') windowHasResized() {
        // Sets the width of the canvas equal to the
        // width of the canvas
        this.CANVAS.width = window.innerWidth;
    }


    /**
     * Listens to changes in the position of the mouse
     * @param event The mouse event
     */
    @HostListener('window:mousemove', ['$event']) mouseMove(event: MouseEvent) {
        this.drawFadingCircle(event.clientX, this.scrollY + event.clientY); // draws the brush

        // Changes the size of the brush if the user
        // holds the Ctrl key while moving the cursors
        // up or down.
        if (event.ctrlKey) {
            this.bubbleSize = (50 - ((event.clientY * 10) / 100)) + 60;
        }

        this.canClear = true; // the canvas can be cleared
        this.mouseStopped = false; // the mouse it moving

        // The opacity of the canvas is transitioned to zero
        // when the mouse stops moving. Here, we make the opacity
        // to one when the mouse starts moving.
        if (this.isCanvasHidden) {
            this.RENDER.setStyle(this.CANVAS, 'opacity', '1');
            this.isCanvasHidden = false;
        }

        // Fires an event when the mouse has stopped moving
        if (this.timer) { window.clearTimeout(this.timer); }
        this.timer = window.setTimeout(() => this.mouseStop(event), 500);
    }


    /**
     * Listens for when the mouse has stopped moving
     * in the window
     * @param event Mouse event
     */
    mouseStop(event: MouseEvent) {
        this.mouseStopped = true; // the mouse it not moving
        this.mouseStoppedFrame = this.currentAnimationFrame;
    }


    /**
     * Distance between two points
     * @param point1 First point
     * @param point2 Second Point
     */
    distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }


    /**
     * Angle between two points
     * @param point1 First Point
     * @param point2 Second Point
     */
    angleBetween(point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }


    /**
     * Draws a circle filled with an specific color in the canvas
     * @param x The cursor's x position
     * @param y The cursor's y position
     */
    drawFadingCircle(x: number, y: number) {
        let colorVector = this.rainbowColors[this.currentColorPos % this.gradientLength];
        let color = 'rgb(' + colorVector[0] + ', ' + colorVector[1] + ', ' + colorVector[2] + ')';
        let dist = this.distanceBetween(this.mousePos, { x, y });
        let angle = this.angleBetween(this.mousePos, { x, y });

        // if (!this.mouseStopped) {
        this.CONTEXT.beginPath();
        if (this.distanceBetween(this.mousePos, { x, y }) < 400 && this.prevScrollY === Math.round(this.scrollY)) {
            for (var i = 0; i < dist; i += 15) {
                let newX = this.mousePos.x + (Math.sin(angle) * i);
                let newY = this.mousePos.y + (Math.cos(angle) * i);
                this.CONTEXT.arc(newX, newY, this.bubbleSize, 0, 2 * Math.PI);
            }
        }
        // }
        this.CONTEXT.closePath();
        this.CONTEXT.fillStyle = color;
        this.CONTEXT.fill();

        this.mousePos = { x, y };
        this.prevScrollY = Math.round(this.scrollY);
        this.currentColorPos += 1;
    }


    /**
     * Generates an array of colors (2-dimensional array of R^3 arrays)
     * made up by the gradient between the colors of the theme's rainbow colors.
     */
    generateGradient() {
        let GRADIENT_CANVAS = this.RENDER.createElement('canvas');
        let GRADIENT_CONTEXT = GRADIENT_CANVAS.getContext('2d');
        GRADIENT_CANVAS.width = this.gradientLength;
        GRADIENT_CANVAS.height = 1;

        // Creates the gradient
        let rainbow = GRADIENT_CONTEXT.createLinearGradient(0, 0, GRADIENT_CANVAS.width, 0);
        rainbow.addColorStop(0, '#e0ab0b');
        rainbow.addColorStop(0.1429, '#e7545b');
        rainbow.addColorStop(0.2857, '#da2221');
        rainbow.addColorStop(0.4286, '#232052');
        rainbow.addColorStop(0.5714, '#305a48');
        rainbow.addColorStop(0.6250, '#507bdb');
        rainbow.addColorStop(0.7143, '#dcb99f');
        rainbow.addColorStop(1, '#e0ab0b');

        // sets the gradient as the background of the canvas
        GRADIENT_CONTEXT.fillStyle = rainbow;

        let color = [];
        this.rainbowColors.pop();
        GRADIENT_CONTEXT.fillRect(0, 0, GRADIENT_CANVAS.width, GRADIENT_CANVAS.height);
        GRADIENT_CONTEXT.getImageData(0, 0, GRADIENT_CANVAS.width, 1).data.forEach((pixVal, index) => {
            // Because every fourth index of the data array represents the
            // alpha for the current pixel, we need to skip that index.
            if (color.length < 3 && ((index + 1) % 4) !== 0) {
                color.push(pixVal)
            } else {
                this.rainbowColors.push(color)
                color = []
            }
        });
    }



    /**
     * The animation loop
     */
    animationLoop() {
        // Stop clearing with opaque rectangles and clear with context.clearRect() when the mouse
        // has stopped moving and there has been 100 extra frames since the mouse stopped moving
        if (this.mouseStopped && this.currentAnimationFrame >= (this.mouseStoppedFrame + 100)) {
            this.canClear = false;

            // Hides the canvas by turning it's opacity to zero
            if (!this.isCanvasHidden) {
                TweenLite.to(this.CANVAS, {
                    opacity: 0,
                    duration: 0.7,
                    onComplete: () => {
                        // Once the opacity transition is done, we clear the canvas
                        // with the traditional method.
                        this.CONTEXT.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);
                        this.isCanvasHidden = true;
                    }
                });
            }
        }

        if (this.canClear) {
            // Fills the canvas with an opaque black 
            this.CONTEXT.fillStyle = `rgba(241, 241, 241, ${this.alpha})`;
            this.CONTEXT.fillRect(0, 0, this.CANVAS.width, window.innerHeight + this.scrollY + 100);

            // Update the height of the canvas if it doesn't match
            // the height of the parent
            if (this.CANVAS.height !== this.shouldHeight) {
                this.CANVAS.height = this.shouldHeight;
            }

            this.currentAnimationFrame += 1;
        }

    }
}
