if(!window.eventLess){	// Necessary to prevent issues with React Hot-Reload
	window.eventLess = {
		active : false,
		functions : [],
		interval : 100,
		
		add(fn) {
			if (typeof fn === "function") {
				this.functions.push(fn);
			} else {
				console.warn("Only functions can be added to eventLess queue.");
			}
		},

		remove(fn) {
			this.functions = this.functions.filter(f => f !== fn);
		}
	};

	const acceptedStartEvents = ["click", "mousedown", "keydown", "touchstart"];

	

	function eventListener(){
		if(window.eventLess.active === false){  
			window.eventLess.active = true
			
			setInterval(() => {
				while (window.eventLess.functions.length > 0) {
					try {
						window.eventLess.functions.shift()();
					} catch (err) {
						console.error(err);
					}
				}
			}, window.eventLess.interval);
		}
		for(const e of acceptedStartEvents){
			document.removeEventListener(e, eventListener);
		}
	}

	for(const e of acceptedStartEvents){
		document.addEventListener(e, eventListener);
	}
}

