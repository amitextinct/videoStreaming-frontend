import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  PlayIcon, PauseIcon, 
  SpeakerWaveIcon, SpeakerXMarkIcon,
  ArrowsPointingInIcon, ArrowsPointingOutIcon 
} from '@heroicons/react/24/solid';

export default function VideoPlayer({ videoUrl, title }) {
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
    if (isPlaying && isTouchDevice) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isTouchDevice]);

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

  const handleTouchContainer = () => {
    if (isTouchDevice) {
      setControlsVisible(prev => !prev);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setControlsVisible(false);
        }, 3000);
      }
    }
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

  // Update video configuration
  const videoConfig = {
    crossOrigin: "anonymous",
    referrerPolicy: "no-referrer",
    playsInline: true,
    title: title
  };

  return (
    <div 
      ref={containerRef}
      className="relative group w-full aspect-video bg-black overflow-hidden select-none" // Added select-none
      onTouchStart={handleTouchContainer}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <video
        ref={videoRef}
        className="w-full h-full cursor-pointer"
        onClick={handlePlayPause}
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

      {/* Controls overlay - Modified to prevent overflow */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-2 sm:p-4 transition-all duration-300 ${
          isTouchDevice 
            ? controlsVisible ? 'translate-y-0' : 'translate-y-full' 
            : 'translate-y-full group-hover:translate-y-0'
        }`}
        style={{ 
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          pointerEvents: isTouchDevice ? (controlsVisible ? 'auto' : 'none') : 'auto'
        }}
      >
        {/* Progress bar - Updated with drag functionality */}
        <div 
          ref={progressBarRef}
          className="w-full h-0.5 sm:h-1 bg-gray-600/60 cursor-pointer mb-2 sm:mb-3 rounded-full relative"
          onClick={handleProgressClick}
          onMouseDown={handleProgressMouseDown}
        >
          <div 
            className="h-full bg-indigo-600 relative rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div 
              className={`absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-indigo-600 rounded-full transition-transform hover:scale-150 ${
                isTouchDevice 
                  ? controlsVisible ? 'opacity-100' : 'opacity-0' 
                  : isDragging ? 'opacity-100 scale-150' : 'opacity-0 group-hover:opacity-100'
              }`}
            />
          </div>
        </div>

        {/* Controls - Updated with volume and fullscreen */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={handlePlayPause}
              className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : (
                <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              )}
            </button>
            
            {/* Volume controls */}
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
                className="w-20 h-1 bg-gray-600/60 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            <span className="text-sm sm:text-base">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen button */}
          <button
            onClick={handleFullscreenToggle}
            className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
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
