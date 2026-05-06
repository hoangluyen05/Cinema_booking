import { useState, useEffect } from "react";

const API = "http://localhost:8080/api/movies";

const ManageMovies = () => {
  const [tab, setTab] = useState("list");

  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [form, setForm] = useState({
    title: "",
    genre: "",
    duration: "",
    description: "",
    releaseDate: "",
    poster: "",
    status: "",
  });

  const [filters, setFilters] = useState({
    title: "",
    genre: "",
    status: "",
  });

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API}?${query}`);
    const data = await res.json();
    setMovies(data);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      title: "",
      genre: "",
      duration: "",
      description: "",
      releaseDate: "",
      poster: "",
      status: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    setTab("list");
    fetchMovies();
  };

  const handleEdit = (m) => {
    setEditingId(m.id);
    setForm(m);
    setTab("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchMovies();
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2>Quản Lý Phim</h2>

        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setTab("list")} style={tabBtn(tab === "list")}>
            Danh sách
          </button>
          <button
            onClick={() => {
              resetForm();
              setTab("form");
            }}
            style={tabBtn(tab === "form")}
          >
            Thêm phim
          </button>
        </div>

        {/* ===== LIST ===== */}
        {tab === "list" && (
          <table style={tableStyle}>
            <thead>
              <tr style={{ color: "red" }}>
                <th style={thStyle}>
                  Tên
                  <input
                    name="title"
                    placeholder="Tìm..."
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>

                <th style={thStyle}>
                  Thể loại
                  <input
                    name="genre"
                    placeholder="Tìm..."
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>

                <th style={thStyle}>Thời lượng</th>

                <th style={thStyle}>
                  Trạng thái
                  <input
                    name="status"
                    placeholder="Tìm..."
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>

                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {movies.length > 0 ? (
                movies.map((m) => (
                  <tr
                    key={m.id}
                    style={{ textAlign: "center", cursor: "pointer" }}
                    onClick={() => setSelectedMovie(m)}
                  >
                    <td style={tdStyle}>{m.title}</td>
                    <td style={tdStyle}>{m.genre}</td>
                    <td style={tdStyle}>{m.duration}</td>
                    <td style={tdStyle}>{m.status}</td>
                    <td style={tdStyle}>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(m);
                        }}
                        style={iconStyle}
                      >
                        ✏
                      </span>

                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(m.id);
                        }}
                        style={iconStyle}
                      >
                        🗑
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: "20px", opacity: 0.6 }}>
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* ===== FORM ===== */}
        {tab === "form" && (
          <>
            <input name="title" placeholder="Tên phim" value={form.title} onChange={handleChange} style={inputStyle} />
            <input name="genre" placeholder="Thể loại" value={form.genre} onChange={handleChange} style={inputStyle} />
            <input name="duration" placeholder="Thời lượng" value={form.duration} onChange={handleChange} style={inputStyle} />

            <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
              <option value="">-- Chọn trạng thái --</option>
              <option value="now_showing">Đang chiếu</option>
              <option value="coming_soon">Sắp chiếu</option>
              <option value="ended">Ngừng chiếu</option>
            </select>

            <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} style={inputStyle} />
            <input name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} style={inputStyle} />
            <input name="poster" placeholder="Link ảnh" value={form.poster} onChange={handleChange} style={inputStyle} />

            <button onClick={handleSubmit} style={btnStyle}>
              {editingId ? "Cập nhật" : "Thêm"}
            </button>
          </>
        )}
      </div>

      {/* ================= MODAL DETAIL ================= */}
      {selectedMovie && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <span style={closeBtn} onClick={() => setSelectedMovie(null)}>
              ✕
            </span>

            <div style={{ display: "flex", gap: 20 }}>
              <img src={selectedMovie.poster} style={posterStyle} />

              <div>
                <h2>{selectedMovie.title}</h2>

                <p><b>Thể loại:</b> {selectedMovie.genre}</p>
                <p><b>Thời lượng:</b> {selectedMovie.duration}</p>
                <p><b>Trạng thái:</b> {selectedMovie.status}</p>
                <p><b>Ngày chiếu:</b> {selectedMovie.releaseDate}</p>

                <p><b>Mô tả:</b></p>
                <div style={descBox}>
                  {selectedMovie.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STYLE ================= */

const tabBtn = (active) => ({
  background: active ? "red" : "#444",
  color: "white",
  border: "none",
  padding: "10px 20px",
  marginRight: "10px",
  borderRadius: "20px",
  cursor: "pointer",
});

const wrapperStyle = {
  minHeight: "100vh",
  background: "black",
  padding: "40px 20px",
};

const cardStyle = {
  maxWidth: "900px",
  margin: "auto",
  background: "linear-gradient(to right, #0f172a, #020617)",
  padding: "30px",
  borderRadius: "20px",
  color: "white",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "20px",
  border: "none",
};

const filterInputStyle = {
  marginTop: "6px",
  width: "90%",
  padding: "4px",
  borderRadius: "6px",
};

const btnStyle = {
  background: "red",
  border: "none",
  padding: "10px 20px",
  borderRadius: "20px",
  color: "white",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #333",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #222",
};

const iconStyle = {
  cursor: "pointer",
  margin: "0 10px",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "#020617",
  padding: 25,
  borderRadius: 20,
  width: 700,
  color: "white",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  right: 15,
  top: 10,
  cursor: "pointer",
  fontSize: 20,
};

const posterStyle = {
  width: 220,
  borderRadius: 10,
};

const descBox = {
  background: "#111",
  padding: 10,
  borderRadius: 10,
};

export default ManageMovies;