function runClipper() {
  (async function () {
    function sleep(ms) {
      return new Promise((res) => setTimeout(res, ms));
    }
    // Returns a delay near `base`, plus‐minus up to `variance` ms.
    function jitter(base, variance) {
      return base + (Math.random() * 2 - 1) * variance;
    }

    const SCROLL_STEP = 400; // pixels per scroll
    const SCROLL_BASE_INTERVAL = 300; // nominal ms between scrolls
    const SCROLL_VARIANCE = 100; // ±100 ms jitter
    const MAX_COUPONS = 250; // ±100 ms jitter

    function getTotalHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
    }
    function getViewportBottom() {
      return window.scrollY + window.innerHeight;
    }

    // Gentle scrolling to the bottom of the page to load all coupons
    console.log("⤵️  Scrolling to bottom of page…");
    while (getViewportBottom() < getTotalHeight()) {
      window.scrollBy(0, SCROLL_STEP);
      await sleep(jitter(SCROLL_BASE_INTERVAL, SCROLL_VARIANCE));
    }
    // final “snap” to absolute bottom (for lazy‐load)
    window.scrollTo(0, getTotalHeight());
    console.log("✅  Reached bottom of page.");

    // Wait a moment for anything new to render
    await sleep(1000);

    // Jump back up to the top
    window.scrollTo(0, 0);
    console.log("⤴️  Jumped back to the top.");
    await sleep(300);

    // Read the “Coupons Clipped”
    function getClippedCount() {
      const titles = document.querySelectorAll("div.DashboardTile--title");
      for (let t of titles) {
        if (t.textContent.trim() === "Coupons Clipped") {
          const numDiv = t.nextElementSibling;
          if (numDiv) {
            const val = parseInt(numDiv.textContent.trim(), 10);
            return isNaN(val) ? 0 : val;
          }
        }
      }
      return 0;
    }

    let clippedSoFar = getClippedCount();
    console.log(`🔢  Currently clipped: ${clippedSoFar}`);

    // Clip as many coupons as the website allows
    const allClipButtons = Array.from(
      document.querySelectorAll("button")
    ).filter((btn) => btn.textContent.trim() === "Clip");

    console.log(`🔍  Found ${allClipButtons.length} “Clip” button(s) on page.`);

    for (let i = 0; i < allClipButtons.length; i++) {
      clippedSoFar = getClippedCount();
      if (clippedSoFar >= MAX_COUPONS) {
        console.warn(
          `⚠️  Reached 250 coupons clipped. Stopping at button #${i}.`
        );
        break;
      }

      allClipButtons[i].click();
      console.log(
        `✔️  Clicked “Clip” button #${i + 1}. (Clipped now: ${
          clippedSoFar + 1 || "?"
        })`
      );

      // Wait ~1200 ms ±200 ms before the next click
      await sleep(jitter(1200, 200));
    }

    console.log("🎉  Script finished.");
  })();
}

// Listen for messages from popup.js:
browser.runtime.onMessage.addListener((message, sender) => {
  if (message === "clipCoupons") {
    runClipper();
  }
});
