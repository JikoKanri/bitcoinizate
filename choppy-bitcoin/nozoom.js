(function () {
  const block = (e) => {
    if (e.touches && e.touches.length > 1) e.preventDefault();
  };
  document.addEventListener("touchstart", block, { passive: false });
  document.addEventListener("touchmove", block, { passive: false });
  ["gesturestart", "gesturechange", "gestureend"].forEach((ev) => {
    document.addEventListener(ev, (e) => e.preventDefault());
  });
  document.addEventListener("wheel", (e) => {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });
})();
