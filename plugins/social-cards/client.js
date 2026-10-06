// Remount our final Head after a lazy route has committed its own metadata.
export function onRouteDidUpdate() {
  window.dispatchEvent(new Event('prism:route-metadata-ready'));
}
