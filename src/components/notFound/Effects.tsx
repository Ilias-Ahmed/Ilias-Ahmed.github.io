import React from "react";
import {
  EffectComposer,
  Bloom,
  Noise,
  ChromaticAberration,
  Glitch,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

interface EffectsProps {
  isGlitching: boolean;
}

const Effects: React.FC<EffectsProps> = ({ isGlitching }) => {
  try {
    return (
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
        />
        <Noise opacity={0.1} blendFunction={BlendFunction.OVERLAY} />
        <ChromaticAberration
          offset={isGlitching ? [0.01, 0.01] : [0.002, 0.002]}
        />
        <Glitch
          delay={new Vector2(1.5, 3.5)}
          duration={new Vector2(0.1, 0.3)}
          strength={
            isGlitching ? new Vector2(0.3, 0.6) : new Vector2(0.01, 0.02)
          }
          mode={1}
          active={true}
        />
      </EffectComposer>
    );
  } catch (error) {
    console.error("Error in Effects component:", error);
    return null;
  }
};

export default Effects;
