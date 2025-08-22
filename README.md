# EventLess.js

EventLess.js is a lightweight JavaScript library for unlocking browser APIs that require user interaction or permissions, such as Audio, Camera, Microphone, Clipboard, Fullscreen, and more. It simplifies permission handling and user gesture requirements by listening to common events like `click`, `keydown`, `mousedown` or `touchstart`.

---

## Features

* Unlock browser APIs that normally require user interaction.
* Supports Audio, Camera, Microphone, Clipboard, Fullscreen, Pointer Lock, Notifications, Vibration, Geolocation, Speech, and MIDI.
* Add custom unlocks and custom events.
* Automatically manages event listeners and cleanup.
* Simple API with optional callback on unlock.

---

## Installation

Include the script in your project:

```html
<script src="path/to/eventless.js"></script>
```

Or use ES Modules:

```js
import EventLess from './eventless.js';
```

---

## Usage

### Unlocking Permissions

```js
// Unlock Audio
EventLess.unlock('audio', () => {
  console.log('Audio unlocked!');
});

// Unlock Microphone
EventLess.unlock('microphone', () => {
  console.log('Microphone unlocked!');
});

// Unlock Clipboard
EventLess.unlock('clipboard', () => {
  console.log('Clipboard unlocked!');
});
```

### Adding Custom Unlocks

```js
EventLess.addUnlock('vibratePattern', async () => {
  await navigator.vibrate([200, 100, 200]);
});

EventLess.unlock('vibratePattern', () => {
  console.log('Custom vibration pattern unlocked!');
});
```

### Adding/Removing Events

```js
// Add a new event
EventLess.addEvent('dblclick');

// Remove an event
EventLess.removeEvent('mousedown');
```

### Checking Unlocked Permissions

```js
console.log(EventLess.permissions); // Returns array of unlocked permissions
```

### Removing Unlocks

```js
EventLess.removeUnlock('audio');
```

---

## Predefined Unlocks

* `audio`
* `camera`
* `microphone`
* `clipboard`
* `fullscreen`
* `pointerlock`
* `notifications`
* `vibration`
* `geolocation`
* `speech`
* `midi`

---


## License

This project uses a [custom license](https://github.com/acdhemtos/CustomLicense/blob/main/LICENSE.md) created by acdhemtos.
