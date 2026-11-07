import { useEffect, useState ,useRef} from "react";
import "./intro.css";

import Stars from "../../components/stars/stars";

function Intro({ onContinue }) {

  const [showStars, setShowStars] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [started, setStarted] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [canContinue, setCanContinue] = useState(false);

  const audioRef = useRef(null);


  useEffect(() => {

  if (!started) return;
  
    const audio = new Audio(
      "/audio assets/BBC Philharmonic perform 'Happy birthday' for BBC North.mp3"
    );
  
    audio.volume = 0.35;
  
    audioRef.current = audio;
  
    audio.play();
  
    const stopMusic = setTimeout(() => {

      audio.pause();
    
      setTimeout(() => {
        setShowContinue(true);
        setCanContinue(true);
      }, 2000);
    
    }, 41200);
  
    return () => {
      clearTimeout(stopMusic);
      audio.pause();
    };
  }, [started]);



  useEffect(() => {

    function startExperience() {
      setStarted(true);
      setShowStart(false);
  
      window.removeEventListener(
        "keydown",
        startExperience
      );
    }
  
  
    window.addEventListener(
      "keydown",
      startExperience
    );
  
  
    return () => {
      window.removeEventListener(
        "keydown",
        startExperience
      );
    };
  
  
  }, []);






  useEffect(() => {

    if (!started) return;

    // stars appear after music begins
    const starsTimer = setTimeout(() => {
      setShowStars(true);
    }, 4000);
    
    
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 6800);
    
    
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 12500);

    

      return () => {
        clearTimeout(starsTimer);
        clearTimeout(titleTimer);
        clearTimeout(subtitleTimer);
      };

    }, [started]);





    useEffect(() => {

      if (!canContinue) return;
  
      function continueStory() {
  
          onContinue();
  
          window.removeEventListener(
              "keydown",
              continueStory
          );
  
      }
  
      window.addEventListener(
          "keydown",
          continueStory
      );
  
      return () => {
  
          window.removeEventListener(
              "keydown",
              continueStory
          );
  
      };
  
  }, [canContinue, onContinue]);




    return (
      <section className="intro">

    {showStars && <Stars />}

    {showStart && (
      <p className="start-text">
        Press Space to begin
      </p>
    )}

    <div className="content">

      {showTitle && (
        <h1 className="title">
          Happy Birthday Areeva
        </h1>
      )}

      {showSubtitle && (
        <p className="subtitle">
          As you love sparkles,i thought i'd a little to the obsidian skies for a star that shines so very brightly can make the sun blush pink!
        </p>
      )}

        {showContinue && (
          <div className="continue">
              <p className="continue-title">
                  Continue...
              </p>

              <p className="continue-subtitle">
                  Press Space
              </p>
          </div>
        )}
    </div>

  </section>
  );
}




export default Intro;