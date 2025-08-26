// https://github.com/acdhemtos/EventLess.js/
//                                           EventLess.js

const unlocks = {
	audio: async () => {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		if (ctx.state === "suspended") await ctx.resume();
	},

	camera: async () => {
		await navigator.mediaDevices.getUserMedia({ video: true })
		.then(stream => stream.getTracks().forEach(track => track.stop()));
	},

	clipboard: async () => {
		await navigator.clipboard.writeText(await navigator.clipboard.readText());
	},

	fullscreen: async () => {
		await document.documentElement.requestFullscreen();
		document.exitFullscreen();
	},

	microphone: async () => {
		await navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => stream.getTracks().forEach(track => track.stop()));
	},

	midi: async () => await navigator.requestMIDIAccess(),

	notifications: async () =>	await Notification.requestPermission(),

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
	},

	vibration: async () => navigator.vibrate(1),

	geolocation: async () => {
		await new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject);
		});
	}
};

const permissions = new Set();

const controllers = {};

const events = new Set(["click", "mousedown", "keydown", "touchstart"]);

const eventsCount = {};

class EventLess {
	
	static unlock(permission, onUnlock = function(){}){
		if(!(permission in unlocks)){
			throw new Error(`EventLess.js : Unlock "${permission}" does not exist.`);
		}else{
			if(!permissions.has(permission)){
				if(!(permission in controllers)){
					controllers[permission] = new AbortController();
					eventsCount[permission] = 0;
				}
				for(const e of events){
					const perm = permission;
					document.addEventListener(e, async function(){
						try{
							await unlocks[perm]();
							permissions.add(perm);
							controllers[perm].abort();
							onUnlock();
						}catch{
							--eventsCount[perm];
						}
							
						if(controllers[perm].signal.aborted || eventsCount[perm] <= 0){
							delete controllers[perm];
							delete eventsCount[perm];
						}
					}, { once : true, signal : controllers[permission].signal });
				}
				eventsCount[permission] += events.size;
			}
		}
	}

	static get permissions() {
		return Object.freeze(Array.from(permissions));
	}
	
	static get events(){
		return Object.freeze(Array.from(events));
	}

	static addEvent(eventName) {
		if (events.has(eventName)) {
			console.warn(`EventLess.js : Event "${eventName}" already exists.`);
		} else {
			events.add(eventName);
		}
	}

	static removeEvent(eventName) {
		if (!events.has(eventName)) {
			throw new Error(`EventLess.js : Cannot remove event "${eventName}" because it does not exist.`);
		} else {
			events.delete(eventName);
		}
	}
	
	static get unlocks() {
		return Object.freeze(Object.keys(unlocks));
	}
	
	static addUnlock(name, fn) {
		if (name in unlocks) {
			throw new Error(`EventLess.js : Unlock "${name}" already exists; remove it first to overwrite.`);
		}
		const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
		if (!(fn instanceof AsyncFunction)) {
			throw new TypeError(`EventLess.js : Unlock for "${name}" must be an async function.`);
		}
		unlocks[name] = fn;
	}
	
	static removeUnlock(name) {
		if (!(name in unlocks)) {
			throw new Error(`EventLess.js : Cannot remove unlock "${name}" because it does not exist.`);
		}
		
		if (controllers[name]) {
			controllers[name].abort();
			delete controllers[name];
		}
		
		delete eventsCount[name];
		permissions.delete(name);
			
		delete unlocks[name];
	}
	
}

Object.freeze(EventLess);
Object.freeze(EventLess.prototype);
