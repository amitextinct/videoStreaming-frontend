import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  PlayIcon, PauseIcon, 
  SpeakerWaveIcon, SpeakerXMarkIcon,
  ArrowsPointingInIcon, ArrowsPointingOutIcon 
} from '@heroicons/react/24/solid';

export function VideoPlayer({ videoUrl, title }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);

  // Add touch detection
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const [lastTapTime, setLastTapTime] = useState(0);
  const touchStartPos = useRef({ x: 0, y: 0 });

  // Add new states for mobile controls
  const [doubleTapSide, setDoubleTapSide] = useState(null);
  const [showForwardRewind, setShowForwardRewind] = useState(false);


  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  // Auto-hide controls when playing
  useEffect(() => {
    if (isPlaying && isTouchDevice && controlsVisible) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isTouchDevice, controlsVisible]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = useCallback(() => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleMuteToggle = useCallback(() => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
    }
  }, [isMuted]);

  const handleFullscreenToggle = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key.toLowerCase()) {
        case ' ':
        case 'k': {
          e.preventDefault();
          handlePlayPause();
          break;
        }
        case 'f': {
          e.preventDefault();
          handleFullscreenToggle();
          break;
        }
        case 'm': {
          e.preventDefault();
          handleMuteToggle();
          break;
        }
        case 'arrowleft': {
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 5, 0);
          }
          break;
        }
        case 'arrowright': {
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 5, videoRef.current.duration);
          }
          break;
        }
        case 'arrowup': {
          e.preventDefault();
          const newVolumeUp = Math.min(volume + 0.1, 1);
          setVolume(newVolumeUp);
          setIsMuted(false);
          if (videoRef.current) {
            videoRef.current.volume = newVolumeUp;
            videoRef.current.muted = false;
          }
          break;
        }
        case 'arrowdown': {
          e.preventDefault();
          const newVolumeDown = Math.max(volume - 0.1, 0);
          setVolume(newVolumeDown);
          setIsMuted(newVolumeDown === 0);
          if (videoRef.current) {
            videoRef.current.volume = newVolumeDown;
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [volume, handlePlayPause, handleFullscreenToggle, handleMuteToggle]);

  const handleProgressMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    updateProgress(e);
  };

  const handleProgressMouseMove = useCallback((e) => {
    e.preventDefault(); // Prevent text selection
    if (isDragging) {
      updateProgress(e);
    }
  }, [isDragging]);

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const updateProgress = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    const newTime = position * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(position * 100); // Update progress immediately for smoother UI
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleProgressMouseMove);
      document.removeEventListener('mouseup', handleProgressMouseUp);
    };
  }, [isDragging, handleProgressMouseMove]);

  const handleTouchStart = (e) => {
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleVideoTouch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchDuration = Date.now() - touchStartPos.current.time;
    const deltaX = Math.abs(touchEndX - touchStartPos.current.x);
    const deltaY = Math.abs(touchEndY - touchStartPos.current.y);
    
    // Handle different touch gestures
    if (deltaX < 10 && deltaY < 10) {
      // Single tap
      if (touchDuration < 300) {
        const currentTime = Date.now();
        const tapLength = currentTime - lastTapTime;
        
        if (tapLength < 300 && tapLength > 0) {
          // Double tap - handle seeking
          const screenWidth = window.innerWidth;
          const tapX = touchEndX;
          
          if (tapX < screenWidth / 2) {
            // Double tap left - rewind 10s
            setDoubleTapSide('left');
            videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
          } else {
            // Double tap right - forward 10s
            setDoubleTapSide('right');
            videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
          }
          setShowForwardRewind(true);
          setTimeout(() => setShowForwardRewind(false), 500);
        } else {
          // Single tap - toggle controls
          setControlsVisible(prev => !prev);
        }
        setLastTapTime(currentTime);
      }
    } else if (deltaX > deltaY && deltaX > 30) {
      // Horizontal swipe - seek
      const seekAmount = (touchEndX - touchStartPos.current.x) / window.innerWidth * 30;
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seekAmount));
    }
  };

  // Update video configuration
  const videoConfig = {
    crossOrigin: "anonymous",
    referrerPolicy: "no-referrer",
    playsInline: true,
    title: title,
    loading: "lazy"
  };

  return (
    <div 
      ref={containerRef}
      className="relative group w-full aspect-video bg-black overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleVideoTouch}
    >
      <video
        ref={videoRef}
        className="w-full h-full cursor-pointer"
        onClick={isTouchDevice ? undefined : handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        {...videoConfig}
      >
        <source 
          src={videoUrl} 
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Double tap indicators */}
      {showForwardRewind && doubleTapSide && (
        <div 
          className={`absolute top-1/2 -translate-y-1/2 ${
            doubleTapSide === 'left' ? 'left-8' : 'right-8'
          } bg-black/60 rounded-full p-4`}
        >
          <div className="text-white text-center">
            <div className="text-2xl font-bold">
              {doubleTapSide === 'left' ? '-10s' : '+10s'}
            </div>
          </div>
        </div>
      )}

      {/* Play/Pause overlay for touch devices */}
      {isTouchDevice && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePlayPause();
          }}
        >
          <div className={`transition-opacity duration-200 ${controlsVisible ? 'opacity-0' : 'opacity-100'}`}>
            {isPlaying ? (
              <PauseIcon className="w-16 h-16 text-white opacity-70" />
            ) : (
              <PlayIcon className="w-16 h-16 text-white opacity-70" />
            )}
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-2 sm:p-4 transition-all duration-300 ${
          controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        } z-10`}
        style={{ 
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          pointerEvents: controlsVisible ? 'auto' : 'none'
        }}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div 
          ref={progressBarRef}
          className="w-full h-3 bg-gray-600/60 cursor-pointer mb-2 sm:mb-3 rounded-full relative touch-none"
          onClick={handleProgressClick}
          onTouchStart={handleProgressMouseDown}
          onTouchMove={handleProgressMouseMove}
          onTouchEnd={handleProgressMouseUp}
        >
          <div 
            className="h-full bg-indigo-600 relative rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div 
              className={`absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-indigo-600 rounded-full transition-transform ${
                isDragging ? 'scale-150' : controlsVisible ? 'scale-100' : 'scale-0'
              }`}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePlayPause();
              }}
              onClick={handlePlayPause}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="w-8 h-8" />
              ) : (
                <PlayIcon className="w-8 h-8" />
              )}
            </button>
            
            {/* Volume controls - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handleMuteToggle}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <SpeakerXMarkIcon className="w-6 h-6" />
                ) : (
                  <SpeakerWaveIcon className="w-6 h-6" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600/60 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <span className="text-sm sm:text-base">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button
            onClick={handleFullscreenToggle}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="w-6 h-6" />
            ) : (
              <ArrowsPointingOutIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default VideoPlayer;
