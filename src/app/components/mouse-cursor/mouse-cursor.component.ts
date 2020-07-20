import { Component, OnInit, ViewChild, ElementRef, HostListener, Input, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { AnimationLoop } from '../../animation-loop';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'fausto-mouse-cursor',
    templateUrl: './mouse-cursor.component.html',
    styleUrls: ['./mouse-cursor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MouseCursorComponent implements OnInit {
    @ViewChild('mouseCursorCanvas', { static: true }) MouseCursorCanvas: ElementRef;
    AnimationLoopInstance: AnimationLoop;

    // CANVAS
    public CANVAS: HTMLCanvasElement;
    public CONTEXT: CanvasRenderingContext2D;

    // CURSOR SETTINGS
    private CURSOR_COLOR = '#000';
    private readonly NORMAL_RING_SIZE = 24;
    private readonly HOLDING_RING_SIZE = 32;
    private readonly MAX_POINTER_SIZE = 5;
    private readonly DRAG_FACTOR = 3;
    private readonly STRETCH_FACTOR = 6;

    // CURSOR STATUS: pointer, holding
    private CursorStatus = 'pointer';
    private ActualRingSize = this.NORMAL_RING_SIZE;

    // COORDINATES
    private EVClientX = this.DOC.documentElement.clientWidth / 2; // cursor's actual x position
    private EVClientY = (this.DOC.documentElement.clientHeight / 2) + this.DOC.documentElement.clientHeight * 0.2; // cursor's actual y position
    private ElPos = { x: this.EVClientX, y: this.EVClientY }; // cursor's delayed coordinate position
    private MaxRingSize = this.NORMAL_RING_SIZE;
    private EndRingSize = this.NORMAL_RING_SIZE;



    /**
     * Fired when the component first initializes and is ready to function.
     */
    constructor(
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object
    ) { }
    ngOnInit() {
        // Globally declares the canvas element and context
        this.CANVAS = this.MouseCursorCanvas.nativeElement;
        this.CONTEXT = (isPlatformBrowser(this.platform)) ? this.CANVAS.getContext('2d') : null;

        // Sets the initial dimensions for the canvas
        // and initial position of the cursor.
        if (isPlatformBrowser(this.platform)) this.windowResize();

        this.AnimationLoopInstance = new AnimationLoop(this.platform, 60, () => this.animationLoop());
    }


    /**
     * Sets an input to update the status of the ring.
     */
    @Input() set ringStatus(value: string) {
        this.CursorStatus = value;

        if (value === 'holding') {
            this.ActualRingSize = this.MaxRingSize = this.HOLDING_RING_SIZE;
        } else {
            this.ActualRingSize = this.MaxRingSize = this.NORMAL_RING_SIZE;
        }
    }


    /**
     * Sets an input to update the color of the cursor.
     */
    @Input() set cursorColor(color: string) {
        this.CURSOR_COLOR = (color) ? color : "#000000";
    }


    /**
     * Listens for any changes in the window's dimensions
     * and resets the canvas' size to that of the window.
     */
    @HostListener('window:resize') public windowResize() {
        // Sets the dimensions for the canvas
        this.CANVAS.width = this.DOC.documentElement.clientWidth;
        this.CANVAS.height = this.DOC.documentElement.clientHeight;
    }



    /**
     * Listens to any changes to the mouse coordinates inside the window.
     * @param event The mouse event passed by the host listener
     */
    @HostListener('window:mousemove', ['$event'])
    public CursorMove(event: any) {
        // Mouse coordinates
        this.EVClientX = event.clientX;
        this.EVClientY = event.clientY;

        // Determines the maximum size for the ring when the cursor is in the window.
        // If the cursor is hovering an element with the attribute of 'no-ellipse-cursor',
        // the maximum size will be set to 0 in order to hide the cursor.
        let isNoShow = false;
        if (event.path.length > 0) {
            // Loops through the list of elements the cursor
            // is hovering on.
            event.path.forEach((element: HTMLElement) => {
                // If any of those elements have a the attribute of 'no-ellipse-cursor'...
                if (element.tagName && element.getAttributeNames().includes('data-no-ellipse-cursor')) {
                    // ...hides the cursor
                    isNoShow = true;
                }
            });
        }

        // If the cursor is hovering an element with the attribute
        // of 'no-ellipse-cursor', it hides the cursor, otherwise it
        // shows it back.
        this.MaxRingSize = (isNoShow) ? 0 : this.ActualRingSize;
    }



    /**
     * Fires the CursorLeftWindow() function when the cursor
     * leaves the window.
     * @param event The mouse event passed by the host listener
     */
    @HostListener('window:mouseout', ['$event']) public CursorLeftWindow(e: MouseEvent) {
        // ONly perform the changes if the cursor has left the HTML tag
        const from = e.relatedTarget as HTMLElement;

        if (!from || from.nodeName === 'HTML') {
            // Determines the maximum size for the
            // ellipse when the cursor is not in the window
            this.MaxRingSize = 0;
        }
    }


    /**
     * Draws a filled circle that serves as a cursor pointer for the user.
     */
    private drawMousePointer() {
        this.CONTEXT.beginPath();
        this.CONTEXT.ellipse(this.EVClientX, this.EVClientY, this.MAX_POINTER_SIZE, this.MAX_POINTER_SIZE, 0, 0, 2 * Math.PI);
        this.CONTEXT.fillStyle = this.CURSOR_COLOR;
        this.CONTEXT.fill();
    }



    /**
     * Creates an stretched and rotated ellipse that looks like a
     * flexible ring around the cursor pointer.
     * @param x The x position where the ring's center will be placed
     * @param y The Y position where the ring's center will be placed
     * @param maxR Maximum radius for the ring with an stretch of 0
     * @param stretch The factor by which the ring will be stretched
     * @param angle The angle by which the ring will be rotated in order
     * to keep the x-axis aligned with the cursor's path
     */
    private drawRing(x: number, y: number, maxR: number, stretch: number, angle: number) {
        this.CONTEXT.beginPath();
        this.CONTEXT.ellipse(x, y, stretch + maxR, maxR, angle, 0, 2 * Math.PI);
        this.CONTEXT.strokeStyle = this.CURSOR_COLOR;
        this.CONTEXT.stroke();
    }



    /**
     * The function that draws objects in the canvas on
     * every frame refresh. Approximately 60fps.
     */
    private animationLoop() {
        // clears any previous image drawn in the canvas
        this.CONTEXT.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);

        // Draws the cursor pointer
        this.drawMousePointer();

        // Makes the cursor ring to follow the cursor's position
        // at a fraction (determined by this.DRAG_FACTOR) of the
        // of the speed.
        const distX = this.EVClientX - this.ElPos.x;
        const distY = this.EVClientY - this.ElPos.y;
        this.ElPos.x += distX / this.DRAG_FACTOR;
        this.ElPos.y += distY / this.DRAG_FACTOR;

        // Determines how stretched the ellipse will be based
        // on the distance between the ellipse and the cursor
        const delX = (this.EVClientX - this.ElPos.x) * ((this.STRETCH_FACTOR / 100) * 5);
        const delY = (this.EVClientY - this.ElPos.y) * ((this.STRETCH_FACTOR / 100) * 5);
        const distance = Math.sqrt((delX * delX) + (delY * delY));
        let stretch = distance; // For naming convention

        // The angle between the ellipse's last position
        // and the cursor's last position
        const angle = Math.atan(delY / delX);

        // // Uncomment for debugging purposes only
        // this.CONTEXT.font = '24px Arial';
        // this.CONTEXT.fillText(`Angle: ${Math.round(angle)}`, 200, 200);
        // this.CONTEXT.fillText(`X: ${Math.round(delX)}`, 200, 228);
        // this.CONTEXT.fillText(`Y: ${Math.round(delY)}`, 200, 256);

        // To make the mouse disappear when the cursor
        // leaves the window
        const currentRingSize = this.MaxRingSize - this.EndRingSize;
        this.EndRingSize += currentRingSize / this.DRAG_FACTOR;
        // prevents seeing a small dot when the cursor is hidden,
        // but the cursor is still visible.
        if (this.MaxRingSize === 0) { stretch = 0; }

        // draws the cursor ring
        this.drawRing(this.ElPos.x, this.ElPos.y, this.EndRingSize, stretch, angle);
    }
}
