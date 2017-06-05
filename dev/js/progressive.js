var style = document.createElement("style");
style.textContent = `
	//<-inject:../css/ripple.css->
	//<-inject:../css/progressive.css->
	//<-inject:../css/cardanimation.css->
`;
document.head.appendChild(style);

//<-inject:ripple.js->

//<-inject:cardanimation.js->