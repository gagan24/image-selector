import React, { useRef, useState, useEffect, MouseEvent } from 'react';

interface Point {
    x: number;
    y: number;
}

const RoofCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas!.getContext('2d')!;
        
        const img = new Image();
        img.crossOrigin = 'anonymous'; // This is crucial to avoid tainting the canvas
        img.src = '/sample.webp'; // Replace with your image URL
        img.onload = () => {
            context.drawImage(img, 0, 0, canvas!.width, canvas!.height);
            setImage(img);
        };
    }, []);

    const draw = () => {
        const canvas = canvasRef.current;
        const context = canvas!.getContext('2d')!;
        
        if (image) {
            context.drawImage(image, 0, 0, canvas!.width, canvas!.height);
        }

        if (points.length > 0) {
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            points.forEach(point => context.lineTo(point.x, point.y));
            if (points.length > 2) {
                context.closePath();
            }
            context.lineWidth = 2;
            context.stroke();
        }
    };

    useEffect(() => {
        requestAnimationFrame(draw);
    }, [points]);

    const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const newPoint = getCanvasCoordinates(event);
        setPoints([...points, newPoint]);
    };

    const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const newPoint = getCanvasCoordinates(event);
        setPoints([...points, newPoint]);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const getCanvasCoordinates = (event: MouseEvent<HTMLCanvasElement>): Point => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    const exportImage = () => {
        const canvas = canvasRef.current!;
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'roof-drawing.png';
        link.click();
    };

    const resetImage = () => {
        setPoints([]);
        const canvas = canvasRef.current;
        const context = canvas!.getContext('2d')!;
        if (image) {
            context.drawImage(image, 0, 0, canvas!.width, canvas!.height);
        }
    };

    return (
        <div>
            <div>
                <canvas
                    ref={canvasRef}
                    width={900}
                    height={550}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ border: '1px solid black' }}
                />
            </div>
            <div>
                <div className='button-container'>
                    <button className='reset-button' onClick={resetImage}>Reset</button>
                    <button onClick={exportImage}>Export Image</button>
                </div>
                <p>
                    <b>Note:</b> Select the corners of the shape you wish to outline. The shape will be automatically adjusted based on the selected points.
                </p>
            </div>
        </div>
    );
};

export default RoofCanvas;
