<div align="center">

# ✂️ Coupon Clipper

## 🎫 Clip Up To The 250 Digital Coupon Limit at K1ng S00pers

<img src="github_assets/clip.png" alt="Coupon Clipper logo"/>

*Never miss a coupon again! Clip all available digital coupons before heading to the store.*

### 🚀 Get the Extension


[<img src="github_assets/chrome-badge.png" alt="Available in Chrome Web Store" width="250"/>](https://chromewebstore.google.com/detail/coupon-clipper/mhlpjojbmabefhmkodfokajcdblpfoca)
&nbsp;
[<img src="github_assets/firefox.svg" alt="Get it on Firefox" width="230"/>](https://addons.mozilla.org/en-GB/firefox/addon/coupon-clipper/)

</div>

### 🎬 Demo Video
https://github.com/user-attachments/assets/0c640df3-955c-4a70-960f-4b99c3e97480

📱It works on Firefox for Android as well!

https://github.com/user-attachments/assets/e26be720-1a69-4005-998b-4e8d6f6b49ea


## 📋 About

We've all been there: you see an item at the grocery store is on sale, if and only if you clipped the digital coupon. Having other things to do you didn't do that, and good luck trying to clip the coupon in store. With the store acting a giant faraday cage, non-working wifi, and a slow mobile site you're going to be stuck paying more.

Instead, just clip all the coupons you can before going to the store with this extension.

## 💻 I Don't Want to Install Your Extension

There's nothing to stop you from pasting this into your browser's developer console. To access your browser's console please [follow this guide](https://elfsight.com/blog/how-to-work-with-developer-console/), then paste this into the console:

```javascript
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
  // final "snap" to absolute bottom (for lazy‐load)
  window.scrollTo(0, getTotalHeight());
  console.log("✅  Reached bottom of page.");

  // Wait a moment for anything new to render
  await sleep(1000);

  // Jump back up to the top
  window.scrollTo(0, 0);
  console.log("⤴️  Jumped back to the top.");
  await sleep(300);

  // Read the "Coupons Clipped"
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
  const allClipButtons = Array.from(document.querySelectorAll("button")).filter(
    (btn) => btn.textContent.trim() === "Clip"
  );

  console.log(`🔍  Found ${allClipButtons.length} "Clip" button(s) on page.`);

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
      `✔️  Clicked "Clip" button #${i + 1}. (Clipped now: ${
        clippedSoFar + 1 || "?"
      })`
    );

    // Wait ~1200 ms ±200 ms before the next click
    await sleep(jitter(1200, 200));
  }

  console.log("🎉  Script finished.");
})();
```


## 🛠 How To Run This For Development

**Firefox:** [Follow this guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing) and select the firefox directory in this repo.

**Chrome:** [Follow this guide](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#:~:text=To%20load%20an%20unpacked%20extension%20in%20developer,Extensions%20at%20the%20bottom%20of%20the%20menu) and select the firefox directory in this repo.
