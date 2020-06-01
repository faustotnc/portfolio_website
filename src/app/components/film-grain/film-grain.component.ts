import { Component, OnInit, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

import { AnimationLoop } from '../../animation-loop';

@Component({
    selector: 'fausto-film-grain',
    templateUrl: './film-grain.component.html',
    styleUrls: ['./film-grain.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilmGrainComponent implements OnInit {
    @ViewChild('grainCanvas', { static: true }) GrainCanvas: ElementRef;

    // CANVAS
    public CANVAS: HTMLCanvasElement;
    public CONTEXT: CanvasRenderingContext2D;

    // Grain Settings
    patternSize = 256;
    patternScaleX = 1;
    patternScaleY = 1;
    patternRefreshInterval = 30;
    patternAlpha = 40;
    grainDensityPercent = 3;

    // Canvas information Variables
    public Frame = 0;
    patternCanvas = this.DOC.createElement('canvas');
    patternCtx: any;
    patternData: any;
    patternPixelDataLength = this.patternSize * this.patternSize * 4;


    constructor(
        @Inject(PLATFORM_ID) private platform: object,
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(NgZone) private NG_ZONE: NgZone
    ) { }
    ngOnInit() {
        if (isPlatformBrowser(this.platform)) {
            // Grain pattern
            this.patternCtx = this.patternCanvas.getContext('2d');
            this.patternData = this.patternCtx.createImageData(this.patternSize, this.patternSize);

            // Declares the canvas element and the context globally
            this.CANVAS = this.GrainCanvas.nativeElement;
            this.CONTEXT = this.CANVAS.getContext('2d');
            this.CONTEXT.scale(this.patternScaleX, this.patternScaleY);

            // Sets the dimensions for the canvas
            this.CANVAS.width = this.DOC.documentElement.clientWidth;
            this.CANVAS.height = this.DOC.documentElement.clientHeight;

            this.patternCanvas.width = this.patternSize;
            this.patternCanvas.height = this.patternSize;


            this.NG_ZONE.runOutsideAngular(() => {
                // The refresh loop
                const loop = new AnimationLoop(this.platform, this.patternRefreshInterval, () => {
                    this.CreateRandomFilmGrain();
                    this.DrawFilmGrain();
                });
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
        const t = this.patternData;
        for (let n = 0; n < this.patternPixelDataLength; n += 4 * this.grainDensityPercent) {
            const s = 255 * Math.random();
            t.data[n] = s;
            t.data[n + 1] = s;
            t.data[n + 2] = s;
            t.data[n + 3] = this.patternAlpha;
        }
        this.patternCtx.putImageData(t, 0, 0);
    }



    /**
     * Draws the image into the canvas
     */
    private DrawFilmGrain() {
        this.CONTEXT.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);
        this.CONTEXT.fillStyle = this.CONTEXT.createPattern(this.patternCanvas, 'repeat'),
            this.CONTEXT.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);
    }
}
