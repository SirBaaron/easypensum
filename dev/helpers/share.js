window.shareTxt = (txt, title = "Easy Pensum") => {
	if("share" in navigator) {
		//use fancy share api
		navigator.share({
			title: title,
			text: txt,
			url: window.location.origin
		})
	}
	else {
		//fallback to WhatsApp
		let url = "whatsapp://send?text=" + encodeURIComponent(txt + window.location.origin);
		window.location = url;
	}
}