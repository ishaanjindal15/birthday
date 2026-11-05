
import { useEffect, useRef, useState } from "react";
import "./NightScene.css";

import cafeTerrace from "../../assets/cafe-van-gogh.jpg";
import Stars from "../../components/stars/stars";

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

    // SECTION 1: FIRST MESSAGE

    const momentTimer = setTimeout(() => {
      setShowMoment(true);
    }, 1500);

    // SECTION 2: JOURNEY

    const journeyTimer = setTimeout(() => {
      setShowMoment(false);
      setShowJourney(true);
    }, 11500);

    // SECTION 3: VAN GOGH

    const vanGoghTimer = setTimeout(() => {
      setShowJourney(false);
      setShowVanGogh(true);
    }, 23500);

    // SECTION 4: VIENNA

    const musicTimer = setTimeout(() => {
      setShowVanGogh(false);

      const audio = new Audio("/audio assets/Vienna.mp3");

      audio.volume = 0.35;
      audio.loop = false;

      audioRef.current = audio;

      audio.play().catch(() => {
        console.log("Audio waiting for user interaction.");
      });

      viennaTextTimer = setTimeout(() => {
        setShowViennaText(true);
      }, 1200);

      // Stop Vienna after 1 minute 8 seconds

      stopViennaTimer = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;

        setShowViennaText(false);
        setShowContinue(true);

      }, 68000);

    }, 37500);

    // CLEANUP

    return () => {
      clearTimeout(momentTimer);
      clearTimeout(journeyTimer);
      clearTimeout(vanGoghTimer);
      clearTimeout(musicTimer);
      clearTimeout(viennaTextTimer);
      clearTimeout(stopViennaTimer);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };

  }, []);


  // --------------------------------
  // PRESS ANY KEY OR CLICK TO CONTINUE
  // --------------------------------

  useEffect(() => {
    if (!showContinue) return;

    function handleContinue(event) {
      if (continuedRef.current) return;
    
      if (
        event &&
        ["Shift", "Control", "Alt", "Meta"].includes(event.key)
      ) {
        return;
      }
    
      continuedRef.current = true;
    
      // Start Epilogue music during the user's keypress.
      const epilogueAudio = new Audio("/audio assets/Epilogue.mp3");
      epilogueAudio.volume = 0.45;
      epilogueAudio.loop = false;
    
      epilogueAudio.play().catch((error) => {
        console.error("Epilogue playback failed:", error);
      });
    
      onContinue(epilogueAudio);
    }

    function handleKeyDown(event) {
      handleContinue(event);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [showContinue, onContinue]);


  // --------------------------------
  // CLICK PROMPT
  // --------------------------------

  function handlePromptClick() {
    if (continuedRef.current) return;
  
    continuedRef.current = true;
  
    const epilogueAudio = new Audio("/audio%20assets/Epilogue.mp3");
    epilogueAudio.volume = 0.45;
    epilogueAudio.loop = false;
  
    epilogueAudio.play().catch((error) => {
      console.error("Epilogue playback failed:", error);
    });
  
    onContinue(epilogueAudio);
  }


  // --------------------------------
  // RENDER
  // --------------------------------

  return (
    <section className="night-scene">

      {/* SVG PAINT EFFECT */}

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

        {/* FIRST MESSAGE */}

        {showMoment && (
          <p className="moment-text">
            Take a moment. Breathe.
          </p>
        )}


        {/* SECOND MESSAGE */}

        {showJourney && (
          <p className="journey-text">
            And take it all in — look how far you've come.
          </p>
        )}


        {/* VAN GOGH MESSAGE */}

        {showVanGogh && (
          <p className="vangogh-text">
            Van Gogh created beautiful things in a cell with a very little light
            <br />
            He just did what pleased him the most,thats why nothing could stop him
            <br />
            Because, the beauty and light is already inside you.
          </p>
        )}


        {/* VIENNA MESSAGE */}

        {showViennaText && (
          <p className="vienna-text">
            Oh yeah... remembered a little something of urss 🙃.
          </p>
        )}


        {/* CONTINUE */}

        {showContinue && (
          <div
            className="vienna-continue"
            onClick={handlePromptClick}
            style={{ cursor: "pointer" }}
          >
            <p>
              Press space to begin.
            </p>
          </div>
        )}

      </div>

    </section>
  );
}

export default NightScene;
