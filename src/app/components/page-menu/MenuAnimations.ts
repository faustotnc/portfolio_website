import { Expo, gsap, Power4 } from "gsap";

export const showBackgrounds = (
   leftBoxQuery: gsap.utils.SelectorFunc,
   rightBoxQuery: gsap.utils.SelectorFunc,
   isMobile: boolean
) => {
   gsap.to(leftBoxQuery(".bg"), {
      scaleY: "1",
      transformOrigin: isMobile ? "top center" : "bottom center",
      ease: Power4.easeInOut,
      duration: 1,
   });

   gsap.to(rightBoxQuery(".bg"), {
      scaleY: "1",
      transformOrigin: "top center",
      ease: Power4.easeInOut,
      duration: 1,
   });
};

export const showBoxLinks = (
   leftBoxQuery: gsap.utils.SelectorFunc,
   rightBoxQuery: gsap.utils.SelectorFunc,
   isMobile: boolean
) => {
   gsap.fromTo(
      leftBoxQuery("nav a"),
      {
         translateY: isMobile ? "-100%" : "100%",
      },
      {
         translateY: 0,
         ease: Expo.easeOut,
         duration: 0.5,
         delay: 0.5,
         stagger: 0.1,
         transformOrigin: "bottom center",
      }
   );

   gsap.fromTo(
      rightBoxQuery("ul a"),
      {
         translateY: "-100%",
      },
      {
         translateY: 0,
         ease: Expo.easeOut,
         duration: 0.5,
         delay: 0.5,
         stagger: 0.1,
         transformOrigin: "bottom center",
      }
   );
};

export const showLeftBoxInfo = (boxQuery: gsap.utils.SelectorFunc, isMobile: boolean) => {
   gsap.fromTo(
      boxQuery(".info span"),
      {
         translateY: isMobile ? "-100%" : "100%",
      },
      {
         translateY: 0,
         ease: Expo.easeOut,
         duration: 0.5,
         delay: 0.5,
         stagger: 0.1,
         transformOrigin: "bottom center",
      }
   );
};

export const hideBackgrounds = (
   leftBoxQuery: gsap.utils.SelectorFunc,
   rightBoxQuery: gsap.utils.SelectorFunc,
   isMobile: boolean
) => {
   gsap.to(leftBoxQuery(".bg"), {
      scaleY: 0,
      transformOrigin: isMobile ? "bottom center" : "top center",
      ease: Power4.easeInOut,
      duration: 1,
   });

   gsap.to(rightBoxQuery(".bg"), {
      scaleY: "0",
      transformOrigin: "bottom center",
      ease: Power4.easeInOut,
      duration: 1,
   });
};

export const hideBoxLinks = (
   leftBoxQuery: gsap.utils.SelectorFunc,
   rightBoxQuery: gsap.utils.SelectorFunc,
   isMobile: boolean
) => {
   gsap.to(leftBoxQuery("nav a"), {
      translateY: isMobile ? "100%" : "-100%",
      ease: Power4.easeIn,
      duration: 0.3,
      stagger: 0.05,
      transformOrigin: "top center",
   });

   gsap.to(rightBoxQuery("ul a"), {
      translateY: "100%",
      ease: Power4.easeIn,
      duration: 0.3,
      stagger: 0.05,
      transformOrigin: "top center",
   });
};

export const hideLeftBoxInfo = (boxQuery: gsap.utils.SelectorFunc, isMobile: boolean) => {
   gsap.to(boxQuery(".info span"), {
      translateY: isMobile ? "100%" : "-100%",
      ease: Power4.easeIn,
      duration: 0.3,
      stagger: 0.05,
      transformOrigin: "top center",
   });
};
