import React, { useState, useRef, useMemo, useCallback } from "react";
import { Upload, X, Tag, MapPin, Users, Sparkles, Search, Plus, Check, FolderHeart, ChevronDown, Image as ImageIcon } from "lucide-react";

// ---------- Tag taxonomy ----------
const MILESTONE_TAGS = [
  "First steps", "First words", "First smile", "First haircut", "Sleeping through night",
  "Started crawling", "Started walking", "First tooth", "First birthday", "First food",
  "Potty training", "First day of daycare", "Holiday", "Sick day", "Just because"
];

const PEOPLE_TAGS = ["Mom", "Dad", "Grandma", "Grandpa", "Sibling", "Cousins", "Friends", "Daycare"];

const PLACE_TAGS = ["Home", "Park", "Grandma's house", "Daycare", "Beach", "Doctor's office", "Restaurant", "On vacation"];

const TAG_GROUPS = [
  { key: "milestone", label: "Milestones", color: "#D4A857", bg: "#FBF1DC", icon: Sparkles, options: MILESTONE_TAGS },
  { key: "people", label: "People", color: "#8A9B7E", bg: "#EEF2EA", icon: Users, options: PEOPLE_TAGS },
  { key: "place", label: "Places", color: "#7B92AD", bg: "#EAEEF4", icon: MapPin, options: PLACE_TAGS },
];

const tagMeta = (tag) => {
  for (const g of TAG_GROUPS) {
    if (g.options.includes(tag)) return g;
  }
  return TAG_GROUPS[0];
};

// ---------- Demo seed photos (gradient placeholders so it works without uploads) ----------
const DEMO_GRADIENTS = [
  ["#FBE3D6", "#F3B79A"], ["#E3EEF8", "#AFCBE6"], ["#EAF3E4", "#B6CFA6"],
  ["#FCEFD9", "#F2CE8F"], ["#F3E2EE", "#DDB6D6"], ["#E0F0EE", "#A9D6CF"],
  ["#FBE9E0", "#F0BFA8"], ["#E8E9F5", "#C5C7E8"], ["#FFF3D6", "#FBD98C"],
];

const seedPhotos = () => {
  const seeds = [
    { tags: ["First steps", "Home", "Mom"], date: "2026-01-14" },
    { tags: ["First smile", "Home"], date: "2025-11-02" },
    { tags: ["Park", "Dad"], date: "2026-02-22" },
    { tags: ["Holiday", "Grandma", "Grandma's house"], date: "2025-12-25" },
    { tags: ["First birthday", "Home", "Mom", "Dad"], date: "2026-03-10" },
    { tags: ["Beach", "Sibling"], date: "2026-04-05" },
    { tags: ["Started crawling", "Home"], date: "2025-10-18" },
    { tags: ["First tooth"], date: "2025-09-30" },
    { tags: ["Daycare", "First day of daycare", "Friends"], date: "2026-05-01" },
    { tags: ["Just because", "Home", "Mom"], date: "2026-05-20" },
    { tags: ["Started walking", "Park", "Dad"], date: "2026-02-28" },
    { tags: ["First words", "Home", "Grandma"], date: "2026-01-30" },
  ];
  return seeds.map((s, i) => ({
    id: `seed-${i}`,
    src: null,
    gradient: DEMO_GRADIENTS[i % DEMO_GRADIENTS.length],
    tags: s.tags,
    date: s.date,
  }));
};

function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// ---------- Photo thumbnail ----------
function PhotoThumb({ photo, onClick, selected, selectMode, onToggleSelect }) {
  const primaryTag = photo.tags[0];
  const meta = primaryTag ? tagMeta(primaryTag) : null;

  return (
    <div
      className="photo-thumb"
      onClick={() => (selectMode ? onToggleSelect(photo.id) : onClick(photo))}
      style={{
        background: photo.src ? `url(${photo.src}) center/cover` : `linear-gradient(135deg, ${photo.gradient[0]}, ${photo.gradient[1]})`,
      }}
    >
      {selectMode && (
        <div className={`select-dot ${selected ? "selected" : ""}`}>
          {selected && <Check size={14} strokeWidth={3} />}
        </div>
      )}
      {!photo.src && <ImageIcon className="placeholder-icon" size={28} strokeWidth={1.5} />}
      {meta && (
        <div className="sticker" style={{ background: meta.color }}>
          <meta.icon size={11} strokeWidth={2.5} />
          <span>{primaryTag}</span>
        </div>
      )}
      {photo.tags.length > 1 && (
        <div className="extra-count">+{photo.tags.length - 1}</div>
      )}
    </div>
  );
}

