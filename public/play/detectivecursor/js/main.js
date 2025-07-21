gsap.set(".flair", {xPercent: -50, yPercent: -50});

window.addEventListener("mousemove", e => {  
  
  gsap.to('.flair', {
    x: e.x,
    y: e.y,
    duration: 2,
    ease: "power4.out" 
  })
});