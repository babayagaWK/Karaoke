import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas } from '@react-native-canvas/canvas';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const VisualizerRN: React.FC<VisualizerProps> = ({ analyser, isPlaying }) => {
  const canvasRef = useRef<Canvas>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Gradient
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#3b82f6'); // Blue 500
        gradient.addColorStop(0.5, '#8b5cf6'); // Violet 500
        gradient.addColorStop(1, '#ec4899'); // Pink 500
        ctx.fillStyle = gradient;

        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height;

          // Draw rounded bars
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Canvas
        ref={canvasRef}
        style={{
          width: width - 32,
          height: 200,
          borderRadius: 12,
          backgroundColor: 'rgba(30, 41, 59, 0.3)',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
});

export default VisualizerRN;
