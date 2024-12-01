gsap.registerPlugin(ScrollTrigger);

// Select all elements with the class .photo
document
  .querySelectorAll(".transition-flip-360")
  .forEach((transitionflip360) => {
    gsap.to(transitionflip360, {
      scrollTrigger: {
        trigger: transitionflip360,
        scrub: false,
        // markers: true,
        toggleActions: "restart pause resume none",
      },
      y: 5,
      rotationY: 180, // Flip backward
      duration: 0.5,
      onComplete: () => {
        // After flipping backward, flip forward
        gsap.to(transitionflip360, {
          rotationY: 0, // Flip forward
          duration: 0.5,
          scrollTrigger: {
            trigger: transitionflip360,
            scrub: false,
            markers: false,
          },
        });
      },
    });
  });

gsap.registerPlugin(ScrollTrigger);

// JavaScript with GSAP
gsap.utils.toArray(".transition-scale-scroll").forEach((element, index) => {
  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      // start: "top 85%", //
      toggleActions: "restart pause resume none",
      // markers: true,
    },
    scale: 1,
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    display: "block",
    // delay: index * 0.15,
  });
});

document.querySelectorAll(".col-home-scroll-up").forEach((element) => {
  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      // start: "top center bottom",
      // scrub: true,
      // markers: true,
      toggleActions: "restart none restart none",
    },
    x: 0,
    opacity: 1,
    duration: 1,
  });
});

gsap.to(".col-home-scroll-down", {
  scrollTrigger: {
    trigger: ".col-home-scroll-down",
    // start: "top center bottom",
    //scrub: true,
    // markers: true,
    toggleActions: "restart none restart none",
  },
  x: 0,
  opacity: 1,
  duration: 1,
});
