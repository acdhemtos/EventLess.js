const unlocks = {
	audio: async () => {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		if (ctx.state === "suspended") await ctx.resume();
	},
	clipboard: async () => {
		await navigator.clipboard.writeText(await navigator.clipboard.readText());
	},
	fullscreen: async () => {
		await document.documentElement.requestFullscreen();
		document.exitFullscreen();
	},
	pointerlock: async () => {
		await new Promise(resolve => {
			document.addEventListener(
				"pointerlockchange",
				function () { document.exitPointerLock(); resolve(); },
				{ once: true }
			);
			document.body.requestPointerLock();
		});
	},
	speech: async () => {
		return new Promise(resolve => {
			const utter = new SpeechSynthesisUtterance(" ");
			utter.onend = resolve;
			speechSynthesis.speak(utter);
		});
	}
};

class EventLess {
	static #status = {};
	static #controllers = {};
	static #events = ["click", "mousedown", "keydown", "touchstart"];
	static #eventCount = {};
	
	static isUnlocked(permission){
		return EventLess.#status["permission"];
	}
	
	static unlock(...requested){
		for(const permission of requested){
			if(!(permission in unlocks)){
				console.error("EventLess.js does not support permission : "+permission);
			}else{
				if(!EventLess.#status[permission]){
					if(!(permission in EventLess.#controllers)){
						EventLess.#controllers[permission] = new AbortController();
						EventLess.#eventCount[permission] = 0;
					}
					for(const e of EventLess.#events){
						const perm = permission;
						document.addEventListener(e, function(){
							unlocks[perm]()
							.then(() => {
								EventLess.#status[perm] = true;
								EventLess.#controllers[perm].abort();
								
								delete EventLess.#controllers[perm];
								delete EventLess.#eventCount[perm];
							})
							.catch(() => {
								EventLess.#status[perm] = false;
								
								if(--EventLess.#eventCount[perm] == 0){
									delete EventLess.#controllers[perm];
									delete EventLess.#eventCount[perm];
								}
							})
						}, { once : true, signal : EventLess.#controllers[permission].signal });
					}
					EventLess.#eventCount[permission] += EventLess.#events.length;
				}
			}
		}
	}
}
