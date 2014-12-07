<h3>UniTranslate</h3>

<p>
This is a demo of a not quite real-time video and audio communication system with automatic
translation. Features include text to speech and speech to text so that any user can 
communicate using the language they are most comfortable with.

This web app is fully compatible with Chrome and webkit browsers as it makes 
use of the new tts/dictation API found in those browsers. It will fall back gracefully in
Firefox, but tts/dictation will not work.
</p>

<h4>Requirements</h4>
<b>Server</b>
<ul>
    <li>Web server of some sort</li>
    <li>Postgresql</li>
    <li>PHP</li>
    <li>PHP modules for CURL and Postgresql</li>
    <li>PubNub PHP SDK</li>
    <li>PHP 
</ul>

<b>Other requirements</b>
<ul>
    <li>A PubNub API key</li>
    <li>Microsoft Translator API</li>
    <li>Page must be served over SSL</li>
</ul>

<h4>Notes</h4>
<ul>
    <li>The browser will not speak to you if the message is in the same language you speak - that'd be crazy</li>
    <li>Video calls will not work if the browser that first connected does not have a webcam or is prevented from accessing it<li>
    <li>The above is also true for audio calls if the browser is prevented from accessing the microphone</li>
</ul>