// ---------- Tag picker for detail view ----------
function TagPicker({ activeTags, onToggle, onAddCustom }) {
  const [customGroup, setCustomGroup] = useState(null);
  const [customValue, setCustomValue] = useState("");

  return (
    <div className="tag-picker">
      {TAG_GROUPS.map((g) => (
        <div key={g.key} className="tag-group">
          <div className="tag-group-label" style={{ color: g.color }}>
            <g.icon size={14} strokeWidth={2.5} />
            {g.label}
          </div>
          <div className="tag-chip-row">
            {g.options.map((opt) => {
              const active = activeTags.includes(opt);
              return (
                <button
                  key={opt}
                  className={`tag-chip ${active ? "active" : ""}`}
                  style={active ? { background: g.color, borderColor: g.color, color: "#fff" } : { borderColor: g.bg, color: "#6b6660" }}
                  onClick={() => onToggle(opt)}
                >
                  {opt}
                </button>
              );
            })}
            {customGroup === g.key ? (
              <span className="custom-input-wrap">
                <input
                  autoFocus
                  className="custom-input"
                  placeholder="New tag…"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customValue.trim()) {
                      onAddCustom(g.key, customValue.trim());
                      setCustomValue("");
                      setCustomGroup(null);
                    } else if (e.key === "Escape") {
                      setCustomGroup(null);
                      setCustomValue("");
                    }
                  }}
                  onBlur={() => {
                    if (customValue.trim()) onAddCustom(g.key, customValue.trim());
                    setCustomGroup(null);
                    setCustomValue("");
                  }}
                />
              </span>
            ) : (
              <button className="tag-chip add-chip" onClick={() => setCustomGroup(g.key)}>
                <Plus size={12} strokeWidth={3} /> Add
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Detail / lightbox ----------
function PhotoDetail({ photo, onClose, onUpdateTags, onAddCustomTag }) {
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div
          className="detail-image"
          style={{
            background: photo.src ? `url(${photo.src}) center/cover` : `linear-gradient(135deg, ${photo.gradient[0]}, ${photo.gradient[1]})`,
          }}
        >
          {!photo.src && <ImageIcon className="placeholder-icon" size={48} strokeWidth={1.5} />}
        </div>
        <div className="detail-body">
          <div className="detail-date">{formatDate(photo.date)}</div>
          <h3 className="detail-heading">
            <Tag size={16} strokeWidth={2.5} /> Tag this photo
          </h3>
          <p className="detail-sub">Tap tags to add stickers. They'll help you find this photo later.</p>
          <TagPicker
            activeTags={photo.tags}
            onToggle={(tag) => onUpdateTags(photo.id, tag)}
            onAddCustom={(groupKey, value) => onAddCustomTag(groupKey, value, photo.id)}
          />
        </div>
      </div>
    </div>
  );
}

// ---------- Album builder ----------
function AlbumBuilder({ photos, selectedIds, onClose, onClear }) {
  const selected = photos.filter((p) => selectedIds.includes(p.id));
  const [title, setTitle] = useState("Our favorite moments");
  const [exported, setExported] = useState(false);

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel album-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="detail-body">
          <h3 className="detail-heading">
            <FolderHeart size={18} strokeWidth={2.5} /> Build an album
          </h3>
          <p className="detail-sub">{selected.length} photo{selected.length !== 1 ? "s" : ""} selected. Give your album a name, then export to share.</p>
          <input
            className="album-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Album title"
          />
          <div className="album-grid">
            {selected.map((p) => (
              <div
                key={p.id}
                className="album-grid-thumb"
                style={{ background: p.src ? `url(${p.src}) center/cover` : `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
              />
            ))}
            {selected.length === 0 && (
              <div className="empty-album">No photos selected yet. Close this, then tap "Select" and choose photos to add.</div>
            )}
          </div>
          {selected.length > 0 && (
            <button className="btn-primary export-btn" onClick={() => setExported(true)}>
              {exported ? <><Check size={16} strokeWidth={3} /> Ready to share</> : "Export album"}
            </button>
          )}
          {exported && (
            <p className="export-note">"{title}" is ready — in the full app this generates a shareable link or PDF book with all {selected.length} photos and their captions.</p>
          )}
          {selected.length > 0 && (
            <button className="link-btn" onClick={onClear}>Clear selection</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Main App ----------
export default function App() {
  const [photos, setPhotos] = useState(seedPhotos());
  const [activeFilters, setActiveFilters] = useState([]);
  const [detailPhoto, setDetailPhoto] = useState(null);
  const [search, setSearch] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    const newPhotos = Array.from(files).map((file, i) => ({
      id: `up-${Date.now()}-${i}`,
      src: URL.createObjectURL(file),
      gradient: DEMO_GRADIENTS[i % DEMO_GRADIENTS.length],
      tags: [],
      date: new Date().toISOString().slice(0, 10),
    }));
    setPhotos((prev) => [...newPhotos, ...prev]);
  }, []);

  const updateTags = useCallback((id, tag) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const has = p.tags.includes(tag);
        return { ...p, tags: has ? p.tags.filter((t) => t !== tag) : [...p.tags, tag] };
      })
    );
    setDetailPhoto((prev) => {
      if (!prev || prev.id !== id) return prev;
      const has = prev.tags.includes(tag);
      return { ...prev, tags: has ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag] };
    });
  }, []);

  const [customTags, setCustomTags] = useState({ milestone: [], people: [], place: [] });

  const addCustomTag = useCallback((groupKey, value, photoId) => {
    setCustomTags((prev) => (prev[groupKey].includes(value) ? prev : { ...prev, [groupKey]: [...prev[groupKey], value] }));
    updateTags(photoId, value);
  }, [updateTags]);

  const toggleFilter = (tag) => {
    setActiveFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filteredPhotos = useMemo(() => {
    let list = photos;
    if (activeFilters.length > 0) {
      list = list.filter((p) => activeFilters.every((f) => p.tags.includes(f)));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [photos, activeFilters, search]);

  // group by month for chronological sections
  const grouped = useMemo(() => {
    const groups = {};
    filteredPhotos.forEach((p) => {
      const key = new Date(p.date + "T00:00:00").toLocaleDateString(undefined, { month: "long", year: "numeric" });
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    return groups;
  }, [filteredPhotos]);

  const allGroupsForSidebar = [
    ...TAG_GROUPS.map((g) => ({ ...g, options: [...g.options, ...customTags[g.key]] })),
  ];

  return (
    <div className="app-shell">
      <style>{CSS}</style>

      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">🌿</span>
          <span className="brand-name">Pebble</span>
        </div>
        <div className="header-actions">
          <div className="search-wrap">
            <Search size={15} strokeWidth={2.5} />
            <input
              placeholder="Search tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={15} strokeWidth={2.5} /> Add photos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
          />
          <button
            className={`btn-secondary ${selectMode ? "active" : ""}`}
            onClick={() => {
              setSelectMode((s) => !s);
              if (selectMode) setSelectedIds([]);
            }}
          >
            {selectMode ? "Cancel" : "Select"}
          </button>
          {selectMode && (
            <button className="btn-primary" onClick={() => setAlbumOpen(true)}>
              <FolderHeart size={15} strokeWidth={2.5} /> Album ({selectedIds.length})
            </button>
          )}
        </div>
      </header>

      <div className="app-body">
        <button className="filter-toggle" onClick={() => setFilterPanelOpen((o) => !o)}>
          <Tag size={14} strokeWidth={2.5} />
          Filters {activeFilters.length > 0 && <span className="filter-count">{activeFilters.length}</span>}
          <ChevronDown size={14} className={filterPanelOpen ? "chev open" : "chev"} />
        </button>

        <aside className={`sidebar ${filterPanelOpen ? "open" : ""}`}>
          {activeFilters.length > 0 && (
            <div className="active-filters">
              {activeFilters.map((f) => {
                const g = tagMeta(f);
                return (
                  <button key={f} className="active-filter-chip" style={{ background: g.color }} onClick={() => toggleFilter(f)}>
                    {f} <X size={11} strokeWidth={3} />
                  </button>
                );
              })}
              <button className="clear-all" onClick={() => setActiveFilters([])}>Clear all</button>
            </div>
          )}
          {allGroupsForSidebar.map((g) => (
            <div key={g.key} className="sidebar-group">
              <div className="sidebar-group-label" style={{ color: g.color }}>
                <g.icon size={14} strokeWidth={2.5} />
                {g.label}
              </div>
              <div className="sidebar-chip-list">
                {g.options.map((opt) => (
                  <button
                    key={opt}
                    className={`sidebar-chip ${activeFilters.includes(opt) ? "active" : ""}`}
                    style={activeFilters.includes(opt) ? { background: g.color, color: "#fff", borderColor: g.color } : { borderColor: g.bg }}
                    onClick={() => toggleFilter(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <main className="gallery">
          {Object.keys(grouped).length === 0 && (
            <div className="empty-state">
              <Sparkles size={32} strokeWidth={1.5} />
              <p>No photos match these filters yet.</p>
            </div>
          )}
          {Object.entries(grouped).map(([month, items]) => (
            <section key={month} className="month-section">
              <h2 className="month-heading">{month}</h2>
              <div className="photo-grid">
                {items.map((photo) => (
                  <PhotoThumb
                    key={photo.id}
                    photo={photo}
                    onClick={setDetailPhoto}
                    selected={selectedIds.includes(photo.id)}
                    selectMode={selectMode}
                    onToggleSelect={toggleSelect}
                  />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>

      {detailPhoto && (
        <PhotoDetail
          photo={photos.find((p) => p.id === detailPhoto.id) || detailPhoto}
          onClose={() => setDetailPhoto(null)}
          onUpdateTags={updateTags}
          onAddCustomTag={addCustomTag}
        />
      )}

      {albumOpen && (
        <AlbumBuilder
          photos={photos}
          selectedIds={selectedIds}
          onClose={() => setAlbumOpen(false)}
          onClear={() => setSelectedIds([])}
        />
      )}
    </div>
  );
}

// ---------- Styles ----------
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

.app-shell {
  font-family: 'Inter', sans-serif;
  background: #FBF6EF;
  color: #2B2925;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #ECE4D6;
  background: #FBF6EF;
  position: sticky;
  top: 0;
  z-index: 20;
  flex-wrap: wrap;
}
.brand { display: flex; align-items: center; gap: 8px; }
.brand-mark { font-size: 22px; }
.brand-name {
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.5px;
  color: #2B2925;
}
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.search-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid #ECE4D6;
  border-radius: 999px;
  padding: 8px 14px;
  color: #A39B8E;
}
.search-wrap input {
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #2B2925;
  width: 140px;
}
.search-wrap input::placeholder { color: #C4BCAE; }

.btn-secondary, .btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13px;
  border-radius: 999px;
  padding: 9px 16px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.btn-secondary {
  background: #fff;
  border: 1px solid #ECE4D6;
  color: #2B2925;
}
.btn-secondary:hover { box-shadow: 0 2px 8px rgba(43,41,37,0.06); }
.btn-secondary.active {
  background: #2B2925;
  color: #FBF6EF;
  border-color: #2B2925;
}
.btn-primary {
  background: #D97B5C;
  color: #fff;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(217,123,92,0.35); }
.btn-primary:focus-visible, .btn-secondary:focus-visible, .tag-chip:focus-visible, .sidebar-chip:focus-visible {
  outline: 2px solid #D97B5C;
  outline-offset: 2px;
}

/* Body layout */
.app-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.filter-toggle {
  display: none;
}

/* Sidebar */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: 20px 16px;
  border-right: 1px solid #ECE4D6;
  overflow-y: auto;
  max-height: calc(100vh - 65px);
}
.sidebar-group { margin-bottom: 20px; }
.sidebar-group-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 10px;
}
.sidebar-chip-list { display: flex; flex-wrap: wrap; gap: 6px; }
.sidebar-chip {
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #ECE4D6;
  background: #fff;
  color: #6b6660;
  cursor: pointer;
  transition: all 0.12s ease;
}
.sidebar-chip:hover { border-color: #D97B5C; }
.sidebar-chip.active { font-weight: 600; }

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ECE4D6;
}
.active-filter-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 6px 10px;
  cursor: pointer;
}
.clear-all {
  font-size: 12px;
  font-weight: 600;
  color: #A39B8E;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 6px 0;
}

/* Gallery */
.gallery {
  flex: 1;
  padding: 24px 28px 60px;
  overflow-y: auto;
  max-height: calc(100vh - 65px);
}
.month-section { margin-bottom: 32px; }
.month-heading {
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 17px;
  margin: 0 0 14px;
  color: #2B2925;
}
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
.photo-thumb {
  position: relative;
  aspect-ratio: 1;
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.photo-thumb:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 18px rgba(43,41,37,0.12);
}
.placeholder-icon { color: rgba(43,41,37,0.25); }

.sticker {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.18);
  max-width: calc(100% - 16px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: stick-in 0.25s ease;
}
@keyframes stick-in {
  from { transform: scale(0.6) rotate(-8deg); opacity: 0; }
  to { transform: scale(1) rotate(-4deg); opacity: 1; }
}
.extra-count {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(43,41,37,0.55);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 999px;
}

.select-dot {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: rgba(255,255,255,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 2;
}
.select-dot.selected {
  background: #D97B5C;
  border-color: #D97B5C;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #A39B8E;
  padding: 60px 0;
  text-align: center;
}

/* Detail overlay */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(43,41,37,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.detail-panel {
  background: #FBF6EF;
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  max-height: 88vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(43,41,37,0.25);
}
.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(255,255,255,0.85);
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  color: #2B2925;
}
.detail-image {
  width: 100%;
  height: 280px;
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-body { padding: 22px 24px 28px; }
.detail-date {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #A39B8E;
  margin-bottom: 10px;
}
.detail-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 18px;
  margin: 0 0 6px;
}
.detail-sub {
  font-size: 13px;
  color: #8A8378;
  margin: 0 0 18px;
  line-height: 1.5;
}

/* Tag picker */
.tag-picker { display: flex; flex-direction: column; gap: 16px; }
.tag-group-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 8px;
}
.tag-chip-row { display: flex; flex-wrap: wrap; gap: 7px; }
.tag-chip {
  font-size: 12.5px;
  font-weight: 600;
  padding: 7px 13px;
  border-radius: 999px;
  border: 1.5px solid;
  background: #fff;
  cursor: pointer;
  transition: all 0.12s ease;
}
.tag-chip:hover { transform: translateY(-1px); }
.add-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1.5px dashed #D8CFC0 !important;
  color: #A39B8E !important;
  background: transparent;
}
.custom-input-wrap { display: inline-flex; }
.custom-input {
  font-size: 12.5px;
  font-weight: 600;
  padding: 7px 13px;
  border-radius: 999px;
  border: 1.5px solid #D97B5C;
  outline: none;
  width: 110px;
  font-family: 'Inter', sans-serif;
}

/* Album builder */
.album-panel { max-width: 560px; }
.album-title-input {
  width: 100%;
  font-family: 'Fredoka', sans-serif;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid #ECE4D6;
  padding: 8px 0;
  margin-bottom: 18px;
  outline: none;
  background: transparent;
  color: #2B2925;
}
.album-title-input:focus { border-color: #D97B5C; }
.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  margin-bottom: 18px;
}
.album-grid-thumb {
  aspect-ratio: 1;
  border-radius: 10px;
}
.empty-album {
  grid-column: 1 / -1;
  font-size: 13px;
  color: #A39B8E;
  text-align: center;
  padding: 30px 10px;
  border: 1.5px dashed #ECE4D6;
  border-radius: 12px;
}
.export-btn { width: 100%; justify-content: center; padding: 12px; font-size: 14px; }
.export-note {
  margin-top: 12px;
  font-size: 12.5px;
  color: #7A8C70;
  background: #EEF2EA;
  border-radius: 10px;
  padding: 10px 12px;
  line-height: 1.5;
}
.link-btn {
  display: block;
  margin: 12px auto 0;
  background: none;
  border: none;
  color: #A39B8E;
  font-size: 12.5px;
  text-decoration: underline;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 860px) {
  .app-header { padding: 12px 16px; }
  .search-wrap input { width: 90px; }
  .app-body { flex-direction: column; }
  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    width: calc(100% - 32px);
    margin: 12px 16px 0;
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px solid #ECE4D6;
    background: #fff;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 13px;
    color: #2B2925;
    cursor: pointer;
  }
  .filter-count {
    background: #D97B5C;
    color: #fff;
    font-size: 11px;
    border-radius: 999px;
    padding: 1px 7px;
    margin-left: -2px;
  }
  .chev { margin-left: auto; transition: transform 0.15s ease; }
  .chev.open { transform: rotate(180deg); }
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ECE4D6;
    max-height: 0;
    overflow: hidden;
    padding: 0 16px;
    transition: max-height 0.2s ease, padding 0.2s ease;
  }
  .sidebar.open {
    max-height: 60vh;
    overflow-y: auto;
    padding: 16px;
  }
  .gallery { padding: 16px 16px 60px; max-height: none; }
  .photo-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
  .detail-image { height: 200px; }
}
`;
