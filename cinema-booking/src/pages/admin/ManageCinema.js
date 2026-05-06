import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ManageCinema() {
  const [tab, setTab] = useState("list");

  const [cinemas, setCinemas] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    address: "",
  });

  const API = "http://localhost:8080/api/cinemas";

  // danh sách tỉnh thành
  const provinces = [
    "Hà Nội",
    "TP Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Ninh",
    "Bình Dương",
    "Bình Định",
    "Bình Thuận",
    "Cà Mau",
    "Đắk Lắk",
    "Đồng Nai",
    "Gia Lai",
    "Hà Nam",
    "Hải Dương",
    "Khánh Hòa",
    "Lâm Đồng",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Phú Thọ",
    "Quảng Ninh",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Vĩnh Phúc"
  ];

  // LOAD + SEARCH
  const fetchCinemas = async () => {
    try {
      const query = `?cinemaName=${filters.name}&address=${filters.address}`;
      const res = await fetch(API + query);
      const data = await res.json();
      setCinemas(data);
    } catch (err) {
      console.error("Lỗi load:", err);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, [filters]);

  const resetForm = () => {
    setName("");
    setAddress("");
    setEditingId(null);
  };

  // ADD / UPDATE
  const handleSubmit = async () => {
    if (!name || !address) return;

    try {
      if (editingId) {
        await fetch(`${API}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cinemaName: name,
            address: address,
          }),
        });
      } else {
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cinemaName: name,
            address: address,
          }),
        });
      }

      resetForm();
      setTab("list");
      fetchCinemas();
    } catch (err) {
      console.error("Lỗi submit:", err);
    }
  };

  // EDIT
  const handleEdit = (cinema) => {
    setEditingId(cinema.id);
    setName(cinema.cinemaName);
    setAddress(cinema.address);
    setTab("form");
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      fetchCinemas();
    } catch (err) {
      console.error("Lỗi delete:", err);
    }
  };

  // FILTER
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <>
      <style>{`
      .cinema-wrapper {
        display: flex;
        justify-content: center;
        padding: 30px 20px;
        min-height: 100vh;
      }

      .cinema-card {
        width: 100%;
        max-width: 1000px;
        background: linear-gradient(to right, #081225, #050d1f);
        padding: 30px;
        border-radius: 20px;
        color: white;
      }

      .tab-btn {
        padding: 10px 20px;
        border-radius: 20px;
        border: none;
        margin-right: 10px;
        cursor: pointer;
        color: white;
      }

      .active {
        background: red;
      }

      .inactive {
        background: #444;
      }

      .form-input {
        width: 100%;
        padding: 14px;
        margin-bottom: 20px;
        border-radius: 30px;
        border: none;
        background: #dcdcdc;
      }

      .btn-add {
        background: red;
        color: white;
        border: none;
        padding: 10px 25px;
        border-radius: 15px;
        cursor: pointer;
        font-weight: bold;
      }

      .cinema-header,
      .cinema-row {
        display: grid;
        grid-template-columns: 1fr 1fr 150px;
        gap: 20px;
        align-items: center;
      }

      .column-title {
        color: red;
        font-weight: bold;
      }

      .search-input {
        width: 100%;
        padding: 4px;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: #e5e5e5;
        color: black;
        font-size: 12px;
        height: 26px;
        margin-top: 5px;
      }

      .cinema-row {
        padding: 12px 0;
        border-bottom: 1px solid #222;
      }

      .icon {
        cursor: pointer;
        margin-right: 15px;
      }

      .icon:hover {
        color: red;
      }

      .empty-row {
        color: #777;
        padding: 20px 0;
      }
      `}</style>

      <div className="cinema-wrapper">
        <div className="cinema-card">
          <h2>Quản Lý Rạp</h2>

          {/* TAB */}
          <div style={{ marginBottom: "20px" }}>
            <button
              className={`tab-btn ${tab === "list" ? "active" : "inactive"}`}
              onClick={() => setTab("list")}
            >
              Danh sách
            </button>

            <button
              className={`tab-btn ${tab === "form" ? "active" : "inactive"}`}
              onClick={() => {
                resetForm();
                setTab("form");
              }}
            >
              Thêm rạp
            </button>
          </div>

          {/* ===== LIST ===== */}
          {tab === "list" && (
            <div className="cinema-table">

              <div className="cinema-header">
                <div>
                  <span className="column-title">Tên</span>
                  <input
                    name="name"
                    className="search-input"
                    placeholder="Tìm..."
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <span className="column-title">Địa chỉ</span>
                  <input
                    name="address"
                    className="search-input"
                    placeholder="Tìm..."
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="column-title">Thao tác</div>
              </div>

              {cinemas.length === 0 ? (
                <div className="empty-row">Không có kết quả</div>
              ) : (
                cinemas.map((cinema) => (
                  <div key={cinema.id} className="cinema-row">
                    <div>{cinema.cinemaName}</div>
                    <div>{cinema.address}</div>
                    <div>
                      <FaEdit className="icon" onClick={() => handleEdit(cinema)} />
                      <FaTrash className="icon" onClick={() => handleDelete(cinema.id)} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ===== FORM ===== */}
          {tab === "form" && (
            <>
              <input
                className="form-input"
                type="text"
                placeholder="Tên rạp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              >
                <option value="">Chọn tỉnh / thành</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <button className="btn-add" onClick={handleSubmit}>
                {editingId ? "Cập nhật" : "Thêm"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}