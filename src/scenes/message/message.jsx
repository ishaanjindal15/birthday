import { useEffect, useRef, useState } from "react";
import "./message.css";

const DISPLAY_DURATION = 30 * 1000;
const FADE_DURATION = 3000;

export default function Message() {
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 100);
  
    const hideTimer = setTimeout(() => {
      setFadingOut(true);
  
      const audio = new Audio(
        "/audio%20assets/sweet%20nothing.mp3"
      );
  
      audio.volume = 0;
      audioRef.current = audio;
  
      audio.play()
        .then(() => {
          let volume = 0;
  
          // Fade music in
          const fadeIn = setInterval(() => {
            volume += 0.02;
            audio.volume = Math.min(volume, 0.45);
  
            if (volume >= 0.45) {
              clearInterval(fadeIn);
            }
          }, 100);
  
          // Play for 63 seconds, then fade out
          setTimeout(() => {
            clearInterval(fadeIn);
  
            let fadeVolume = audio.volume;
  
            const fadeOut = setInterval(() => {
              fadeVolume -= 0.015;
              audio.volume = Math.max(fadeVolume, 0);
  
              if (fadeVolume <= 0) {
                clearInterval(fadeOut);
                audio.pause();
                audio.currentTime = 0;
  
                setShowEnding(true);
              }
            }, 100);
          }, 63000);
        })
        .catch((error) => {
          console.error("Sweet Nothing playback failed:", error);
        });
    }, DISPLAY_DURATION);
  
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
  
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);


  return (
    <main className="message-scene">
      <div
        className={`message-content ${
          visible ? "message-visible" : ""
        } ${fadingOut ? "message-fading-out" : ""}`}
      >
        <p>Hey sweetiee,</p>

        <p>Happpiestt birrthdaayyyy!!! &lt;3</p>

        <p>
          So firstly, I hopee you find happiness and pleasure
          in all the little things that life gives youu, and
          that you're not too hard on yourself.
        </p>

        <p>
          One more thing I've always wanted to sayy. Since we
          spent a lot of years apart, there were a lot of things
          I left undone and unsaid. Things I could've done differently.
        </p>

        <p>
          But even after all this time, God gave me another
          chance to be your friend and get to know you better.
        </p>

        <p>
          So yeah, this is me trying to make up for a little
          of that lost time, in whatever little ways I can.
        </p>

        <p>
          This little thing is a piece of me, made just for you.
          I hopee you liked my little effort to make you happy
          and smilee. ♡
        </p>
      </div>

            {showEnding && (
        <div className="cinematic-ending">
          <div className="ending-sunflower">🌻</div>

          <h1>THE END.</h1>

          <p>♡</p>
        </div>
      )}
    </main>
  );
}