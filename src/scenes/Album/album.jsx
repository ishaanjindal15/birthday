
import { useEffect, useRef, useState } from "react";
import "./album.css";

import photo1 from "../../assets/1.png";
import photo2 from "../../assets/2.png";
import photo3 from "../../assets/3.png";
import photo4 from "../../assets/4.png";
import photo5 from "../../assets/5.png";
import photo6 from "../../assets/6.png";
import photo7 from "../../assets/7.png";
import photo8 from "../../assets/8.png";

const photos = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
];

const FIRST_MESSAGE_DURATION = 63 * 1000;
const SECOND_MESSAGE_DURATION = 2 * 1400;
const PHOTO_DURATION = 12 * 1050;
const FADE_DURATION = 5000;

export default function Album({ audio, onComplete }) {
  const [message, setMessage] = useState(1);
  const [showAlbum, setShowAlbum] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  const completedRef = useRef(false);

  // First message, then second message, then photos.
  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setMessage(2);
    }, FIRST_MESSAGE_DURATION);

    const secondTimer = setTimeout(() => {
      setMessage(0);
      setShowAlbum(true);
    }, FIRST_MESSAGE_DURATION + SECOND_MESSAGE_DURATION);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, []);

  // Automatically move through all eight photos.
  useEffect(() => {
    if (!showAlbum) return;

    const photoTimer = setTimeout(() => {
      if (currentPhoto < photos.length - 1) {
        setCurrentPhoto((previous) => previous + 1);
      } else {
        setShowAlbum(false);
      }
    }, PHOTO_DURATION);

    return () => clearTimeout(photoTimer);
  }, [showAlbum, currentPhoto]);

  // Fade out Epilogue only after the eighth photo disappears.
  useEffect(() => {
    if (showAlbum || message !== 0) return;

    let fadeInterval;

    if (!audio || audio.paused) {
      setShowContinue(true);
      return;
    }

    const startingVolume = audio.volume;
    const steps = 50;
    let step = 0;

    fadeInterval = setInterval(() => {
      step++;

      audio.volume = Math.max(
        0,
        startingVolume * (1 - step / steps)
      );

      if (step >= steps) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
        setShowContinue(true);
      }
    }, FADE_DURATION / steps);

    return () => clearInterval(fadeInterval);
  }, [showAlbum, message, audio]);

  // Continue to the personal message after pressing a key.
  useEffect(() => {
    if (!showContinue) return;

    const handleKeyPress = () => {
      if (completedRef.current) return;

      completedRef.current = true;
      onComplete();
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showContinue, onComplete]);

  return (
    <main className="album-scene">
      {message === 1 && (
        <section className="epilogue-message" key="first">
          <p>
            I hope you know that all the people who love you
            are proud of you even mee!!
            <br />
            on the days when u feel like it and also on the days u don't.
          </p>

          <p>
            And when I say you've come so far, I mean it in every way.
          </p>

          <p>
            But before we talk about how far you've come,
            let's take a little walk down memory lane, shall we?
          </p>

          <p>
            Let's remember a little you, and all the little
            moments youu lived to reach where u aree.
          </p>
        </section>
      )}

      {message === 2 && (
        <section className="epilogue-message" key="second">
          <p>And since I thought you love albums...</p>
          <p>I thought I'd make you a cuteee one of your own. ♡</p>
        </section>
      )}

      {showAlbum && (
        <section className="album-content">
          <p className="album-heading">
            A little collection of memories
          </p>

          <div className="polaroid" key={currentPhoto}>
            <div className="photo-frame">
              <img
                src={photos[currentPhoto]}
                alt={`Memory ${currentPhoto + 1}`}
              />
            </div>

            <p className="photo-caption">
              {currentPhoto + 1} / {photos.length}
            </p>
          </div>
        </section>
      )}

      {showContinue && (
        <section className="album-final-prompt">
          <p>And now, one last thing...</p>
          <span>press space to continue ♡</span>
        </section>
      )}
    </main>
  );
}
