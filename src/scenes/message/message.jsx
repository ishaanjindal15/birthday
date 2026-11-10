
import { useEffect, useRef, useState } from "react";
import "./message.css";

const DISPLAY_DURATION = 38 * 1000;
const POEM_DELAY = 18 * 1000;
const FADE_DURATION = 3000;
const SONG_DURATION = 63 * 1000;

export default function Message() {
  const [visible, setVisible] = useState(false);
  const [showPoem, setShowPoem] = useState(false);
  const [poemVisible, setPoemVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [showEnding, setShowEnding] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    let messageTimer;
    let poemTimer;
    let transitionTimer;
    let songTimer;
    let endingTimer;
    let fadeInInterval;
    let fadeOutInterval;

    // Show personal message.
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 100);

    // After 30 seconds, fade out personal message.
    messageTimer = setTimeout(() => {
      setFadingOut(true);

      transitionTimer = setTimeout(() => {
        setShowPoem(true);

        requestAnimationFrame(() => {
          setPoemVisible(true);
        });

        // Keep poem visible. Start music after 18 seconds.
        poemTimer = setTimeout(() => {
          const audio = new Audio(
            "/audio%20assets/sweet%20nothing.mp3"
          );

          audio.volume = 0;
          audioRef.current = audio;

          audio.play()
            .then(() => {
              let volume = 0;

              // Fade music in.
              fadeInInterval = setInterval(() => {
                volume = Math.min(volume + 0.02, 0.45);
                audio.volume = volume;

                if (volume >= 0.45) {
                  clearInterval(fadeInInterval);
                }
              }, 100);

              // Play music for 63 seconds.
              songTimer = setTimeout(() => {
                clearInterval(fadeInInterval);

                const startingVolume = audio.volume;
                const startTime = Date.now();

                // Fade music out over 3 seconds.
                fadeOutInterval = setInterval(() => {
                  const progress = Math.min(
                    (Date.now() - startTime) / FADE_DURATION,
                    1
                  );

                  audio.volume = startingVolume * (1 - progress);

                  if (progress >= 1) {
                    clearInterval(fadeOutInterval);

                    audio.pause();
                    audio.currentTime = 0;

                    // Only now does the poem fade away.
                    setPoemVisible(false);

                    endingTimer = setTimeout(() => {
                      setShowPoem(false);
                      setShowEnding(true);
                    }, FADE_DURATION);
                  }
                }, 50);
              }, SONG_DURATION);
            })
            .catch((error) => {
              console.error(
                "Sweet Nothing playback failed:",
                error
              );
            });
        }, POEM_DELAY);
      }, FADE_DURATION);
    }, DISPLAY_DURATION);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(messageTimer);
      clearTimeout(transitionTimer);
      clearTimeout(poemTimer);
      clearTimeout(songTimer);
      clearTimeout(endingTimer);

      clearInterval(fadeInInterval);
      clearInterval(fadeOutInterval);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <main className="message-scene">

      {/* PERSONAL MESSAGE */}

      {!showPoem && !showEnding && (
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
            spent a lot of years apart, I'm really happy that
            i got the chance to be your friend and we got to know each other better
            again.
          </p>

          <p>
            God has been really kindd to me for thatt!!.
          </p>

          <p>
          So this is just my little way of making you joyfull,
          and reminding you that you're someone I genuinely
          appreciate having in my life.
          </p>

          <p>
            This little thing is a piece of me, made just for you.
            I hopee you liked my little effort to make you happy
            and smilee. ♡
          </p>
        </div>
      )}

      {/* POEM — REMAINS VISIBLE DURING THE SONG */}

      {showPoem && !showEnding && (
        <div
          className={`poem-content ${
            poemVisible ? "poem-visible" : ""
          }`}
        >
          <p>Lastly,</p>

          <p>
            All this I did without you. This was my loss. <br />
            All this I want to do with you. This will be my gain. <br />
            for all the joy of sharing even the simplest passing moments with you, <br />
            for your laugh, your voice, your eyes, hair and above all for your sweet,
            ever-surprising mind which is an enchanting quarry in which it is my privilege to delve.
          </p>
        </div>
      )}

      {/* FINAL ENDING */}

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
