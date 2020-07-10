import { getLCP, getCLS, getFID } from "web-vitals";
// import { createApiReporter } from "web-vitals-reporter";

export default function install(Vue) {
  // // checking if google analytics is available or not (GA / GTAG / GTM)
  const isGA = Vue.$gtag || Vue.$ga || Vue.$gtm || Vue.gtm || false;
  const sendToConsole = function(matrix) {
    console.log(Object.assign(matrix, { device: getInformation() }));
  };
  const sendToGtag = function({ name, delta, id }) {
    this.$gtag.event("measurement", {
      device: getInformation,
      event_category: "Web Vitals",
      event_action: name,
      // Google Analytics metrics must be integers, so the value is rounded.
      // For CLS the value is first multiplied by 1000 for greater precision
      // (note: increase the multiplier for greater precision if needed).
      value: Math.round(name === "CLS" ? delta * 1000 : delta),
      // The `id` value will be unique to the current page load. When sending
      // multiple values from the same page (e.g. for CLS), Google Analytics can
      // compute a total by grouping on this ID (note: requires `eventLabel` to
      // be a dimension in your report).
      event_label: id,
      // Use a non-interaction event to avoid affecting bounce rate.
      non_interaction: true,
      event_callback: function() {
        console.log("data send to ganalytics");
      },
    });
  }.bind(Vue);

  function getInformation() {
    const nav = typeof navigator === "undefined" ? false : navigator;
    const conn = nav && nav.connection ? nav.connection : false;
    return {
      URL: location ? location.href : null,
      UA: nav ? nav.userAgent : null,
      RAM: nav ? `${nav.deviceMemory} GB` : undefined,
      CPU: nav ? `${nav.hardwareConcurrency} core` : undefined,
      network: conn
        ? {
            effectiveType: conn.effectiveType, // 3G, 4G
            rtt: conn.rtt, // network time
            downlink: conn.downlink, // always capped at 10Mbps in chromium based browser
          }
        : undefined,
    };
  }
  const reporter = !isGA ? sendToConsole : sendToGtag;
  getLCP(reporter);
  getFID(reporter);
  getCLS(reporter);
}
