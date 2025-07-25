importScripts('/uv/uv.bundle.js')
importScripts('/uv/uv.config.js')
importScripts('/uv/uv.sw.js')
importScripts('/scramjet/scramjet.shared.js')
importScripts('/scramjet/scramjet.worker.js')
importScripts('/envade/en.config.js');
importScripts('/envade/en.bundle.js');
importScripts('/envade/en.worker.js');
importScripts('/eclipse/eclipse.codecs.js');
importScripts('/eclipse/eclipse.config.js');
importScripts('/eclipse/eclipse.rewrite.js');
importScripts('/eclipse/eclipse.worker.js');


const uv = new UVServiceWorker();
const scramjet = new ScramjetServiceWorker();
const envade = new EnvadeServiceWorker(); 
const eclipse = new EclipseServiceWorker();


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

  if (eclipse.route(event)) {
    return await eclipse.fetch(event);
  }

  return await fetch(event.request);
}

self.addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});
