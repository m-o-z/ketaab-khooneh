(() => {
  if (typeof window === "undefined") {
    return;
  }

  const body = document.querySelector("body");
  if (!body) {
    return;
  }

  let previousVisualViewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;

  function handleVisualViewportResize() {
    const currentVisualViewportHeight = window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

    if (currentVisualViewportHeight) {
      body.style.setProperty("--height", `${currentVisualViewportHeight}px`);
      body.style.setProperty("height", `${currentVisualViewportHeight}px`);
    }

    previousVisualViewportHeight = currentVisualViewportHeight;
  }

  // Check if visualViewport is supported, then add listener
  if (window.visualViewport) {
    window.visualViewport.addEventListener(
      "resize",
      handleVisualViewportResize,
    );
    // Initial call
    handleVisualViewportResize();
  } else {
    window.addEventListener("resize", handleVisualViewportResize);
    handleVisualViewportResize();
  }
})();
