import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell
} from "recharts";

export default function AdminRevenue() {
  const CURRENT_YEAR = new Date().getFullYear();

  const [mode, setMode] = useState("system");

  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const [cinemaRevenue, setCinemaRevenue] = useState([]);
  const [monthSystem, setMonthSystem] = useState([]);
  const [yearSystem, setYearSystem] = useState([]);
  const [monthCinema, setMonthCinema] = useState([]);
  const [yearCinema, setYearCinema] = useState([]);
  const [movieRevenue, setMovieRevenue] = useState([]);

  const API = "http://localhost:8080/api/admin";

  const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

  const formatMoney = (v) =>
    new Intl.NumberFormat("vi-VN").format(v || 0);

  const safeArray = (json) => {
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.result)) return json.result;
    return [];
  };

  const normalizeMonth = (data) => {
    const map = new Map(data.map(i => [Number(i.month), Number(i.revenue)]));
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: map.get(i + 1) || 0
    }));
  };

  const normalizeYear = (data) => {
    const map = new Map(data.map(i => [Number(i.year), Number(i.revenue)]));
    const years = [2024, 2025, 2026, 2027];

    return years.map(y => ({
      year: y,
      revenue: map.get(y) || 0
    }));
  };

  const normalizeMovie = (data) =>
  data.map(i => ({
    movie: i[0], // full
    short: shortText(i[0], 14), // rút gọn
    revenue: Number(i[1]) || 0
  }));
