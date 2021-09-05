const setScreenHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

setScreenHeight();

// We listen to the resize event
window.addEventListener("resize", setScreenHeight);
