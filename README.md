# EventLess.js

**EventLess.js** is a lightweight library to unlock browser permissions (audio, camera, clipboard, notifications, etc.) on the next user gesture, without requiring direct interaction at the time of request. It ensures compliance with browser security policies while simplifying permission handling.

---

## Features

- Unlocks permissions like:
  - Audio (`AudioContext`)
  - Camera & Microphone (`getUserMedia`)
  - Clipboard
  - Fullscreen
  - MIDI
  - Notifications
  - Pointer Lock
  - Speech Synthesis
  - Vibration
  - Geolocation
- Works with any user gesture (`click`, `mousedown`, `keydown`, `touchstart`)
- Cleans up event listeners automatically
- Provides a read-only proxy for checking permission status

---

## Installation

Include via `<script>` tag:

```html
<script src="path/to/EventLess.js"></script>
```

Or import as a module:

```js
import EventLess from './EventLess.js';
```

---

## Usage

### Unlock Permissions

```js
// Unlock audio and clipboard on the next user gesture
EventLess.unlock("audio", "clipboard");
```

The first user interaction will trigger the requested permissions and mark them as unlocked.

### Check Permission Status

```js
if (EventLess.permission.audio) {
    console.log("Audio is unlocked!");
} else {
    console.log("Audio is not unlocked yet.");
}
```

> Note: `EventLess.permission` is read-only. To unlock, always use `EventLess.unlock()`.

### Supported Permissions

| Permission     | Description |
|----------------|-------------|
| `audio`        | Unlocks `AudioContext` for playback |
| `camera`       | Access camera stream temporarily |
| `microphone`   | Access microphone stream temporarily |
| `clipboard`    | Reads and writes to the clipboard |
| `fullscreen`   | Requests and exits fullscreen |
| `midi`         | Access to MIDI devices |
| `notifications`| Requests notification permission |
| `pointerlock`  | Locks pointer briefly |
| `speech`       | Requests speech synthesis permission |
| `vibration`    | Vibrates the device once |
| `geolocation`  | Requests current location |

### Example

```js
// Unlock multiple permissions
EventLess.unlock("audio", "microphone", "notifications");

document.addEventListener('click', () => {
    console.log("Audio unlocked:", EventLess.permission.audio);
    console.log("Microphone unlocked:", EventLess.permission.microphone);
});
```

### Notes

- EventLess works **only on the next user gesture**. Browsers enforce this restriction to prevent silent permission abuse.
- Once unlocked, permissions are cached in `EventLess.permission`.
- Event listeners are automatically removed after triggering, ensuring no memory leaks.

---

## License

This project uses a [custom license](https://github.com/acdhemtos/CustomLicense/blob/main/LICENSE.md) created by acdhemtos.
