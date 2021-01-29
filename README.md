# broadway_stream_example
Simple example to use Broadway with a video stream from ffmpeg

# Why

I struggled manty days before having a working h264 vedeo stream working with Bradway.
It is not necessary that another one loose more doing th same, It is why I decieded to share my results.
The main difficulty comes from how to genrate and give the stream to Broadway.js.

## How

``` 
server <--http(8080)-- browser
and
ffmpeg --http(8081)--> relay <--websocket(8082)--> browser
```

There is also a version without websocket.
It works wores the the websocket version.

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

`.\ffmpeg.exe -f dshow -i  video="Integrated Webcam" -framerate 25 -video_size 640x480 -pix_fmt yuv420p -c:v libx264 -b:v 2000k -bufsize 1000k -vprofile baseline -tune zerolatency -f rawvideo http://localhost:8081`

`video="Integrated Webcam"` may depend on your hardware.

## Credits

[Broadway](https://github.com/mbebenita/Broadway)
