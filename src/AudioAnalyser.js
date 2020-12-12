import React, { useState, useEffect } from 'react';
import AudioVisualizer from './AudioVisualizer';

export default function AudioAnalyser({ stream }) {
    const [audioData, setAudioData] = useState(new Uint8Array(0));
    const [bufferLength, setBufferLength] = useState(0);

    useEffect(() => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;
        analyser.fftSize = 2048;
        const gainNode = audioContext.createGain();
        const bufferLength = analyser.fftSize;
        setBufferLength(bufferLength);
        const dataArray = new Uint8Array(bufferLength);
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        gainNode.connect(analyser);

        gainNode.gain.value = 1;

        const tick = () => {
            analyser.getByteTimeDomainData(dataArray);
            setAudioData(dataArray);
            const rafId = window.requestAnimationFrame(tick);
        }

        const rafId = window.requestAnimationFrame(tick);

        tick();

        return () => {
            cancelAnimationFrame(rafId);
            analyser.disconnect();
            source.disconnect();
        }

    }, []);


    return (<div className="ui container segment" id="visualizer"><AudioVisualizer audioData={audioData} bufferLength={bufferLength}/></div>);
}