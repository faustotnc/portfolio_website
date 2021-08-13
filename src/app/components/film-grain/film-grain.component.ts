import { Component, OnInit, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
    selector: 'fausto-film-grain',
    templateUrl: './film-grain.component.html',
    styleUrls: ['./film-grain.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmGrainComponent implements OnInit {
    @ViewChild('grainCanvas', { static: true }) GrainCanvas!: ElementRef;

    // CANVAS
    public CANVAS!: HTMLCanvasElement;
    public CONTEXT!: CanvasRenderingContext2D;

    // Grain Settings
    patternSize = 256;
    patternScaleX = 1;
    patternScaleY = 1;
    patternRefreshInterval = 60;
    patternAlpha = 24;
    grainDensityPercent = 1;
    refreshRate = 3;
    frameCounter = 0;

    // Canvas information Variables
    public Frame = 0;
    private patternCanvas!: HTMLCanvasElement;
    private patternCtx!: CanvasRenderingContext2D;
    private patternPixelDataLength = this.patternSize * this.patternSize * 4;


    constructor(
        @Inject(PLATFORM_ID) private platform: object,
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(NgZone) private NG_ZONE: NgZone
    ) { }


    ngOnInit() {
        if (isPlatformBrowser(this.platform)) {
            // Dynamic Pattern Size
            this.patternSize = (window.innerWidth / window.innerHeight < 1) ? 100 : (window.innerWidth / window.innerHeight) * 100;

            // Grain pattern
            this.patternCanvas = this.DOC.createElement('canvas')!;
            this.patternCtx = this.patternCanvas.getContext('2d')!;

            // Declares the canvas element and the context globally
            this.CANVAS = this.GrainCanvas.nativeElement;
            this.CONTEXT = this.CANVAS.getContext('2d')!;
            this.CONTEXT.scale(this.patternScaleX, this.patternScaleY);

            // Sets the dimensions for the canvas
            this.CANVAS.width = this.DOC.documentElement.clientWidth;
            this.CANVAS.height = this.DOC.documentElement.clientHeight;

            this.patternCanvas.width = this.patternSize;
            this.patternCanvas.height = this.patternSize;

            this.CreateRandomFilmGrain();
            this.CreateRandomFilmGrain();
            this.DrawFilmGrain();

            this.NG_ZONE.runOutsideAngular(() => {
                const animation = () => {
                    if (this.frameCounter % this.refreshRate == 0) {
                        this.CreateRandomFilmGrain();
                        this.DrawFilmGrain();
                    }

                    this.frameCounter += 1;
                    window.requestAnimationFrame(animation);
                }

                window.requestAnimationFrame(animation);
            });
        }
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
     * Updates the canvas with a new set of
     * random pixels that resemble static noise.
     */
    private CreateRandomFilmGrain() {
        this.patternCtx.clearRect(0, 0, this.patternCanvas.width, this.patternCanvas.height);
        const pattern_img = this.patternCtx.createImageData(this.patternSize, this.patternSize);

        for (let n = 0; n < this.patternPixelDataLength; n += 4 * this.grainDensityPercent) {
            const s = 255 * Math.random();

            pattern_img.data[n] = s;
            pattern_img.data[n + 1] = s;
            pattern_img.data[n + 2] = s;
            pattern_img.data[n + 3] = this.patternAlpha;
        }

        this.patternCtx.putImageData(pattern_img, 0, 0);
    }

    /**
     * Draws the image into the canvas
     */
    private DrawFilmGrain() {
        this.CONTEXT.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);
        this.CONTEXT.fillStyle = this.CONTEXT.createPattern(this.patternCanvas, 'repeat')!;
        this.CONTEXT.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);
    }
}
