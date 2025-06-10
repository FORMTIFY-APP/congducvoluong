import { Award, Calendar, Heart, Volume2, VolumeX } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import MoktakSVG from './components/MoktakSVG';

interface MeritData {
  totalMerit: number;
  todayMerit: number;
  streak: number;
  lastVisit: string;
  achievements: string[];
}

const QUOTES = [
  "Mỗi tiếng mõ đều tích lũy vô lượng công đức",
  "Cùng với mỗi âm thanh, cầu cho chúng sinh được an lạc",
  "Công đức chia sẻ là công đức nhân đôi",
  "Con đường đạo đức dẫn đến giải thoát",
  "Việc nhỏ, lòng từ bi lớn",
  "Cầu cho tu tập của bạn mang lại niềm vui cho tất cả",
  "Nam mô A Di Đà Phật",
  "Tâm thanh tịnh, phước đức vô biên"
];

const ACHIEVEMENTS = [
  { id: 'first_tap', name: 'Bước Đầu Tu Tập', description: 'Lần đầu gõ mõ', threshold: 1 },
  { id: 'hundred_taps', name: 'Tâm Thành Kính', description: 'Hoàn thành 100 tiếng mõ', threshold: 100 },
  { id: 'thousand_taps', name: 'Đạo Tâm Kiên Định', description: 'Hoàn thành 1,000 tiếng mõ', threshold: 1000 },
  { id: 'daily_practice', name: 'Tinh Tần Tu Tập', description: 'Tu tập liên tục 7 ngày', threshold: 7 },
  { id: 'merit_master', name: 'Bậc Thầy Công Đức', description: 'Hoàn thành 10,000 tiếng mõ', threshold: 10000 },
];

