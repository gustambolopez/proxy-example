importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");
// todo: update scramjet
importScripts("/scramjet/scramjet.shared.js");
importScripts("/scramjet/scramjet.worker.js");
importScripts("/envade/en.config.js");
importScripts("/envade/en.bundle.js");
importScripts("/envade/en.worker.js");
importScripts("/workerware/workerware.js");
importScripts("/_a/Ext/adblock/alu-adblocker.js");

const uv = new UVServiceWorker();
const ww = new WorkerWare({ debug: true });
const sj = new ScramjetServiceWorker();
const scramjet = sj;

!(async function () {
  await sj.loadConfig();
})();

const envade = new EnvadeServiceWorker();

if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: true,
  });
}

/**
 * adblock from alu (thanks)
 */
if (self.adblockExt && typeof self.adblockExt.filterRequest === "function") {
  ww.use({
    function: self.adblockExt.filterRequest,
    events: ["fetch"],
    name: "Adblock",
  });
}

// vencord using https://github.com/MercuryWorkshop/proxy/blob/master/public/sw.js and workerware
self.vencordjs = "";
self.vencordcss = "";
(async function () {
  try {
    /**
     * injects equicord on discord, barebones for testing
     */
    const js = await fetch("_a/Ext/equicrd/browser.js");
    const css = await fetch("_a/Ext/equicrd/browser.css");
    self.vencordjs = await js.text();
    self.vencordcss = await css.text();
    self.vencord = {
      injectDiscord: async function (e) {
        const url = e.request.url;
        if (
          e.request.method !== "GET" ||
          !url.includes("discord.com") ||
          e.request.destination !== "document"
        )
          return;

        const originalRes = await fetch(e.request);
        const html = (await originalRes.text()).replace(
          /<head[^>]*>/i,
          `$&<script>${self.vencordjs}<\/script><style>${self.vencordcss}</style>`
        );

        const headers = new Headers(originalRes.headers);
        headers.set("content-type", "text/html");

        e.respondWith(
          new Response(html, {
            status: originalRes.status,
            statusText: originalRes.statusText,
            headers,
          })
        );
      },
    };

    ww.use({
      function: self.vencord.injectDiscord,
      events: ["fetch"],
      name: "EquicordInjection",
    });
  } catch (e) {
    console.warn("equicord injection failed", e);
  }
})();
    /**
 * handles the request depending on the type of proxy you selected
 * @param {FetchEvent} e the fetch event passed to the listener 
 */

async function handleRequest(event) {
  if (uv.route(event)) {
    return await uv.fetch(event);
  }

  if (envade.shouldRoute(event)) {
    return envade.handleFetch(event);
  }

  await scramjet.loadConfig();
  if (scramjet.route(event)) {
    return scramjet.fetch(event);
  }

  return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(
    ww
      .run(event)()
      .then(() => handleRequest(event))
  );
});
