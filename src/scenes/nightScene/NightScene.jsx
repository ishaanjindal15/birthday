
import { useEffect, useRef, useState } from "react";
import "./NightScene.css";

import cafeTerrace from "../../assets/cafe-van-gogh.jpg";
import Stars from "../../components/stars/stars";

const VIENNA_DURATION = 68000;
const FADE_DURATION = 2500;

function NightScene({ onContinue }) {
  const audioRef = useRef(null);
  const continuedRef = useRef(false);

  const [showMoment, setShowMoment] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [showVanGogh, setShowVanGogh] = useState(false);
  const [showViennaText, setShowViennaText] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  // --------------------------------
  // SCENE TIMELINE
  // --------------------------------

  useEffect(() => {
    let viennaTextTimer;
    let stopViennaTimer;
    let fadeInterval;

    const momentTimer = setTimeout(() => {
      setShowMoment(true);
    }, 1500);

    const journeyTimer = setTimeout(() => {
      setShowMoment(false);
      setShowJourney(true);
    }, 11500);

    const vanGoghTimer = setTimeout(() => {
      setShowJourney(false);
      setShowVanGogh(true);
    }, 23500);

    const musicTimer = setTimeout(() => {
      setShowVanGogh(false);

      const audio = new Audio(
        "/audio%20assets/Vienna.mp3"
      );

      audio.volume = 0.35;
      audio.loop = false;
      audioRef.current = audio;

      audio.play().catch((error) => {
        console.error("Vienna playback failed:", error);
      });

      viennaTextTimer = setTimeout(() => {
        setShowViennaText(true);
      }, 1200);

      // After 68 seconds, fade Vienna out over 5 seconds.
      stopViennaTimer = setTimeout(() => {
        const startingVolume = audio.volume;
        const startTime = Date.now();

        fadeInterval = setInterval(() => {
          const progress = Math.min(
            (Date.now() - startTime) / FADE_DURATION,
            1
          );

          audio.volume = startingVolume * (1 - progress);

          if (progress >= 1) {
            clearInterval(fadeInterval);

            audio.pause();
            audio.currentTime = 0;

            setShowViennaText(false);
            setShowContinue(true);
          }
        }, 50);

      }, VIENNA_DURATION);
    }, 37500);

    return () => {
      clearTimeout(momentTimer);
      clearTimeout(journeyTimer);
      clearTimeout(vanGoghTimer);
      clearTimeout(musicTimer);
      clearTimeout(viennaTextTimer);
      clearTimeout(stopViennaTimer);

      clearInterval(fadeInterval);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  // --------------------------------
  // CONTINUE TO ALBUM
  // --------------------------------

  function handleContinue() {
    if (continuedRef.current) return;

    continuedRef.current = true;

    const epilogueAudio = new Audio(
      "/audio%20assets/Epilogue.mp3"
    );

    epilogueAudio.volume = 0.45;
    epilogueAudio.loop = false;

    epilogueAudio.play().catch((error) => {
      console.error("Epilogue playback failed:", error);
    });

    onContinue(epilogueAudio);
  }

  // --------------------------------
  // KEYBOARD CONTINUE
  // --------------------------------

  useEffect(() => {
    if (!showContinue) return;

    function handleKeyDown(event) {
      if (
        ["Shift", "Control", "Alt", "Meta"].includes(event.key)
      ) {
        return;
      }

      handleContinue();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showContinue]);

  // --------------------------------
  // RENDER
  // --------------------------------

  return (
    <section className="night-scene">

      <svg className="paint-effects">
        <defs>
          <filter
            id="oil-breath"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.0035 0.010"
              numOctaves="2"
              seed="8"
              result="paintNoise"
            >
              <animate
                attributeName="baseFrequency"
                dur="22s"
                values="
                  0.0035 0.010;
                  0.0045 0.012;
                  0.003 0.008;
                  0.004 0.011;
                  0.0035 0.010
                "
                repeatCount="indefinite"
              />
            </feTurbulence>

            <feDisplacementMap
              in="SourceGraphic"
              in2="paintNoise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="B"
            >
              <animate
                attributeName="scale"
                dur="18s"
                values="6;11;8;12;6"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      {/* STARS */}

      <div className="night-stars">
        <Stars />
      </div>

      {/* VAN GOGH PAINTING */}

      <div className="painting-wrap">
        <img
          className="cafe-terrace"
          src={cafeTerrace}
          alt="Café Terrace at Night"
        />
      </div>

      {/* TEXT */}

      <div className="night-text">

        {showMoment && (
          <p className="moment-text">
            Take a moment. Breathe.
          </p>
        )}

        {showJourney && (
          <p className="journey-text">
            And take it all in — look how far you've come.
          </p>
        )}

        {showVanGogh && (
          <p className="vangogh-text">
            Van Gogh created beautiful things in a cell with a very little light
            <br />
            He just did what pleased him the most,thats why nothing could stop him
            <br />
            Because, the beauty and light is already inside you.
          </p>
        )}

        {showViennaText && (
          <p className="vienna-text">
            Oh yeah... remembered something of urss 🙃.
          </p>
        )}

        {showContinue && (
          <div
            className="vienna-continue"
            onClick={handleContinue}
            style={{ cursor: "pointer" }}
          >
            <p>Press space to begin.</p>
          </div>
        )}

      </div>
    </section>
  );
}

export default NightScene;
