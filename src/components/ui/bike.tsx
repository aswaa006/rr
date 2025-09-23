import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import bikeAnimation from "@/assets/Rider.json";

const FloatingBike = () => {
  return (
    <Player
      autoplay
      loop
      src={bikeAnimation}
      style={{
        display: "block",
        margin: "0 auto",
        width: 500,
        height: 500,
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
};

export default FloatingBike;
