export const logistic_ramp = (x: number, min: number, max: number, speed: number, threshold = 1) => {
   const beta = max - min;
   const lambda = (x - max - threshold - min) / speed;
   return beta / (1 + Math.exp(lambda)) + min / beta;
};

export const calculateVH = () => {
   // First we get the viewport height and we multiply it by 1% to get a value for one vh unit
   const vh = document.documentElement.clientHeight * 0.01;
   // Then we set the value in the --vh custom property to the root of the document
   document.documentElement.style.setProperty("--vh", `${vh}px`);
};
