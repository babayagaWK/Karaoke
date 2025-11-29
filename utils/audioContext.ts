export class AudioEngine {
  public audioContext: AudioContext;
  public sourceNode: AudioNode | null = null;
  public gainNode: GainNode;
  public analyser: AnalyserNode;
  
  // Getter for destination
  get destination(): AudioDestinationNode {
    return this.audioContext.destination;
  }
  
  // Mix Control
  private dryGain: GainNode;
  private wetGain: GainNode;

  // Multi-Band Vocal Removal System
  // Low Band (0-400 Hz): Bass & Sub
  private lowBandSplitter: ChannelSplitterNode;
  private lowBandInvert: GainNode;
  private lowBandMerge: ChannelMergerNode;
  private lowBandGain: GainNode; // Center reduction for low
  private lowPassFilter: BiquadFilterNode;

  // Mid Band (400-4000 Hz): Main Vocals
  private midBandSplitter: ChannelSplitterNode;
  private midBandInvert: GainNode;
  private midBandMerge: ChannelMergerNode;
  private midBandGain: GainNode;
  private midPassFilter1: BiquadFilterNode;
  private midPassFilter2: BiquadFilterNode;

  // High Band (4000+ Hz): Brightness & S sounds
  private highBandSplitter: ChannelSplitterNode;
  private highBandInvert: GainNode;
  private highBandMerge: ChannelMergerNode;
  private highBandGain: GainNode;
  private highPassFilter: BiquadFilterNode;

  // Stereo Width Reduction Node
  private stereoReductionMerger: ChannelMergerNode;
  
  // Main processing chain nodes
  private splitter: ChannelSplitterNode;
  private centerReductionGain: GainNode;

  // === EQ Filters ===
  private eqBassFilter: BiquadFilterNode;
  private eqMidFilter: BiquadFilterNode;
  private eqTrebleFilter: BiquadFilterNode;

  // === Noise Gate ===
  private noiseGateGain: GainNode;
  private noiseGateEnabled = false;
  private noiseGateThreshold = -40;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Master Output Gain
    this.gainNode = this.audioContext.createGain();
    
    // Analyser
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    // --- Dry/Wet Mix Control ---
    this.dryGain = this.audioContext.createGain();
    this.wetGain = this.audioContext.createGain();
    this.dryGain.gain.value = 1;
    this.wetGain.gain.value = 0;

    // === MULTI-BAND VOCAL REMOVAL SETUP ===
    
    // Main splitter for L/R channels
    this.splitter = this.audioContext.createChannelSplitter(2);

    // --- LOW BAND (50-400 Hz): Bass & Drums ---
    this.lowPassFilter = this.audioContext.createBiquadFilter();
    this.lowPassFilter.type = "lowpass";
    this.lowPassFilter.frequency.value = 400;
    this.lowPassFilter.Q.value = 0.7;

    this.lowBandSplitter = this.audioContext.createChannelSplitter(2);
    this.lowBandInvert = this.audioContext.createGain();
    this.lowBandInvert.gain.value = -1;
    this.lowBandMerge = this.audioContext.createChannelMerger(2);
    
    this.lowBandGain = this.audioContext.createGain();
    this.lowBandGain.gain.value = 0.5; // Keep 50% of center (bass)

    // Low Band Routing: 
    // Source -> LowPass -> Splitter -> (L & -R) -> Merge -> Gain -> OutWet
    this.lowPassFilter.connect(this.lowBandSplitter);
    this.lowBandSplitter.connect(this.lowBandGain, 0);  // L
    this.lowBandSplitter.connect(this.lowBandInvert, 1); // R
    this.lowBandInvert.connect(this.lowBandMerge, 0, 1); // -R to right
    this.lowBandGain.connect(this.lowBandMerge, 0, 0);   // L to left
    
    // --- MID BAND (400-4000 Hz): Main Vocal Range ---
    this.midPassFilter1 = this.audioContext.createBiquadFilter();
    this.midPassFilter1.type = "highpass";
    this.midPassFilter1.frequency.value = 400;
    this.midPassFilter1.Q.value = 0.7;

    this.midPassFilter2 = this.audioContext.createBiquadFilter();
    this.midPassFilter2.type = "lowpass";
    this.midPassFilter2.frequency.value = 4000;
    this.midPassFilter2.Q.value = 0.7;

    this.midBandSplitter = this.audioContext.createChannelSplitter(2);
    this.midBandInvert = this.audioContext.createGain();
    this.midBandInvert.gain.value = -1;
    this.midBandMerge = this.audioContext.createChannelMerger(2);
    
    this.midBandGain = this.audioContext.createGain();
    this.midBandGain.gain.value = 0.3; // Keep 30% of center (vocals are dominant)

    this.midPassFilter1.connect(this.midPassFilter2);
    this.midPassFilter2.connect(this.midBandSplitter);
    this.midBandSplitter.connect(this.midBandGain, 0);
    this.midBandSplitter.connect(this.midBandInvert, 1);
    this.midBandInvert.connect(this.midBandMerge, 0, 1);
    this.midBandGain.connect(this.midBandMerge, 0, 0);

    // --- HIGH BAND (4000+ Hz): Brightness & Sibilance ---
    this.highPassFilter = this.audioContext.createBiquadFilter();
    this.highPassFilter.type = "highpass";
    this.highPassFilter.frequency.value = 4000;
    this.highPassFilter.Q.value = 0.7;

    this.highBandSplitter = this.audioContext.createChannelSplitter(2);
    this.highBandInvert = this.audioContext.createGain();
    this.highBandInvert.gain.value = -1;
    this.highBandMerge = this.audioContext.createChannelMerger(2);
    
    this.highBandGain = this.audioContext.createGain();
    this.highBandGain.gain.value = 0.4; // Keep 40% center

    this.highPassFilter.connect(this.highBandSplitter);
    this.highBandSplitter.connect(this.highBandGain, 0);
    this.highBandSplitter.connect(this.highBandInvert, 1);
    this.highBandInvert.connect(this.highBandMerge, 0, 1);
    this.highBandGain.connect(this.highBandMerge, 0, 0);

    // === STEREO WIDTH REDUCTION ===
    this.centerReductionGain = this.audioContext.createGain();
    this.centerReductionGain.gain.value = 0.7; // Reduce stereo width to 70%
    this.stereoReductionMerger = this.audioContext.createChannelMerger(2);

    // Merge all bands and apply stereo reduction
    this.lowBandMerge.connect(this.centerReductionGain);
    this.midBandMerge.connect(this.centerReductionGain);
    this.highBandMerge.connect(this.centerReductionGain);
    this.centerReductionGain.connect(this.wetGain);

    // === EQ FILTERS ===
    this.eqBassFilter = this.audioContext.createBiquadFilter();
    this.eqBassFilter.type = "lowshelf";
    this.eqBassFilter.frequency.value = 200;
    this.eqBassFilter.gain.value = 0; // Default: no change

    this.eqMidFilter = this.audioContext.createBiquadFilter();
    this.eqMidFilter.type = "peaking";
    this.eqMidFilter.frequency.value = 1000;
    this.eqMidFilter.Q.value = 1;
    this.eqMidFilter.gain.value = 0;

    this.eqTrebleFilter = this.audioContext.createBiquadFilter();
    this.eqTrebleFilter.type = "highshelf";
    this.eqTrebleFilter.frequency.value = 5000;
    this.eqTrebleFilter.gain.value = 0;

    // === NOISE GATE ===
    this.noiseGateGain = this.audioContext.createGain();
    this.noiseGateGain.gain.value = 1;

    // --- Final Output Chain ---
    this.dryGain.connect(this.gainNode);
    this.wetGain.connect(this.gainNode);
    
    this.gainNode.connect(this.eqBassFilter);
    this.eqBassFilter.connect(this.eqMidFilter);
    this.eqMidFilter.connect(this.eqTrebleFilter);
    this.eqTrebleFilter.connect(this.noiseGateGain);
    this.noiseGateGain.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  // Connect common processing graph to a source
  private connectGraph(source: AudioNode) {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
    }
    this.sourceNode = source;
    
    // Dry Path: Direct signal
    this.sourceNode.connect(this.dryGain);

    // Wet Path: Multi-band vocal removal
    this.sourceNode.connect(this.lowPassFilter);
    this.sourceNode.connect(this.midPassFilter1);
    this.sourceNode.connect(this.highPassFilter);
  }

  setupSource(audioElement: HTMLAudioElement) {
    const source = this.audioContext.createMediaElementSource(audioElement);
    this.connectGraph(source);
  }

  setupStream(stream: MediaStream) {
    const source = this.audioContext.createMediaStreamSource(stream);
    this.connectGraph(source);
  }

  /**
   * Set vocal removal intensity (0-100%)
   * 0% = Original, 100% = Maximum vocal removal
   */
  setVocalRemovalLevel(intensity: number) {
    // Clamp between 0-1
    const level = Math.max(0, Math.min(1, intensity / 100));
    
    const now = this.audioContext.currentTime;
    const timeConstant = 0.05; // 50ms smooth fade

    // Cancel any scheduled changes
    this.dryGain.gain.cancelScheduledValues(now);
    this.wetGain.gain.cancelScheduledValues(now);
    
    // Set current values
    this.dryGain.gain.setValueAtTime(this.dryGain.gain.value, now);
    this.wetGain.gain.setValueAtTime(this.wetGain.gain.value, now);

    // Smoothly transition to new level
    // Dry = (1 - level), Wet = level
    this.dryGain.gain.linearRampToValueAtTime(1 - level, now + timeConstant);
    this.wetGain.gain.linearRampToValueAtTime(level, now + timeConstant);
  }

  /**
   * Legacy method for compatibility - maps boolean to 0/100
   */
  toggleVocalRemover(shouldRemove: boolean) {
    this.setVocalRemovalLevel(shouldRemove ? 100 : 0);
  }

  setVolume(val: number) {
    this.gainNode.gain.value = val;
  }

  // === EQ CONTROLS ===
  setEQ(bass: number, mid: number, treble: number) {
    // Clamp values between -6 and +6 dB
    const clamp = (val: number) => Math.max(-6, Math.min(6, val));
    
    this.eqBassFilter.gain.value = clamp(bass);
    this.eqMidFilter.gain.value = clamp(mid);
    this.eqTrebleFilter.gain.value = clamp(treble);
  }

  // === NOISE GATE CONTROLS ===
  setNoiseGate(enabled: boolean, threshold: number = -40) {
    this.noiseGateEnabled = enabled;
    this.noiseGateThreshold = Math.max(-80, Math.min(-20, threshold));
    // Note: Full noise gate implementation would require real-time analysis
    // For now, this is a placeholder that can be extended
  }

  resume() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}