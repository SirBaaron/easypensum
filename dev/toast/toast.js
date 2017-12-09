__USE("cssinject.js");

cssinject(`//<-inject:../toast/toast.css->`);

class toastManager extends HTMLElement {
	constructor() {
		super();
		window.addEventListener("click", e => {
			if(e.path.indexOf(this) < 0 && this.childNodes.length > 0) {
				let toasts = [].slice.call(this.childNodes);
				for(let i = 0; i < toasts.length; i++) {
					if(!toasts[i].permanent && toasts[i].dismissWithClick && toasts[i].finishedAnimation) {
						this.remove(toasts[i]);
						return;
					}
				}
			}
		})
	}
	add(toast, duration, permanent, dismissWithClick) {
		this.domAdd(toast);
		toast.permanent = permanent;
		toast.dismissWithClick = dismissWithClick;

		if(!permanent) {
			this.updateTimer(duration, permanent, toast);

			toast.addEventListener("mouseenter", _ => {
				toast.hover = true;
			});
			toast.addEventListener("mouseleave", _ => {
				if(toast.shouldRemove) {
					this.remove(toast);
				}
				toast.hover = false;
			});
		}
	}
	updateTimer(duration, permanent, toast) {
		clearTimeout(toast.timer);
		toast.permanent = permanent;
		if(!permanent) {
			toast.timer = setTimeout(_ => {
				if(toast.hover) {
					toast.shouldRemove = true;
				}
				else {
					this.remove(toast);
				}
			}, duration);
		}
	}
	domAdd(el) {
		this.appendChild(el);
	}
	remove(toast) {
		clearTimeout(toast.timer);
		this.removeChild(toast);
	}
}

class ToastCard extends HTMLElement {
	get template() {
		return `//<-inject:../toast/toast.html->`;
	}

	constructor(txt, action, showAction, spinner, callback) {
		super();
		this.txt = txt;
		this.action = action;
		this.showAction = showAction;
		this.showSpinner = spinner;

		this.innerHTML = this.template;

		this.textEl = this.querySelector("." + classid("toast_text"));
		this.actionEl = this.querySelector("." + classid("toast_action"));
		this.spinnerEl = this.querySelector("." + classid("toast_spinner"));


		this.actionEl.addEventListener("click", _ => {
			this.parentNode.remove(this);
			callback(this);
		});
	}

	update(json) {
		if("text" in json) {
			this.textEl.innerText = json.text;
		}
		if("action" in json) {
			if(json.action !== null) {
				this.actionEl.innerText = json.action;
				this.actionEl.style.display = "initial";
			}
			else {
				this.actionEl.style.display = "none";
			}
		}
		if("spinner" in json) {
			this.spinnerEl.style.display = json.spinner ? "initial" : "none";
		}
		if("duration" in json) {
			this.parentNode.updateTimer(json.duration, (json.duration === true), this);
		}
		if("dismissWithClick" in json) {
			this.dismissWithClick = json.dismissWithClick;
		}
	}

	hide() {
		this.parentNode.remove(this);
	}
}

window.customElements.define("toast-manager", toastManager);
window.customElements.define("toast-card", ToastCard);

class Toast {
	constructor(txt, duration = 2000, spinner = false, dismissWithClick = true, action = null, callback = {}) {
		this.toast = new ToastCard(
			txt,
			(action || ""),
			(action !== null),
			spinner,
			callback
			);
		document.getElementsByTagName("toast-manager")[0].add(
			this.toast,
			duration,
			(duration === true),
			dismissWithClick
			);
	}
	update(json) {
		this.toast.update(json);
	}
	hide() {
		this.toast.hide();
	}
}

document.body.setAttribute("feature-toast", "");