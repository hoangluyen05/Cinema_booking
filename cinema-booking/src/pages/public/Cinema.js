import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";

function Cinema() {
  const navigate = useNavigate();

  const [cinemas, setCinemas] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);

  /* ================= FETCH CINEMAS ================= */
  useEffect(() => {
    fetch("http://localhost:8080/api/cinemas")
      .then((res) => res.json())
      .then((data) => setCinemas(data))
      .catch(() => setCinemas([]));
  }, []);

  /* ================= FETCH MOVIES ================= */
  useEffect(() => {
    if (!selectedCinema) {
      fetch("http://localhost:8080/api/movies/now-showing")
        .then((res) => res.json())
        .then((data) => setNowShowing(Array.isArray(data) ? data : []));

      fetch("http://localhost:8080/api/movies/comming-showing")
        .then((res) => res.json())
        .then((data) => setComingSoon(Array.isArray(data) ? data : []));
    } else {
      fetch(`http://localhost:8080/api/movies/cinema/${selectedCinema.id}`)
        .then((res) => res.json())
        .then((data) => {
          const movies = Array.isArray(data) ? data : [];

          setNowShowing(movies.filter((m) => m.status === "now_showing"));
          setComingSoon(movies.filter((m) => m.status === "coming_soon"));
        });
    }
  }, [selectedCinema]);

  /* ================= FILTER CINEMA ================= */
  const filteredCinemas = cinemas.filter((c) =>
    c?.cinemaName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCinema = (cinema) => {
    setSelectedCinema(cinema);
    setSearch(cinema.cinemaName);
    setShowDropdown(false);
  };

  const clearCinema = () => {
    setSelectedCinema(null);
    setSearch("");
  };

  /* ================= MOVIE ROW ================= */
  const MovieRow = ({ title, list }) => (
    <>
      <h3 style={styles.title}>{title}</h3>

      <div style={styles.horizontalScroll}>
        {list.map((movie) => (
          <div
            key={movie.id}
            style={styles.movieCard}
            onClick={() =>
              navigate(`/movies/${movie.id}`, { state: movie })
            }
          >
            <img
              src={movie.poster}
              alt={movie.title}
              style={styles.movieImg}
            />
            <div style={styles.movieTitle}>{movie.title}</div>
          </div>
        ))}
      </div>
    </>
  );

  /* ================= UI ================= */
  return (
    <PublicLayout>
      <div style={styles.app}>
        <div style={styles.content}>
          <h2>🎬 Rạp phim</h2>

          {/* SEARCH CINEMA */}
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="🔍 Chọn rạp..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
                setSelectedCinema(null);
              }}
              onFocus={() => setShowDropdown(true)}
              style={styles.searchInput}
            />

            {selectedCinema && (
              <button style={styles.clearBtn} onClick={clearCinema}>
                ✕
              </button>
            )}

            {showDropdown && search && (
              <div style={styles.dropdown}>
                {filteredCinemas.length > 0 ? (
                  filteredCinemas.map((c) => (
                    <div
                      key={c.id}
                      style={styles.dropdownItem}
                      onClick={() => handleSelectCinema(c)}
                    >
                      {c.cinemaName}
                    </div>
                  ))
                ) : (
                  <div style={styles.dropdownItem}>
                    Không tìm thấy rạp
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOVIES */}
          <MovieRow
            title="🎬 Phim đang chiếu"
            list={nowShowing}
          />

          <MovieRow
            title="🎥 Phim sắp chiếu"
            list={comingSoon}
          />
        </div>
      </div>
    </PublicLayout>
  );
}

/* ================= STYLE ================= */

const styles = {
  app: {
    background: "#000",
    color: "white",
    minHeight: "100vh",
  },

  content: {
    padding: "40px 60px",
  },

  title: {
    borderLeft: "5px solid #e50914",
    paddingLeft: "15px",
    margin: "30px 0 20px",
  },

  /* 🔥 SCROLL NGANG */
  horizontalScroll: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "15px",
    scrollBehavior: "smooth",
  },

  movieCard: {
    minWidth: "180px",
    background: "#222",
    borderRadius: "10px",
    overflow: "hidden",
    cursor: "pointer",
    flexShrink: 0,
    transition: "0.3s",
  },

  movieImg: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
  },

  movieTitle: {
    padding: "10px",
  },

  /* SEARCH */
  searchBox: {
    position: "relative",
    width: "350px",
  },

  searchInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "20px",
    border: "none",
  },

  clearBtn: {
    position: "absolute",
    right: "10px",
    top: "5px",
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  dropdown: {
    position: "absolute",
    top: "45px",
    width: "100%",
    background: "#222",
    borderRadius: "10px",
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: 10,
  },

  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #333",
  },
};

export default Cinema;