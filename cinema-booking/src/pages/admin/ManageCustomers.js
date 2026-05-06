import { useState, useEffect } from "react";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showHistoryTab, setShowHistoryTab] = useState(false);

  const [filters, setFilters] = useState({
    fullName: "",
    email: "",
  });

  // ==================== FETCH DATA TỪ BACKEND ====================
  useEffect(() => {
    fetch("http://localhost:8080/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error(err));
  }, []);

  // ==================== HANDLE FILTER ====================
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      (!filters.fullName ||
        customer.fullName.toLowerCase().includes(filters.fullName.toLowerCase())) &&
      (!filters.email ||
        customer.email.toLowerCase().includes(filters.email.toLowerCase()))
  );

  // ==================== HANDLE MODAL ====================
  const handleCustomerClick = (customer) => {
  setSelectedCustomer({ ...customer, history: [] }); // giữ thông tin khách
  setShowHistoryTab(true);

  // Gọi API lấy lịch sử booking
  fetch(`http://localhost:8080/api/customers/${customer.id}/bookings`)
    .then((res) => res.json())
    .then((data) => {
      setSelectedCustomer({ ...customer, history: data });
    })
    .catch((err) => console.error(err));
};

  const closeModal = () => {
    setShowHistoryTab(false);
    setSelectedCustomer(null);
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "white", marginBottom: "30px" }}>Khách hàng</h2>

        {/* ==================== BẢNG KHÁCH HÀNG ==================== */}
        <table style={tableStyle}>
          <thead>
            <tr style={{ color: "red" }}>
              <th style={thStyle}>
                Tên
                <input
                  name="fullName"
                  placeholder="Tìm..."
                  onChange={handleFilterChange}
                  style={filterStyle}
                />
              </th>
              <th style={thStyle}>
                Email
                <input
                  name="email"
                  placeholder="Tìm..."
                  onChange={handleFilterChange}
                  style={filterStyle}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td
                    style={{ ...tdStyle, cursor: "pointer", color: "#4da6ff" }}
                    onClick={() => handleCustomerClick(customer)}
                  >
                    {customer.fullName}
                  </td>
                  <td style={tdStyle}>{customer.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center", padding: "15px" }}>
                  Không tìm thấy khách hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==================== MODAL LỊCH SỬ ĐẶT VÉ ==================== */}
      {showHistoryTab && selectedCustomer && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button onClick={closeModal} style={closeBtnStyle}>
              &times;
            </button>
            <h3 style={{ marginBottom: "15px" }}>
              Lịch sử đặt vé - {selectedCustomer.fullName}
            </h3>
            <table style={tableStyle}>
              <thead>
                <tr style={{ color: "red" }}>
                  <th style={thStyle}>Tên phim</th>
                  <th style={thStyle}>Số lượng</th>
                  <th style={thStyle}>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomer.history?.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "15px" }}>
                      Chưa có lịch sử đặt vé
                    </td>
                  </tr>
                ) : (
                  (selectedCustomer.history || []).map((ticket, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>{ticket.movie}</td>
                      <td style={tdStyle}>{ticket.quantity}</td>
                      <td style={tdStyle}>{ticket.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCustomers;

/* ================= STYLE ================= */
const wrapperStyle = {
  padding: "40px",
  background: "#000",
  minHeight: "100vh",
};

const cardStyle = {
  background: "linear-gradient(to right, #0f172a, #020617)",
  padding: "40px",
  borderRadius: "20px",
  maxWidth: "1000px",
  margin: "auto",
  color: "white",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  color: "white",
};

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #333",
  textAlign: "center",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #222",
  textAlign: "center",
};

const filterStyle = {
  marginTop: "8px",
  width: "80%",
  padding: "8px 10px",
  borderRadius: "20px",
  border: "none",
  outline: "none",
  background: "#e5e5e5",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
};

/* ================= MODAL STYLE ================= */
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#111",
  padding: "30px",
  borderRadius: "20px",
  width: "80%",
  maxHeight: "80vh",
  overflowY: "auto",
  color: "white",
  position: "relative",
};

const closeBtnStyle = {
  position: "absolute",
  top: "15px",
  right: "20px",
  background: "transparent",
  border: "none",
  fontSize: "24px",
  color: "white",
  cursor: "pointer",
};