import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'fausto-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    @ViewChild('stacked', { static: true }) STACKED: ElementRef;
    // COORDINATES
    private EVClientX = 0; // cursor's actual x position
    private EVClientY = 0; // cursor's actual y position
    private ElPos = { x: this.EVClientX, y: this.EVClientY }; // cursor's delayed coordinate position
    private readonly DRAG_FACTOR = 6;
    private fs;


    constructor(
        private RENDER: Renderer2,
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object
    ) { }
    ngOnInit() {
        if (isPlatformBrowser(this.platform)) {
            this.fs = [...this.STACKED.nativeElement.children].reverse();

            let m = () => {
                this.animationLoop();
                window.requestAnimationFrame(m)
            };
            m();
        }
    }


    @HostListener('window:mousemove', ['$event'])
    moveStacked(event) {
        let x = event.screenX;
        let y = event.screenY;

        let windowW = window.innerWidth;
        let windowH = window.innerHeight;

        this.EVClientX = (windowW / 2) + (x - windowW);
        this.EVClientY = (windowH / 2) + (y - windowH);
    }


    /**
     * The function that draws objects in the canvas on
     * every frame refresh. Approximately 60fps.
     */
    private animationLoop() {

        // Draws the cursor pointer
        // this.drawMousePointer();

        // Makes the cursor ring to follow the cursor's position
        // at a fraction (determined by this.DRAG_FACTOR) of the
        // of the speed.
        const distX = this.EVClientX - this.ElPos.x;
        const distY = this.EVClientY - this.ElPos.y;
        this.ElPos.x += distX / this.DRAG_FACTOR;
        this.ElPos.y += distY / this.DRAG_FACTOR;

        let denom = (x: number) => (-20 * Math.exp(-Math.pow(x + 8, 2) / 200)) + 21;
        this.RENDER.setStyle(this.fs[0], 'transform', `translate(${this.ElPos.x / denom(1)}px, ${this.ElPos.y / denom(1)}px)`);
        this.RENDER.setStyle(this.fs[1], 'transform', `translate(${this.ElPos.x / denom(2)}px, ${this.ElPos.y / denom(2)}px)`);
        this.RENDER.setStyle(this.fs[2], 'transform', `translate(${this.ElPos.x / denom(3)}px, ${this.ElPos.y / denom(3)}px)`);
        this.RENDER.setStyle(this.fs[3], 'transform', `translate(${this.ElPos.x / denom(4)}px, ${this.ElPos.y / denom(4)}px)`);
        // let sk = `rotateY(${(this.ElPos.x / window.innerWidth) * 10}deg) rotateX(${(this.ElPos.y / window.innerHeight) * 45}deg)`
        // this.RENDER.setStyle(this.STACKED.nativeElement, 'transform', `${sk} perspective(38.1cm)`);
    }
}
