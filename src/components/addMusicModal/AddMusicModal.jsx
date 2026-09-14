import { useState, useRef, useEffect, useId } from 'react';
import {
  X,
  Music,
  User,
  Disc,
  Image as ImageIcon,
  Tag,
  Calendar,
  Link,
  Upload,
  Play,
  Pause,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import './AddMusicModal.css';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

const PRESET_GENRES = [
  'Pop',
  'Hip-Hop/Rap',
  'Phonk',
  'Alternative',
  'Dance',
  'R&B/Soul',
  'Singer/Songwriter',
  'Rock',
  'Electronic',
  'Lo-Fi',
  'Jazz',
  'Custom'
];

const isValidUrl = (string) => {
  if (!string) return false;
  if (string.startsWith('blob:') || string.startsWith('data:')) return true;
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const AddMusicModal = ({ isOpen, onClose }) => {
  const { addSong } = useMusic();
  const titleId = useId();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    audioUrl: '',
    cover: '',
    genre: 'Pop',
    customGenre: '',
    year: new Date().getFullYear(),
  });

  const [audioSourceType, setAudioSourceType] = useState('url'); // 'url' | 'file'
  const [coverSourceType, setCoverSourceType] = useState('url'); // 'url' | 'file'
  const [audioFileName, setAudioFileName] = useState('');
  const [coverFileName, setCoverFileName] = useState('');

  // Audio preview state inside modal
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [detectedDuration, setDetectedDuration] = useState(null);
  const previewAudioRef = useRef(new Audio());

  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Focus trap and ESC key listener
  useEffect(() => {
    if (!isOpen) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        setIsPreviewPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle preview audio state listeners
  useEffect(() => {
    const audio = previewAudioRef.current;

    const handlePlay = () => setIsPreviewPlaying(true);
    const handlePause = () => setIsPreviewPlaying(false);
    const handleEnded = () => setIsPreviewPlaying(false);
    const handleLoaded = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDetectedDuration(Math.round(audio.duration));
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoaded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.pause();
    };
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    // If audioUrl changes, reset preview
    if (name === 'audioUrl') {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.src = value;
      }
      setIsPreviewPlaying(false);
      setDetectedDuration(null);
    }
  };

  // Handle local audio file selection
  const handleAudioFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setAudioFileName(file.name);
    setFormData((prev) => {
      // Auto fill title if empty
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      return {
        ...prev,
        audioUrl: fileUrl,
        title: prev.title || nameWithoutExt,
      };
    });

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.src = fileUrl;
    }
    setIsPreviewPlaying(false);

    if (errors.audioUrl) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.audioUrl;
        return next;
      });
    }
  };

  // Handle local cover image file selection
  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setCoverFileName(file.name);
    setFormData((prev) => ({ ...prev, cover: fileUrl }));

    if (errors.cover) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.cover;
        return next;
      });
    }
  };

  const togglePreviewPlay = () => {
    if (!formData.audioUrl) return;
    const audio = previewAudioRef.current;

    if (audio.src !== formData.audioUrl) {
      audio.src = formData.audioUrl;
    }

    if (isPlayingPreview()) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.warn('Audio preview play error:', err);
        setErrors((prev) => ({ ...prev, audioUrl: "Audio manbasini o'qib bo'lmadi yoki format qo'llab-quvvatlanmaydi" }));
      });
    }
  };

  const isPlayingPreview = () => isPreviewPlaying;

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Musiqa nomi kiritilishi shart';
    } else if (formData.title.trim().length > 120) {
      newErrors.title = "Musiqa nomi juda uzun (maksimal 120 belgi)";
    }

    if (!formData.artist.trim()) {
      newErrors.artist = "Ijrochi (Artist) kiritilishi shart";
    } else if (formData.artist.trim().length > 100) {
      newErrors.artist = "Ijrochi nomi juda uzun (maksimal 100 belgi)";
    }

    if (!formData.audioUrl.trim()) {
      newErrors.audioUrl = 'Audio havola yoki fayl kiritilishi shart';
    } else if (audioSourceType === 'url' && !isValidUrl(formData.audioUrl.trim())) {
      newErrors.audioUrl = "To'g'ri audio havolasini kiriting (https://...)";
    }

    if (formData.cover.trim() && coverSourceType === 'url' && !isValidUrl(formData.cover.trim())) {
      newErrors.cover = "To'g'ri rasm havolasini kiriting (https://...)";
    }

    if (formData.genre === 'Custom' && !formData.customGenre.trim()) {
      newErrors.customGenre = 'Maxsus janr nomini kiriting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDurationString = (sec) => {
    if (!sec || isNaN(sec)) return '1:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const selectedGenre =
        formData.genre === 'Custom' ? formData.customGenre.trim() : formData.genre;

      const dur = detectedDuration || 60;

      const newSong = {
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        album: formData.album.trim() || `${formData.title.trim()} - Single`,
        cover: formData.cover.trim() || DEFAULT_COVER,
        audioUrl: formData.audioUrl.trim(),
        genre: selectedGenre,
        duration: dur,
        durationFormatted: formatDurationString(dur),
        year: parseInt(formData.year, 10) || new Date().getFullYear(),
      };

      addSong(newSong);

      // Stop any preview sound
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }

      // Reset form & close
      setFormData({
        title: '',
        artist: '',
        album: '',
        audioUrl: '',
        cover: '',
        genre: 'Pop',
        customGenre: '',
        year: new Date().getFullYear(),
      });
      setAudioFileName('');
      setCoverFileName('');
      setErrors({});
      onClose();
    } catch (err) {
      console.error('Failed to add song:', err);
      setErrors({ form: "Musiqani qo'shishda xatolik yuz berdi" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="modal-dialog"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-title-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 id={titleId} className="modal-title">
                Yangi Musiqa Qo‘shish
              </h2>
              <p className="modal-subtitle">
                O‘z trekingizni audio havola yoki fayl orqali kutubxonaga kiriting
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Modalni yopish"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {errors.form && (
            <div className="form-alert form-alert-error">
              <AlertCircle size={16} />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="modal-grid">
            {/* Left: Inputs */}
            <div className="modal-inputs-col">
              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="song-title">
                  <Music size={14} className="label-icon" />
                  <span>Musiqa nomi <b className="req-star">*</b></span>
                </label>
                <input
                  ref={firstInputRef}
                  id="song-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Masalan: Starboy, Believer..."
                  className={`form-input ${errors.title ? 'is-invalid' : ''}`}
                  autoComplete="off"
                />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>

              {/* Artist */}
              <div className="form-group">
                <label className="form-label" htmlFor="song-artist">
                  <User size={14} className="label-icon" />
                  <span>Ijrochi / San'atkor <b className="req-star">*</b></span>
                </label>
                <input
                  id="song-artist"
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  placeholder="Masalan: The Weeknd, Sia, Eminem..."
                  className={`form-input ${errors.artist ? 'is-invalid' : ''}`}
                  autoComplete="off"
                />
                {errors.artist && <span className="field-error">{errors.artist}</span>}
              </div>

              {/* Audio Source Switcher */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="song-audio">
                    <Disc size={14} className="label-icon" />
                    <span>Audio Manbasi <b className="req-star">*</b></span>
                  </label>
                  <div className="source-switcher">
                    <button
                      type="button"
                      className={`source-btn ${audioSourceType === 'url' ? 'active' : ''}`}
                      onClick={() => setAudioSourceType('url')}
                    >
                      <Link size={12} /> URL Havola
                    </button>
                    <button
                      type="button"
                      className={`source-btn ${audioSourceType === 'file' ? 'active' : ''}`}
                      onClick={() => setAudioSourceType('file')}
                    >
                      <Upload size={12} /> Fayl yuklash
                    </button>
                  </div>
                </div>

                {audioSourceType === 'url' ? (
                  <div className="input-with-preview">
                    <input
                      id="song-audio"
                      type="url"
                      name="audioUrl"
                      value={formData.audioUrl}
                      onChange={handleChange}
                      placeholder="https://.../track.mp3 yoki direct stream"
                      className={`form-input ${errors.audioUrl ? 'is-invalid' : ''}`}
                      autoComplete="off"
                    />
                    {formData.audioUrl && (
                      <button
                        type="button"
                        onClick={togglePreviewPlay}
                        className={`preview-play-btn ${isPreviewPlaying ? 'playing' : ''}`}
                        title={isPreviewPlaying ? "Sinovni to'xtatish" : "Audioni eshitib ko'rish"}
                      >
                        {isPreviewPlaying ? <Pause size={14} /> : <Play size={14} />}
                        <span>{isPreviewPlaying ? "Pauza" : "Sinab ko'rish"}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="file-drop-area">
                    <input
                      id="audio-file-input"
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileChange}
                      className="file-hidden-input"
                    />
                    <label htmlFor="audio-file-input" className="file-drop-label">
                      <Upload size={18} className="file-drop-icon" />
                      <span className="file-drop-text">
                        {audioFileName ? audioFileName : 'Kompyuterdan audio fayl (.mp3, .m4a, .wav) tanlang'}
                      </span>
                    </label>
                    {formData.audioUrl && (
                      <button
                        type="button"
                        onClick={togglePreviewPlay}
                        className={`preview-play-btn file-preview-btn ${isPreviewPlaying ? 'playing' : ''}`}
                      >
                        {isPreviewPlaying ? <Pause size={14} /> : <Play size={14} />}
                        <span>{isPreviewPlaying ? "Pauza" : "Eshitib ko'rish"}</span>
                      </button>
                    )}
                  </div>
                )}
                {errors.audioUrl && <span className="field-error">{errors.audioUrl}</span>}
              </div>

              {/* Genre & Year Row */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="song-genre">
                    <Tag size={14} className="label-icon" />
                    <span>Janr / Turi</span>
                  </label>
                  <select
                    id="song-genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {PRESET_GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g === 'Custom' ? '✨ Boshqa (Maxsus yozish)...' : g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="song-year">
                    <Calendar size={14} className="label-icon" />
                    <span>Yil</span>
                  </label>
                  <input
                    id="song-year"
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="1900"
                    max="2099"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Custom Genre Input if Custom is selected */}
              {formData.genre === 'Custom' && (
                <div className="form-group animated-fade-in">
                  <label className="form-label" htmlFor="custom-genre-input">
                    <span>Maxsus Janr Nomi <b className="req-star">*</b></span>
                  </label>
                  <input
                    id="custom-genre-input"
                    type="text"
                    name="customGenre"
                    value={formData.customGenre}
                    onChange={handleChange}
                    placeholder="Masalan: Synthwave, Deep House..."
                    className={`form-input ${errors.customGenre ? 'is-invalid' : ''}`}
                  />
                  {errors.customGenre && (
                    <span className="field-error">{errors.customGenre}</span>
                  )}
                </div>
              )}

              {/* Album */}
              <div className="form-group">
                <label className="form-label" htmlFor="song-album">
                  <Disc size={14} className="label-icon" />
                  <span>Albom (Ixtiyoriy)</span>
                </label>
                <input
                  id="song-album"
                  type="text"
                  name="album"
                  value={formData.album}
                  onChange={handleChange}
                  placeholder="Masalan: Starboy - Deluxe"
                  className="form-input"
                  autoComplete="off"
                />
              </div>

              {/* Cover Image */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="song-cover">
                    <ImageIcon size={14} className="label-icon" />
                    <span>Muqova Rasmi (Cover Art)</span>
                  </label>
                  <div className="source-switcher">
                    <button
                      type="button"
                      className={`source-btn ${coverSourceType === 'url' ? 'active' : ''}`}
                      onClick={() => setCoverSourceType('url')}
                    >
                      <Link size={12} /> URL
                    </button>
                    <button
                      type="button"
                      className={`source-btn ${coverSourceType === 'file' ? 'active' : ''}`}
                      onClick={() => setCoverSourceType('file')}
                    >
                      <Upload size={12} /> Rasm fayli
                    </button>
                  </div>
                </div>

                {coverSourceType === 'url' ? (
                  <input
                    id="song-cover"
                    type="url"
                    name="cover"
                    value={formData.cover}
                    onChange={handleChange}
                    placeholder="https://.../cover.jpg (Bo'sh qolsa standart rasm qo'yiladi)"
                    className={`form-input ${errors.cover ? 'is-invalid' : ''}`}
                    autoComplete="off"
                  />
                ) : (
                  <div className="file-drop-area">
                    <input
                      id="cover-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileChange}
                      className="file-hidden-input"
                    />
                    <label htmlFor="cover-file-input" className="file-drop-label">
                      <ImageIcon size={18} className="file-drop-icon" />
                      <span className="file-drop-text">
                        {coverFileName ? coverFileName : 'Kompyuterdan rasm tanlang (.jpg, .png, .webp)'}
                      </span>
                    </label>
                  </div>
                )}
                {errors.cover && <span className="field-error">{errors.cover}</span>}
              </div>
            </div>

            {/* Right: Live Preview Card */}
            <div className="modal-preview-col">
              <span className="preview-heading">Jonli Ko‘rinish (Live Preview)</span>
              <div className="preview-card">
                <div className="preview-cover-wrap">
                  <img
                    src={formData.cover || DEFAULT_COVER}
                    alt="Cover preview"
                    className="preview-cover-img"
                    onError={(e) => {
                      e.target.src = DEFAULT_COVER;
                    }}
                  />
                  <div className="preview-badge-genre">
                    {formData.genre === 'Custom'
                      ? formData.customGenre || 'Custom'
                      : formData.genre}
                  </div>
                </div>

                <div className="preview-info">
                  <h4 className="preview-title" title={formData.title || "Musiqa nomi"}>
                    {formData.title || "Musiqa nomi..."}
                  </h4>
                  <p className="preview-artist" title={formData.artist || "Ijrochi"}>
                    {formData.artist || "Ijrochi nomi..."}
                  </p>
                  <p className="preview-album">
                    {formData.album || (formData.title ? `${formData.title} - Single` : 'Albom...')} • {formData.year || new Date().getFullYear()}
                  </p>
                </div>
              </div>

              <div className="preview-hint">
                💡 Musiqa qo‘shilgach, u avtomatik ravishda kutubxonangizning eng yuqori qismiga joylashtiriladi va darhol ijro etishga tayyor bo‘ladi.
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="modal-submit-btn"
              disabled={isSubmitting}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? "Qo'shilmoqda..." : "Kutubxonaga Qo‘shish"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMusicModal;
