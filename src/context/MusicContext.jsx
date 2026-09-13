import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { SONGS } from '../data/songs';
import { MusicContext } from './MusicContextInstance';

const TARGET_DURATION = 60; // 1 minute per track

export const MusicProvider = ({ children }) => {
  const [songs] = useState(SONGS);
  const [currentTrack, setCurrentTrack] = useState(SONGS[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(TARGET_DURATION);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const savedLikes = localStorage.getItem('musicfy-liked-songs');
      return savedLikes !== null ? JSON.parse(savedLikes) : [2, 5, 10];
    } catch (e) {
      console.error('Failed to load likes from localStorage:', e);
      return [2, 5, 10];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('musicfy-theme') || 'dark';
  });

  const audioRef = useRef(new Audio());
  const playNextRef = useRef(() => {});
  const isRepeatRef = useRef(isRepeat);
  const loopCountRef = useRef(0);
  const currentTimeRef = useRef(0);

  // Sync theme with document element and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('musicfy-theme', theme);
  }, [theme]);

  // Sync liked songs with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('musicfy-liked-songs', JSON.stringify(likedSongIds));
    } catch (e) {
      console.error('Failed to save likes to localStorage:', e);
    }
  }, [likedSongIds]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Sync ref with state
  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  // Sync track changes
  const playTrack = useCallback((track) => {
    const audio = audioRef.current;
    if (!track) return;

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
      return;
    }

    loopCountRef.current = 0;
    currentTimeRef.current = 0;
    setCurrentTime(0);
    setCurrentTrack(track);
    audio.src = track.audioUrl;
    audio.currentTime = 0;
    audio.play().catch(console.error);
  }, [currentTrack?.id, isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentTrack) {
      if (songs.length > 0) playTrack(songs[0]);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  }, [currentTrack, isPlaying, playTrack, songs]);

  const playNext = useCallback(() => {
    if (songs.length === 0) return;
    loopCountRef.current = 0;
    currentTimeRef.current = 0;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      playTrack(songs[randomIndex]);
      return;
    }

    const currentIndex = songs.findIndex((s) => s.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playTrack(songs[nextIndex]);
  }, [songs, isShuffle, currentTrack?.id, playTrack]);

  // Keep playNextRef up to date
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    const clampedTime = Math.max(0, Math.min(TARGET_DURATION, time));
    const baseDur = audio.duration && !isNaN(audio.duration) ? audio.duration : 30;

    if (clampedTime < baseDur) {
      loopCountRef.current = 0;
      audio.currentTime = clampedTime;
    } else {
      loopCountRef.current = 1;
      audio.currentTime = Math.min(baseDur - 0.1, clampedTime - baseDur);
    }

    currentTimeRef.current = clampedTime;
    setCurrentTime(clampedTime);
  }, []);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (currentTimeRef.current > 3) {
      seek(0);
      audio.currentTime = 0;
      return;
    }

    if (songs.length === 0) return;
    loopCountRef.current = 0;
    currentTimeRef.current = 0;
    const currentIndex = songs.findIndex((s) => s.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playTrack(songs[prevIndex]);
  }, [songs, currentTrack?.id, playTrack, seek]);

  const handleVolumeChange = useCallback((newVolume) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolume(clamped);
    setIsMuted(clamped === 0);
    audioRef.current.volume = clamped;
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (isMuted) {
      setIsMuted(false);
      audio.volume = volume > 0 ? volume : 0.8;
      if (volume === 0) setVolume(0.8);
    } else {
      setIsMuted(true);
      audio.volume = 0;
    }
  }, [isMuted, volume]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

  const toggleLike = useCallback((trackId) => {
    setLikedSongIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  }, []);

  const isLiked = useCallback((trackId) => {
    return likedSongIds.includes(trackId);
  }, [likedSongIds]);

  // Audio element listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.8;

    const handleTimeUpdate = () => {
      const baseDur = audio.duration && !isNaN(audio.duration) ? audio.duration : 30;
      const total = Math.min(TARGET_DURATION, loopCountRef.current * baseDur + audio.currentTime);
      currentTimeRef.current = total;
      setCurrentTime(total);

      // Transition to next loop when approaching 30s
      if (loopCountRef.current === 0 && audio.currentTime >= baseDur - 0.25) {
        loopCountRef.current = 1;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (loopCountRef.current === 1 && total >= TARGET_DURATION) {
        loopCountRef.current = 0;
        currentTimeRef.current = 0;
        if (isRepeatRef.current) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        } else {
          playNextRef.current();
        }
      }
    };

    const handleEnded = () => {
      if (loopCountRef.current === 0) {
        loopCountRef.current = 1;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        loopCountRef.current = 0;
        currentTimeRef.current = 0;
        if (isRepeatRef.current) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        } else {
          playNextRef.current();
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, []);

  // Sync initial track URL once when currentTrack changes if not already set
  useEffect(() => {
    if (currentTrack?.audioUrl && !audioRef.current.src) {
      audioRef.current.src = currentTrack.audioUrl;
    }
  }, [currentTrack?.audioUrl]);

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(Math.min(TARGET_DURATION, currentTimeRef.current + 5));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(Math.max(0, currentTimeRef.current - 5));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(volume - 0.05);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek, volume, handleVolumeChange, toggleMute]);

  // Filtered songs
  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === 'all' ||
        song.genre.toLowerCase() === selectedGenre.toLowerCase();

      return matchesSearch && matchesGenre;
    });
  }, [songs, searchQuery, selectedGenre]);

  const likedSongs = useMemo(() => {
    return songs.filter((song) => likedSongIds.includes(song.id));
  }, [songs, likedSongIds]);

  const value = {
    songs,
    filteredSongs,
    likedSongs,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    likedSongIds,
    searchQuery,
    selectedGenre,
    theme,
    toggleTheme,
    playTrack,
    togglePlay,
    playNext,
    playPrev,
    seek,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    setSearchQuery,
    setSelectedGenre,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export default MusicProvider;
