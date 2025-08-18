if(!window.EventLess){	// Handle React Hot-Reload
	
	window.EventLess = {};
	
	const unlocks = {
		audio: async function(){
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			if(ctx.state === "suspended"){
				await ctx.resume();
			}
		},
		fullscreen: async function(){
			await document.documentElement.requestFullscreen();
			document.exitFullscreen();
		},
		clipboard: async function(){
			await navigator.clipboard.writeText(await navigator.clipboard.readText());
		},
		pointerlock: async function unlockPointer() {
			await new Promise(resolve => {
				document.addEventListener(
					"pointerlockchange",
					function () {
						document.exitPointerLock();
						resolve();
					},
					{ once: true }
				);
				document.body.requestPointerLock();
			});
		},
		speech: async function(){
			return new Promise(resolve => {
				const utter = new SpeechSynthesisUtterance(" ");
				utter.onend = resolve;
				speechSynthesis.speak(utter);
			});
		}
	};
	
	for(const e of ["click", "mousedown", "keydown", "touchstart"]){
		document.addEventListener(e, function(){
			for(const permission of Object.keys(unlocks)){
				if(EventLess[permission] !== true){
					unlocks[permission]()
					.then(() => { 
						window.EventLess[permission] = true;
						delete unlocks[permission];
					})
					.catch(() => { window.EventLess[permission] = false; })
				}
			}
		}, { once: true });
	}
}