function App() {
  const [meritData, setMeritData] = useState<MeritData>({
    totalMerit: 0,
    todayMerit: 0,
    streak: 0,
    lastVisit: new Date().toDateString(),
    achievements: []
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('moktak-merit');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      
      if (data.lastVisit !== today) {
        // New day - reset today's merit, update streak
        const streak = data.lastVisit === new Date(Date.now() - 86400000).toDateString() 
          ? data.streak + 1 
          : 1;
        
        setMeritData({
          ...data,
          todayMerit: 0,
          streak,
          lastVisit: today
        });
      } else {
        setMeritData(data);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('moktak-merit', JSON.stringify(meritData));
  }, [meritData]);

  // Rotate quotes periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Khởi tạo AudioContext một lần duy nhất
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playWoodenMoktakSound = useCallback(async () => {
    if (!soundEnabled) return;
    let audioContext = audioContextRef.current;
    if (!audioContext) return;
    // Resume context nếu bị suspend (Chrome policy)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    const now = audioContext.currentTime;
    
    // Create authentic wooden moktak sound
    const createWoodenKnock = (frequency: number, startTime: number, duration: number, volume: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Wooden percussion waveform
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.3, startTime + duration);
      
      // Low-pass filter for wooden, muffled sound
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, startTime);
      filter.frequency.exponentialRampToValueAtTime(200, startTime + duration);
      filter.Q.setValueAtTime(2, startTime);
      
      // Sharp attack, quick decay like wood
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    // Create wooden resonance
    const createWoodenResonance = (frequency: number, startTime: number, duration: number, volume: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(frequency, startTime);
      filter.Q.setValueAtTime(8, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    // Create wooden "thock" noise
    const createWoodenNoise = () => {
      const bufferSize = audioContext.sampleRate * 0.1;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        // Create filtered noise that sounds like wood impact
        const decay = Math.exp(-i / (audioContext.sampleRate * 0.02));
        noiseData[i] = (Math.random() * 2 - 1) * decay * 0.5;
      }
      
      const noiseSource = audioContext.createBufferSource();
      const noiseGain = audioContext.createGain();
      const noiseFilter = audioContext.createBiquadFilter();
      
      noiseSource.buffer = noiseBuffer;
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(300, audioContext.currentTime);
      noiseFilter.Q.setValueAtTime(3, audioContext.currentTime);
      
      noiseGain.gain.setValueAtTime(0.4, audioContext.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      
      noiseSource.start(audioContext.currentTime);
      noiseSource.stop(audioContext.currentTime + 0.1);
    };
    
    // Main wooden knock (fundamental frequency)
    createWoodenKnock(180, now, 0.8, 0.6);
    
    // Wooden resonance harmonics
    createWoodenResonance(180, now + 0.01, 1.2, 0.3);
    createWoodenResonance(270, now + 0.02, 0.9, 0.2);
    createWoodenResonance(360, now + 0.015, 0.6, 0.15);
    
    // Wood impact noise
    createWoodenNoise();
    
    // Subtle echo for temple acoustics
    setTimeout(() => {
      createWoodenKnock(180, audioContext.currentTime, 0.4, 0.1);
    }, 150);
    
  }, [soundEnabled]);

  const checkAchievements = useCallback((newTotal: number, newStreak: number) => {
    const newAchievements = [];
    
    for (const achievement of ACHIEVEMENTS) {
      if (!meritData.achievements.includes(achievement.id)) {
        if (
          (achievement.id === 'daily_practice' && newStreak >= achievement.threshold) ||
          (achievement.id !== 'daily_practice' && newTotal >= achievement.threshold)
        ) {
          newAchievements.push(achievement.id);
          setShowAchievement(achievement.name);
          setTimeout(() => setShowAchievement(null), 4000);
        }
      }
    }
    
    return newAchievements;
  }, [meritData.achievements]);

  const handleTap = useCallback(async (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Add ripple effect
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 800);
    
    // Play wooden moktak sound
    await playWoodenMoktakSound();
    
    // Animate the moktak
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    // Update merit
    const newTotal = meritData.totalMerit + 1;
    const newToday = meritData.todayMerit + 1;
    const newAchievements = checkAchievements(newTotal, meritData.streak);
    
    setMeritData(prev => ({
      ...prev,
      totalMerit: newTotal,
      todayMerit: newToday,
      achievements: [...prev.achievements, ...newAchievements]
    }));
  }, [meritData, playWoodenMoktakSound, checkAchievements]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-400 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-amber-400 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-3 drop-shadow-sm">
          CÔNG ĐỨC VÔ LƯỢNG
        </h1>
        <p className="text-orange-800/80 text-xl font-semibold tracking-wide">Gõ Mõ Tích Đức</p>
        <p className="text-orange-700/60 text-sm mt-1">Tu tập tâm linh - Tích lũy công đức</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-lg z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 text-center shadow-xl border border-orange-200/50 hover:shadow-2xl transition-all duration-300">
          <Heart className="w-7 h-7 text-red-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-red-700 mb-1">{meritData.totalMerit.toLocaleString()}</div>
          <div className="text-sm text-red-600 font-medium">Tổng Công Đức</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 text-center shadow-xl border border-orange-200/50 hover:shadow-2xl transition-all duration-300">
          <Award className="w-7 h-7 text-amber-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-amber-700 mb-1">{meritData.todayMerit}</div>
          <div className="text-sm text-amber-600 font-medium">Hôm Nay</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 text-center shadow-xl border border-orange-200/50 hover:shadow-2xl transition-all duration-300">
          <Calendar className="w-7 h-7 text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-green-700 mb-1">{meritData.streak}</div>
          <div className="text-sm text-green-600 font-medium">Ngày Liên Tiếp</div>
        </div>
      </div>

      {/* Main Moktak */}
      <div className="relative mb-8 z-10">
        <div 
          className={`relative w-80 h-80 cursor-pointer transition-all duration-300 ${
            isAnimating ? 'scale-95 rotate-1' : 'scale-100 hover:scale-105'
          }`}
          onClick={handleTap}
        >
          {/* Ripple effects */}
          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className="absolute pointer-events-none"
              style={{
                left: ripple.x - 60,
                top: ripple.y - 60,
                width: 120,
                height: 120
              }}
            >
              <div className="w-full h-full rounded-full border-3 border-orange-400 animate-ping opacity-60"></div>
              <div className="absolute inset-4 w-auto h-auto rounded-full border-2 border-red-400 animate-ping opacity-40" style={{ animationDelay: '0.1s' }}></div>
            </div>
          ))}
          {/* Moktak SVG */}
          <div className={`w-full h-full transition-all duration-300 ${
            isAnimating ? 'drop-shadow-2xl' : 'drop-shadow-xl hover:drop-shadow-2xl'
          }`}>
            <MoktakSVG 
              className="w-full h-full" 
              isAnimating={isAnimating}
            />
          </div>
        </div>
        {/* Tap instruction */}
        <div className="text-center mt-6">
          <p className="text-orange-800 font-semibold text-lg">Chạm vào mõ để tích lũy công đức</p>
          <p className="text-orange-600 text-sm mt-1">Mỗi tiếng mõ mang lại bình an và phước lành</p>
        </div>
      </div>

      {/* Quote */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-lg text-center shadow-xl border border-orange-200/50 mb-6 z-10">
        <p className="text-orange-900 font-medium text-lg italic leading-relaxed">"{currentQuote}"</p>
      </div>

      {/* Sound Toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl border border-orange-200/50 hover:bg-white transition-all duration-300 hover:scale-110 z-20"
        title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
      >
        {soundEnabled ? (
          <Volume2 className="w-6 h-6 text-orange-600" />
        ) : (
          <VolumeX className="w-6 h-6 text-orange-400" />
        )}
      </button>

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-8 py-4 rounded-full shadow-2xl animate-bounce z-30 border-2 border-white/30">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6" />
            <span className="font-bold text-lg">Thành Tựu Mới: {showAchievement}!</span>
          </div>
        </div>
      )}

      {/* Floating lotus petals */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-br from-pink-300 to-orange-300 rounded-full opacity-40 animate-pulse"
            style={{
              left: `${15 + i * 12}%`,
              top: `${25 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: '4s'
            }}
          ></div>
        ))}
      </div>

      {/* Floating incense smoke effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={`smoke-${i}`}
            className="absolute w-1 h-8 bg-gradient-to-t from-gray-300/30 to-transparent rounded-full opacity-20 animate-pulse"
            style={{
              left: `${30 + i * 25}%`,
              bottom: `${10 + i * 5}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: '6s',
              transform: `rotate(${i * 15}deg)`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;