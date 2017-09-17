function loadingOutro() {
	var splashheader = document.getElementById(classid("splashheader"));
	var splashloadinganimation = document.getElementById(classid("splashloadinganimation"));

	const loaderdim = splashloadinganimation.getBoundingClientRect();
	
	splashloadinganimation.style.zIndex = splashheader.style.zIndex = 100;
	splashloadinganimation.style.top = `${loaderdim.top}px`;
	splashloadinganimation.style.left = splashheader.style.left = `${loaderdim.left}px`;
	splashloadinganimation.style.right = splashloadinganimation.style.bottom = splashheader.style.top = splashheader.style.right = "0px";
	splashloadinganimation.style.position = splashheader.style.position = "fixed";

	splashloadinganimation.style.opacity = splashheader.style.opacity = 1;
	splashloadinganimation.style.transition = splashheader.style.transition = "opacity 0.2s linear";
	splashloadinganimation.style.opacity = splashheader.style.opacity = 0;

	const evhandler = e => {
		e.target.style.display = "none";
		splashheader.style.display = "none";
	}


	splashloadinganimation.addEventListener("transitionend", evhandler);
}