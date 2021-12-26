import { isPlatformBrowser } from '@angular/common';

/**
 * An object with extra information about the
 * state of the loop.
 */
export interface LoopEvent {
    currentFrame: number;
    runtime: number;
}


/**
 * Animation loop
 */
export class AnimationLoop {
    /**
     * Creates an animation loop
     *
     * @param platform The platform in which the app is running
     * @param framerate The frame-rate to run the animation loop
     * @param callback The callback to run at each frame update
     */
    constructor(platform: object, framerate: number, callback: () => void) {
        this.platform = platform;
        this.start(framerate, callback);
    }


    private platform: object;


    // The function that will be executed recursively.
    private CallBackFunction: (loopEventObject: LoopEvent) => void;

    // The ID of the loop's instance
    private LOOP_ID: number;

    // The frame at which the animation was paused
    private pausedFrameNumber = 0;

    private frameRate = 0;
    private runningFrame = 0;
    private initTime = new Date();

    // An object with extra information about the
    // state of the loop.
    private readonly LoopEventObject: LoopEvent = {
        currentFrame: 0,
        runtime: 0
    };

    public LoopState = 'stop';
    public currentFrame = 0;


    // Cross browser animation frame request
    private readonly REQUEST_ANIMATION_FRAME = (loop: () => void) => {
        if (isPlatformBrowser(this.platform)) return requestAnimationFrame(loop);
    }

    // Cross browser animation frame cancellation
    private readonly CANCEL_ANIMATION_FRAME = (loop: number) => {
        if (isPlatformBrowser(this.platform) && cancelAnimationFrame) {
            cancelAnimationFrame(loop);
        }
    }


    /**
     * Starts animation loop
     */
    private start(frameRate: number, callback: (loopEventObject: LoopEvent) => void) {
        if (isPlatformBrowser(this.platform)) {
            this.frameRate = (frameRate >= 60 || frameRate <= 0 || frameRate === undefined) ? 30 : frameRate;
            this.CallBackFunction = callback;


            if (this.LoopState !== 'running') {
                const loop = () => {
                    // How many frames have passed since the class was initialized
                    this.runningFrame += 1;
                    // Only executes the callback function this.frameRate times per second.
                    if (this.runningFrame % (60 / this.frameRate) === 0) {
                        // Updates the current frame.
                        this.LoopEventObject.currentFrame = this.currentFrame += 1;
                        // Executes the callback.
                        this.CallBackFunction(this.LoopEventObject);
                    }
                    // Updates the runtime
                    this.LoopEventObject.runtime = (new Date().getSeconds()) - this.initTime.getSeconds();
                    // Initializes the recursion.
                    this.LOOP_ID = this.REQUEST_ANIMATION_FRAME(loop);
                };
                this.LOOP_ID = this.REQUEST_ANIMATION_FRAME(loop);
                // Sets the state to running.
                this.LoopState = 'running';
            } else {
                console.warn('Loop is already running');
            }
        }
    }


    /**
     * Stops animation loop
     */
    public stop() {
        if (this.LoopState !== 'stopped') {
            this.CANCEL_ANIMATION_FRAME(this.LOOP_ID);
            this.LoopEventObject.currentFrame = 0;
            this.LoopState = 'stopped';
        }
    }


    /**
     * Pauses animation loop
     */
    public pause() {
        if (this.LoopState !== 'paused' && this.LoopState !== 'stopped') {
            this.pausedFrameNumber = this.LoopEventObject.currentFrame;
            this.stop();
            this.LoopEventObject.currentFrame = this.pausedFrameNumber;
            this.LoopState = 'paused';
        }
    }
}
