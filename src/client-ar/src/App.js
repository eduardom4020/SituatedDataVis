import './App.css';
import React from "react";
import { AFrameRenderer, Marker } from "react-web-ar";

function App() {
  return (
    <>
      <AFrameRenderer arToolKit={{ sourceType: "webcam" }}>
      <a-entity id="cameraRig">
        <a-camera id="camera">
        </a-camera>
        <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: .screen"></a-entity>
        <a-entity laser-controls raycaster="objects: .screen;"></a-entity>
      </a-entity>
        <Marker parameters={{ preset: "hiro" }}>
          {/* <a-box
            color="blue"
            material="opacity: 1;"
            position="0 0.09 0"
            scale="0.4 0.8 0.8"
          >
            <a-animation
              attribute="rotation"
              to="360 0 0"
              dur="5000"
              easing="linear"
              repeat="indefinite"
            />
          </a-box> */}
          <a-entity position="0 0.09 0" rotation="-90 0 0" htmlembed>
            <button id="button" onclick="alert('leave button is clicked')">Leave</button>
            <p></p>
            <svg id="svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill='red'/>
            </svg>
          </a-entity>
        </Marker>
      </AFrameRenderer>
    </>
  );
}

export default App;
