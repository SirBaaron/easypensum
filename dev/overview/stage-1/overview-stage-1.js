console.log("loaded #2: ", performance.now());

__USE("scriptinject.js");

__SSR("cascadingscript");

__USE("cssinject.js");

cssinject(`//<-inject:./stage-1.css->`);

__USE("ripple.js");

__USE("cardanimation.js");

__USE("tabsanimation.js");