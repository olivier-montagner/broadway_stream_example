# broadway_stream_example

Simple example to test Broadway with a video stream from ffmpeg

## Why

I struggled many days before having a working h264 video stream working with Broadway.
It is not necessary that another one loose more time doing the same thing, It is why I decieded to share my tests.
The main difficulty comes from how to genrate and give the stream to Broadway.js.

## How

The example's input is the PC's webcam.
FFmpeg capturs the webcam's stream and forward it as a H264 stream to an HTTP server.
The HTTP server put he stream in a websocket to feed the Broadway player.
It works fo Chrome nd Firefox.

``` 
server <--http(8080)-- browser
and
ffmpeg --http(8081)--> relay <--websocket(8082)--> browser + broadway
```

There is also a version without websocket.
It obviously works wores than the websocket version.

## Installation

```
git clone https://github.com/olivier-montagner/broadway_stream_example.git`

npm install
```

ffmpeg is also needed.
[FFmpeg](https://ffmpeg.org/)

## Launch

In your console:

`node  wsrelay.js`

In your browser:

`http://localhost:8080/view-broadway.html`

In another console (for windows):

ffmpeg -f dshow -i  video="Integrated Webcam" -framerate 25 -video_size 640x480 -pix_fmt yuv420p -c:v libx264 -b:v 2000k -bufsize 1000k -vprofile baseline -tune zerolatency -f rawvideo http://localhost:8081`

`video="Integrated Webcam"` may depend on your hardware.

## Credits

[Broadway](https://github.com/mbebenita/Broadway)