const shortText = (text, max = 12) =>
  text.length > max ? text.substring(0, max) + "..." : text;
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;

    return (
      <div
        style={{
          background: "#111827",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #334155"
        }}
      >
        <div style={{ fontWeight: 600 }}>
          {item.movie || item.cinema}
        </div>
        <div>{formatMoney(item.revenue)} VND</div>
      </div>
    );
  }
  return null;
};
  // ===== LOAD DATA =====
  const loadCinemas = async () => {
    const res = await fetch("http://localhost:8080/api/cinemas");
    const json = await res.json();
    const data = safeArray(json);

    setCinemas(data);
    if (data.length > 0) setSelectedCinema(data[0].id);
  };

  const loadCinemaRevenue = async () => {
    const res = await fetch(`${API}/revenue/cinema?year=${selectedYear}`);
    const json = await res.json();
    const data = safeArray(json);

    const map = new Map(data.map(i => [i[0], Number(i[1])]));

    const result = cinemas.map((c, index) => ({
      cinema: c.cinemaName,
      revenue: map.get(c.cinemaName) || 0,
      color: COLORS[index % COLORS.length]
    }));

    setCinemaRevenue(result);
  };

  const loadMonthSystem = async () => {
    const res = await fetch(`${API}/revenue/month?year=${selectedYear}`);
    const json = await res.json();
    const data = safeArray(json);

    setMonthSystem(
      normalizeMonth(data.map(i => ({
        month: i[0],
        revenue: i[1]
      })))
    );
  };

  const loadYearSystem = async () => {
    const res = await fetch(`${API}/revenue/year`);
    const json = await res.json();
    const data = safeArray(json);

    setYearSystem(
      normalizeYear(data.map(i => ({
        year: i[0],
        revenue: i[1]
      })))
    );
  };

  const loadMovieRevenue = async () => {
    const res = await fetch(`${API}/revenue/movie?year=${CURRENT_YEAR}`);
    const json = await res.json();
    const data = safeArray(json);

    setMovieRevenue(normalizeMovie(data));
  };

  const loadMonthByCinema = async () => {
    const res = await fetch(
      `${API}/revenue/month/cinema?cinemaId=${selectedCinema}&year=${selectedYear}`
    );

    const json = await res.json();
    const data = safeArray(json);

    setMonthCinema(normalizeMonth(data.map(i => ({
      month: i[0],
      revenue: i[1]
    }))));
  };

  const loadYearByCinema = async () => {
    const res = await fetch(
      `${API}/revenue/year/cinema?cinemaId=${selectedCinema}`
    );

    const json = await res.json();
    const data = safeArray(json);

    setYearCinema(normalizeYear(data.map(i => ({
      year: i[0],
      revenue: i[1]
    }))));
  };
  

  // ===== EFFECT =====
  useEffect(() => {
    loadCinemas();
    loadYearSystem();
    loadMovieRevenue();
  }, []);

  useEffect(() => {
    if (cinemas.length > 0 && mode === "system") {
      loadCinemaRevenue();
    }
  }, [cinemas, selectedYear, mode]);

  useEffect(() => {
    if (mode === "system") loadMonthSystem();
  }, [selectedYear, mode]);

  useEffect(() => {
    if (mode === "cinema" && selectedCinema) {
      loadMonthByCinema();
      loadYearByCinema();
    }
  }, [mode, selectedCinema, selectedYear]);

  // ===== STYLE =====
  const cardStyle = {
    background: "linear-gradient(145deg,#111827,#0b1220)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  };

  const selectStyle = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none",
    marginRight: 10
  };

  return (
    <div style={{ background: "#0b1020", minHeight: "100vh", padding: 24, color: "white" }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>📊 Admin Revenue Dashboard</h1>
        <p style={{ opacity: 0.7 }}>Theo dõi doanh thu hệ thống & từng rạp</p>
      </div>

      {/* FILTER BAR */}
      <div style={cardStyle}>
        <select value={mode} onChange={(e) => setMode(e.target.value)} style={selectStyle}>
          <option value="system">Toàn hệ thống</option>
          <option value="cinema">Theo rạp</option>
        </select>

        {mode === "cinema" && (
          <select
            value={selectedCinema}
            onChange={(e) => setSelectedCinema(Number(e.target.value))}
            style={selectStyle}
          >
            {cinemas.map(c => (
              <option key={c.id} value={c.id}>
                {c.cinemaName}
              </option>
            ))}
          </select>
        )}

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={selectStyle}
        >
          {[2024, 2025, 2026, 2027].map(y => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gap: 20 }}>
        
        {/* SYSTEM */}
        {mode === "system" && (
          <>
            <div style={cardStyle}>
              <h3>Doanh thu theo rạp</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cinemaRevenue}>
                  <XAxis
  dataKey="cinema"
  interval={0}
  angle={-25}
  textAnchor="end"
  height={80}
  tickFormatter={(v) => shortText(v, 12)}
  tick={{ fontSize: 12 }}
/>
                  <YAxis tickFormatter={formatMoney} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue">
                    {cinemaRevenue.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={cardStyle}>
              <h3>Doanh thu theo tháng</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthSystem}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatMoney} />
                  <Tooltip formatter={formatMoney} />
                  <Line dataKey="revenue" stroke="#60a5fa" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={cardStyle}>
              <h3>Doanh thu theo năm</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearSystem}>
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={formatMoney} />
                  <Tooltip formatter={formatMoney} />
                  <Bar dataKey="revenue">
                    {yearSystem.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {selectedYear === CURRENT_YEAR && (
  <div style={cardStyle}>
    <h3>Doanh thu theo phim (năm hiện tại)</h3>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={movieRevenue}>
        <XAxis
  dataKey="movie"
  interval={0}
  angle={-25}
  textAnchor="end"
  height={80}
  tickFormatter={(v) => shortText(v, 14)}
  tick={{ fontSize: 12 }}
/>
        <YAxis tickFormatter={formatMoney} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="revenue">
          {movieRevenue.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
)}
          </>
        )}

        {/* CINEMA */}
        {mode === "cinema" && (
          <>
            <div style={cardStyle}>
              <h3>Doanh thu theo tháng rạp</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthCinema}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatMoney} />
                  <Tooltip formatter={formatMoney} />
                  <Line dataKey="revenue" stroke="#34d399" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={cardStyle}>
              <h3>Doanh thu theo năm rạp</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearCinema}>
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={formatMoney} />
                  <Tooltip formatter={formatMoney} />
                  <Bar dataKey="revenue">
                    {yearCinema.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}