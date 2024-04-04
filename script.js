// Check if the page has loaded
// Create a promise that resolves after a minimum time of 5 seconds
const minDurationPromise = new Promise((resolve) => setTimeout(resolve, 5000));

// Create a promise that resolves when the window has loaded
const windowLoadPromise = new Promise((resolve) => (window.onload = resolve));

// Use Promise.all to wait for both promises to resolve
Promise.all([minDurationPromise, windowLoadPromise]).then(() => {
  // Both conditions are met: 5 seconds have passed and the window has loaded
  endLoaderAnimation(); // Proceed to end the loading animation
});

// variables
let customEase =
  "M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1";
let counter = {
  value: 0,
};
let loaderDuration = sessionStorage.getItem("visited") !== null ? 1 : 5; // 5 seconds for first time, 2 for repeat visits

// Update session to indicate the site has been visited
sessionStorage.setItem("visited", "true");

function updateLoaderText() {
  let progress = Math.round(counter.value);
  $(".loader_number").text(progress);
}
function endLoaderAnimation() {
  //   $(".trigger").click();
  // End loader animation and start next animation
  $(".loader").fadeOut(); // Hide loader
  textSplitAnimation(); // Start next animation
}

let tl = gsap.timeline({
  onComplete: endLoaderAnimation,
});
tl.to(counter, {
  value: 100,
  onUpdate: updateLoaderText,
  duration: loaderDuration,
  ease: CustomEase.create("custom", customEase),
});
tl.to(
  ".loader_progress",
  {
    width: "100%",
    duration: loaderDuration,
    ease: CustomEase.create("custom", customEase),
  },
  0
);

let hasTextSplitAnimationRun = false;

function textSplitAnimation() {
  if (hasTextSplitAnimationRun) return;

  hasTextSplitAnimationRun = true;

  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span",
  });

  // Link timelines to scroll position
  function createScrollTrigger(triggerElement, timeline) {
    // Reset tl when scroll out of view past bottom of screen
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      },
    });
    // Play tl when scrolled into view (60% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 60%",
      onEnter: () => timeline.play(),
    });
  }

  $("[letters-fade-in]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), {
      opacity: 0,
      duration: 0.2,
      ease: "power1.out",
      stagger: { amount: 0.8 },
    });
    createScrollTrigger($(this), tl);
  });

  $("[letters-fade-in-random]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), {
      opacity: 0,
      duration: 0.05,
      ease: "power1.out",
      stagger: { amount: 0.4, from: "random" },
    });
    createScrollTrigger($(this), tl);
  });

  // Avoid flash of unstyled content
  gsap.set("[text-split]", { opacity: 1 });
}
