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
    <li>PHP \</li>
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
    <li>Only English and Klingon have the user interface localized, I can't speak the other languages :(</li>
    <li>Speech language support depends on the operating system, however, the user probably has the operating system in their native language</li>
</ul>

<h4>License</h4>
<pre>
Wallpaper is licensed under a non commercial use license from http://digwall.com/10289/earth.html,
code itself is licensed under the MIT license.

The MIT License (MIT)

Copyright (c) 2014 Wilson Cheng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</pre>