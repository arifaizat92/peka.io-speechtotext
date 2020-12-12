// eslint-disable-next-line
import React, { useState} from 'react';
import { useMediaQuery } from 'react-responsive';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AudioAnalyser from './AudioAnalyser';
import Dropdown from './Dropdown';
import './Style.css';

//supported language for web speech
const options = [
  {
    label: 'Bahasa Melayu',
    value: 'ms-MY',
  },
  {
    label: 'English-US',
    value: 'en-US',
  },
  {
    label: 'English-UK',
    value: 'en-GB',
  }
];

export default function Speech() {
  const [audio, setAudio] = useState(false);
  const [language, setLanguage] = useState(options[0]);
  const [visualizer, setVisualizer] = useState(null);
  const [buttonText, setButtonText] = useState("Start");
  const { transcript, resetTranscript } = useSpeechRecognition();

  const isMobile = useMediaQuery({ maxWidth: 720 });
  
 if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
   return null;
 }
  
  const start = async () => {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setAudio(audio);
    SpeechRecognition.startListening({
      continuous: true,
      language: language.value
    });
    console.log(audio);
    setButtonText('Stop');
  };

  const stop = () => {
    audio.getTracks().forEach(track => track.stop());
    SpeechRecognition.stopListening();
    setAudio(null);
    setButtonText('Start');
  };



  
  return (
    <>
      <div className="ui center aligned container segment" >
        <h1 className="ui header">Peka.io</h1>
            <div id="language">Select a language: <Dropdown
            selected={language}
            onSelectedChange={setLanguage}
            options={options}
            />
            </div>
        <div className="ui borderless padded text container segment">
          <p>{!transcript ? "Listening..." : transcript}</p>
        </div>
      </div>
      <div className="ui center aligned footer segment">
      {audio && visualizer ? <AudioAnalyser stream={audio}/>: ""}
        <div className="ui  buttons">
          <button className={`ui ${isMobile ? '' : 'big'} secondary basic button`}  onClick={() => {
              setVisualizer(!visualizer)
            }}>Visualizer: {visualizer ? 'OFF' : 'ON'}
          </button>
          <button className={`ui ${isMobile ? '' : 'big'} secondary basic button`} onClick={() => {
              audio ? stop() : start()
            }} >
            <i className={`red ${audio ? 'inverted microphone slash' : 'microphone'} icon `}></i>
            {buttonText}
          </button>
          <button className={`ui ${isMobile ? '' : 'big'} secondary basic button`}  onClick={resetTranscript}>
            <i className="redo icon" ></i>
            Reset
          </button> 
        </div>
      </div>
    </>
  );
};
