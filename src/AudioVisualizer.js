import React , { useEffect, useRef} from "react";

export default function AudioVisualizer({ audioData, bufferLength }) {
    const canvas = useRef(null);

    useEffect(() => {

        const draw = () => {

            const height = canvas.current.height;
            const width = canvas.current.width;
            const context = canvas.current.getContext('2d');
            let x = 0;
            const sliceWidth = (width * 1.0) / audioData.length;

            context.lineWidth = 2;
            context.strokeStyle = '#EA4335';
            context.clearRect(0, 0, width, height);

            context.beginPath();
            context.moveTo(0, height / 2);
            for (var i = 0; i < bufferLength; i++) {
                const y = (audioData[i] / 255.0) * height;

                if(i === 0) {
                    context.moveTo(x, y);
                  } else {
                    context.lineTo(x, y);
                  }
                
                x += sliceWidth;
            }
            context.lineTo(x, height / 2);
            context.stroke();

        };

        draw();
    
    }, );

    return (
        <canvas width="300" height="100" ref={canvas} />
    );
};