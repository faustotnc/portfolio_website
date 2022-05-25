export class GrainScene {
   // CANVAS
   private CANVAS: HTMLCanvasElement;
   private CONTEXT: CanvasRenderingContext2D;

   // Grain Settings
   private patternSize = 256;
   private patternAlpha = window.devicePixelRatio < 3 ? 40 : 12;
   private grainDensityPercent = 1;

   // Canvas information Variables
   private patternCanvas = document.createElement("canvas");
   private patternCtx = this.patternCanvas.getContext("2d")!;
   private patternPixelDataLength = this.patternSize * this.patternSize * 4;

   constructor(canvas: HTMLCanvasElement) {
      // Declares the canvas element and the context globally
      this.CANVAS = canvas;
      this.CONTEXT = this.CANVAS.getContext("2d")!;

      // Sets the dimensions for the canvas
      this.CANVAS.width = document.documentElement.clientWidth;
      this.CANVAS.height = document.documentElement.clientHeight;

      this.patternCanvas.width = this.patternSize;
      this.patternCanvas.height = this.patternSize;

      // Renders the grain effect
      const animate = () => {
         this.CreateRandomFilmGrain();
         this.DrawFilmGrain();
         requestAnimationFrame(animate);
      };

      animate();
   }

   /**
    * Listens for any changes in the window's dimensions
    * and resets the canvas' size to that of the window.
    */
   public windowResize() {
      // Sets the dimensions for the canvas
      this.CANVAS.width = document.documentElement.clientWidth;
      this.CANVAS.height = document.documentElement.clientHeight;
   }

   /**
    * Updates the canvas with a new set of
    * random pixels that resemble static noise.
    */
   private CreateRandomFilmGrain() {
      this.patternCtx.clearRect(0, 0, this.patternCanvas.width, this.patternCanvas.height);
      const pattern_img = this.patternCtx.createImageData(this.patternSize, this.patternSize);

      for (let n = 0; n < this.patternPixelDataLength; n += this.grainDensityPercent + 3) {
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
      this.CONTEXT.fillStyle = this.CONTEXT.createPattern(this.patternCanvas, "repeat")!;
      this.CONTEXT.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);
   }
}
