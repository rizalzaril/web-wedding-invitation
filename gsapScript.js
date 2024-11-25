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
      // start: "top 85%", // Starts animation slightly later for a softer entrance
      toggleActions: "restart pause resume none",
      // markers: true, // Hide markers for a cleaner look
    },
    scale: 1, // Full scale at the end
    opacity: 1, // Full visibility at the end
    duration: 1, // Longer duration for smoother animation
    ease: "power2.out", // Softer easing for smoothness
    display: "block",
    // delay: index * 0.15, // Less delay for more continuity
  });
});

// Select all elements with the class '.col-home-scroll-up'
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
