import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import style from "./VideoComponent.module.css";
import { useEffect, useRef, useState } from "react";

interface VideoComponentProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  participantIdentity: string;
  local?: boolean;
}

function VideoComponent({
  track,
  participantIdentity,
  local = false,
}: VideoComponentProps) {
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const [isScaled, setIsScaled] = useState(false);

  useEffect(() => {
    if (videoElement.current) {
      track.attach(videoElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <div
      id={"camera-" + participantIdentity}
      className={`${style.videoContainer} ${isScaled ? style.ScaleVideo : ""}`}
      onClick={() => {
        setIsScaled((prev) => !prev);
      }}
    >
      <div className={style.participantData}>
        <p>{participantIdentity + (local ? " (You)" : "")}</p>
      </div>
      <video ref={videoElement} id={track.sid}></video>
    </div>
  );
}

export default VideoComponent;
