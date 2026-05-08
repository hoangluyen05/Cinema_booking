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
    duration: 0,
    description: "",
    releaseDate: "",
    poster: "",
    status: "",
    blockbuster: false,
    budget: 0,
  });

  const [filters, setFilters] = useState({ title: "", genre: "", status: "" });

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
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "blockbuster") {
      finalValue = value === "true";
    } else if (name === "budget" || name === "duration") {
      finalValue = value === "" ? 0 : Number(value);
    }

    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };
const validateForm = () => {
  let newErrors = {};
  if (!form.title || form.title.trim() === "") newErrors.title = "Tên phim không được để trống";
  if (!form.genre || form.genre.trim() === "") newErrors.genre = "Vui lòng nhập thể loại";
  if (form.budget <= 0) newErrors.budget = "Kinh phí phải lớn hơn 0";
  if (!form.status) newErrors.status = "Vui lòng chọn trạng thái";
  if (!form.description || form.description.trim() === "") newErrors.description = "Mô tả không được để trống";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
};
  const handleSubmit = async () => {
  // THÊM ĐOẠN KIỂM TRA NÀY:
  if (!validateForm()) {
    return; // Dừng lại, không chạy code bên dưới nếu có lỗi
  }

  const method = editingId ? "PUT" : "POST";
  // ... giữ nguyên phần fetch bên dưới của bạn ...
  const url = editingId ? `${API}/${editingId}` : API;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (res.ok) {
    alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
    resetForm();
    setErrors({}); // THÊM DÒNG NÀY để xóa lỗi cũ sau khi thành công
    setTab("list");
    fetchMovies();
  } else {
    alert("Lỗi khi lưu dữ liệu!");
  }
};
  const resetForm = () => {
    setForm({
      title: "",
      genre: "",
      duration: 0,
      description: "",
      releaseDate: "",
      poster: "",
      status: "",
      budget: 0,
      blockbuster: false,
    });
    setEditingId(null);
  };

  const handleEdit = (m) => {
    setEditingId(m.id);
    setForm({
      ...m,
      budget: m.budget || 0,
      blockbuster: m.blockbuster || false,
    });
    setTab("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchMovies();
    }
  };
  const [errors, setErrors] = useState({});

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
            Thêm phim mới
          </button>
        </div>

        {/* ================= LIST ================= */}
        {tab === "list" && (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>
                  Tên
                  <input
                    name="title"
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>
                <th style={thStyle}>
                  Thể loại
                  <input
                    name="genre"
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>
                <th style={thStyle}>
                  Trạng thái
                  <input
                    name="status"
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>
                <th style={thStyle}>Bom tấn</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {movies.map((m) => (
                <tr
                  key={m.id}
                  style={{ textAlign: "center", cursor: "pointer" }}
                  onClick={() => setSelectedMovie(m)}   // 👉 mở popup
                >
                  <td style={tdStyle}>{m.title}</td>
                  <td style={tdStyle}>{m.genre}</td>
                  <td style={tdStyle}>{m.status}</td>
                  <td style={tdStyle}>{m.blockbuster ? "✅" : "❌"}</td>
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
              ))}
            </tbody>
          </table>
        )}

        {/* ================= FORM ================= */}
        {tab === "form" && (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label>Tên phim:</label>
    <input name="title" value={form.title} onChange={handleChange} style={inputStyle} />
    {errors.title && <span style={errorTextStyle}>{errors.title}</span>}

    <label>Thể loại:</label>
    <input name="genre" value={form.genre} onChange={handleChange} style={inputStyle} />
    {errors.genre && <span style={errorTextStyle}>{errors.genre}</span>}

    <label>Kinh phí:</label>
    <input name="budget" type="number" value={form.budget} onChange={handleChange} style={inputStyle} />
    {errors.budget && <span style={errorTextStyle}>{errors.budget}</span>}

    <label>Trạng thái:</label>
    <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
      <option value="">-- chọn --</option>
      <option value="now_showing">Đang chiếu</option>
      <option value="coming_soon">Sắp chiếu</option>
      <option value="ended">Ngừng chiếu</option>
    </select>
    {errors.status && <span style={errorTextStyle}>{errors.status}</span>}

    <label>Bom tấn:</label>
    <select name="blockbuster" value={form.blockbuster.toString()} onChange={handleChange} style={inputStyle}>
      <option value="false">Phim thường</option>
      <option value="true">Bom tấn</option>
    </select>

    <label>Mô tả:</label>
    <textarea name="description" value={form.description} onChange={handleChange} style={{...inputStyle, minHeight: '80px'}} />
    {errors.description && <span style={errorTextStyle}>{errors.description}</span>}

    <button onClick={handleSubmit} style={btnStyle}>
      {editingId ? "CẬP NHẬT" : "THÊM MỚI"}
    </button>
  </div>
)}

        {/* ================= POPUP DETAIL ================= */}
        {selectedMovie && (
  <div style={modalOverlay} onClick={() => setSelectedMovie(null)}>
    <div style={modalBox} onClick={(e) => e.stopPropagation()}>
      <span style={closeBtn} onClick={() => setSelectedMovie(null)}>
        ✖
      </span>

      <h2 style={{ marginBottom: 15 }}>{selectedMovie.title}</h2>

      <div style={{ display: "flex", gap: 15 }}>
        <img src={selectedMovie.poster} style={posterStyleSmall} />

        <div style={{ flex: 1 }}>
          <p><b>Thể loại:</b> {selectedMovie.genre}</p>
          <p><b>Trạng thái:</b> {selectedMovie.status}</p>
          <p><b>Thời lượng:</b> {selectedMovie.duration} phút</p>
          <p><b>Kinh phí:</b> ${selectedMovie.budget}</p>
          <p>
            <b>Bom tấn:</b>{" "}
            <span style={{ color: selectedMovie.blockbuster ? "gold" : "#aaa" }}>
              {selectedMovie.blockbuster ? "🔥 Có" : "Không"}
            </span>
          </p>
        </div>
      </div>

      <div style={descBoxSmall}>
        <b>Mô tả</b>
        <p style={{ marginTop: 5 }}>{selectedMovie.description}</p>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

/* ================= STYLE ================= */

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#1e293b",
  color: "white",
};




const posterStyleSmall = {
  width: 120,
  height: 160,
  objectFit: "cover",
  borderRadius: 10,
};

const descBoxSmall = {
  marginTop: 12,
  background: "#111827",
  padding: 10,
  borderRadius: 10,
  fontSize: "13px",
  color: "#ddd",
};


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
  inset: 0,
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
const errorTextStyle = {
  color: "#ff4d4d", // Màu đỏ sáng nổi bật trên nền tối
  fontSize: "13px",
  marginTop: "-12px", // Kéo sát lên input phía trên
  marginBottom: "12px",
  fontWeight: "500",
  paddingLeft: "5px"
};
export default ManageMovies;
