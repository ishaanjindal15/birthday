import { useState } from "react";

import Intro from "./scenes/intro/intro";
import NightScene from "./scenes/nightScene/NightScene";
import Album from "./scenes/Album/album";
import Message from "./scenes/message/message";

function App() {
  const [scene, setScene] = useState("intro");
  const [epilogueAudio, setEpilogueAudio] = useState(null);

  return (
    <>
      {scene === "intro" && (
        <Intro onContinue={() => setScene("nightScene")} />
      )}

      {scene === "nightScene" && (
        <NightScene
          onContinue={(audio) => {
            setEpilogueAudio(audio);
            setScene("album");
          }}
        />
      )}

      {scene === "album" && (
        <Album
          audio={epilogueAudio}
          onComplete={() => setScene("message")}
        />
      )}

      {scene === "message" && (
        <Message />
      )}
    </>
  );
}

export default App;