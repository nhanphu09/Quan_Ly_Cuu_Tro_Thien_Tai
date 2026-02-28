import React, { useState, useEffect, useContext, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const getIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = getIcon('blue');
const redIcon = getIcon('red');
const greenIcon = getIcon('green');

// Heatmap Component
const HeatmapLayer = ({ points }) => {
    const map = useMap();
    const layerRef = useRef(null);

    useEffect(() => {
        if (!points || points.length === 0) return;
        const heatPoints = points.map(p => [p.lat, p.lng, 1]); // intensity 1

        if (layerRef.current) {
            map.removeLayer(layerRef.current);
        }

        layerRef.current = L.heatLayer(heatPoints, {
            radius: 35,
            blur: 20,
            maxZoom: 17,
            gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red' }
        }).addTo(map);

        return () => {
            if (layerRef.current) {
                map.removeLayer(layerRef.current);
                layerRef.current = null;
            }
        };
    }, [points, map]);
    return null;
};

// Routing Component
const RoutingMachine = ({ start, end }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!start || !end) {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
            return;
        }

        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        routingControlRef.current = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                L.latLng(end.lat, end.lng)
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color: '#3b82f6', weight: 6, opacity: 0.8 }]
            },
            createMarker: () => null // Turn off default markers for routes
        }).addTo(map);

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };
    }, [start, end, map]);

    return null;
};

// Map Click Handler
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const MapPage = () => {
    const position = [16.047079, 108.206230]; // Da Nang center

    // Data states
    const [disasters, setDisasters] = useState([]);
    const [requests, setRequests] = useState([]);
    const [inventories, setInventories] = useState([]);

    // UI states
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [routingMode, setRoutingMode] = useState(false);
    const [routingStart, setRoutingStart] = useState(null);
    const [routingEnd, setRoutingEnd] = useState(null);

    // Form states
    const [reportModal, setReportModal] = useState({ show: false, lat: null, lng: null, submitType: 'disaster' }); // submitType: 'disaster' or 'request'
    const [reportForm, setReportForm] = useState({ name: '', phone: '', address: '', type: 'Flood', details: '' });

    const { token } = useContext(AuthContext);

    const fetchMapData = async () => {
        try {
            const [disRes, reqRes, invRes] = await Promise.all([
                axios.get('http://localhost:5001/api/disasters'),
                axios.get('http://localhost:5001/api/relief-requests', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }).catch(() => ({ data: [] })), // Allow unauthorized to just return empty
                axios.get('http://localhost:5001/api/inventory', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }).catch(() => ({ data: [] }))
            ]);
            setDisasters(disRes.data);
            setRequests(reqRes.data.filter(r => r.lat && r.lng));
            setInventories(invRes.data.filter(i => i.lat && i.lng));
        } catch (error) {
            console.error('Error fetching map data', error);
        }
    };

    useEffect(() => {
        fetchMapData();
    }, [token]);

    const handleMapClick = (latlng) => {
        if (routingMode) return; // Don't show report modal in routing mode
        if (!token) {
            toast.warning("Bạn cần đăng nhập để báo cáo sự cố hoặc yêu cầu cứu trợ.");
            return;
        }
        setReportModal({ show: true, lat: latlng.lat, lng: latlng.lng, submitType: 'disaster' });
    };

    const handleMarkerClick = (type, item) => {
        if (!routingMode) return;

        if (type === 'inventory') {
            setRoutingStart(item);
        } else if (type === 'request' || type === 'disaster') {
            setRoutingEnd(item);
        }
    };

    const submitReport = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (reportModal.submitType === 'disaster') {
                const payload = {
                    name: reportForm.name,
                    type: reportForm.type,
                    details: reportForm.details,
                    lat: reportModal.lat,
                    lng: reportModal.lng
                };
                await axios.post('http://localhost:5001/api/disasters', payload, config);
                toast.success("Đã gửi Báo cáo Thiên tai!");
            } else {
                const payload = {
                    name: reportForm.name,
                    phone: reportForm.phone,
                    address: reportForm.address,
                    needs: reportForm.details,
                    lat: reportModal.lat,
                    lng: reportModal.lng
                };
                await axios.post('http://localhost:5001/api/relief-requests', payload, config);
                toast.success("Đã gửi Yêu cầu Cứu trợ!");
            }

            setReportModal({ show: false, lat: null, lng: null, submitType: 'disaster' });
            setReportForm({ name: '', phone: '', address: '', type: 'Flood', details: '' });
            fetchMapData(); // Refresh map
        } catch (error) {
            console.error('Error submitting:', error);
            toast.error("Lỗi khi gửi dữ liệu. Vui lòng thử lại.");
        }
    };

    return (
        <div className="map-page-container" style={{ display: 'flex', height: '80vh' }}>
            <div className="map-sidebar" style={{ width: '350px', padding: '20px', backgroundColor: '#f8fafc', overflowY: 'auto', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', zIndex: 10 }}>
                <h2 style={{ color: '#1e293b', marginBottom: '15px' }}>Bản Đồ GIS (Advanced)</h2>

                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Công cụ Phân tích</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            className={`btn ${showHeatmap ? 'btn-danger' : 'btn-outline'}`}
                            onClick={() => setShowHeatmap(!showHeatmap)}
                            style={{ width: '100%', textAlign: 'left', padding: '10px' }}
                        >
                            🔥 {showHeatmap ? 'Tắt Bản Đồ Nhiệt (Heatmap)' : 'Bật Bản Đồ Nhiệt (Heatmap)'}
                        </button>

                        <button
                            className={`btn ${routingMode ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => {
                                setRoutingMode(!routingMode);
                                if (routingMode) {
                                    setRoutingStart(null);
                                    setRoutingEnd(null);
                                }
                            }}
                            style={{ width: '100%', textAlign: 'left', padding: '10px' }}
                        >
                            🛣️ {routingMode ? 'Hủy Chế độ Định Tuyến' : 'Bật Định Tuyến Cứu Trợ (Routing)'}
                        </button>
                    </div>
                </div>

                {routingMode && (
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                        <h3 style={{ fontSize: '15px', color: '#1e3a8a', marginBottom: '10px' }}>Lộ Trình Cứu Trợ</h3>
                        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                            1. Click chọn Kho hàng (Xanh lá) làm điểm xuất phát.<br />
                            2. Click chọn Yêu cầu (Đỏ) làm điểm đến.
                        </p>
                        <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                            <strong>Từ:</strong> <span style={{ color: routingStart ? 'green' : '#94a3b8' }}>{routingStart ? `${routingStart.name} (Kho)` : 'Chưa chọn'}</span>
                        </div>
                        <div style={{ fontSize: '14px' }}>
                            <strong>Đến:</strong> <span style={{ color: routingEnd ? 'red' : '#94a3b8' }}>{routingEnd ? routingEnd.name || routingEnd.details || 'Điểm đến' : 'Chưa chọn'}</span>
                        </div>
                    </div>
                )}

                <div className="disaster-list" style={{ marginTop: '20px' }}>
                    <h3>Chú Giải Bản Đồ</h3>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" alt="blue" style={{ width: '15px', marginRight: '10px' }} />
                        <span>Khẩn cấp / Báo cáo sự cố</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt="red" style={{ width: '15px', marginRight: '10px' }} />
                        <span>Yêu cầu cứu trợ</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" alt="green" style={{ width: '15px', marginRight: '10px' }} />
                        <span>Kho hàng lưu động</span>
                    </div>
                </div>

            </div>

            <div className="map-view" style={{ flex: 1, position: 'relative' }}>
                <MapContainer center={position} zoom={6} scrollWheelZoom={true} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                    <TileLayer
                        url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
                        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; Google Maps'
                    />
                    <MapClickHandler onMapClick={handleMapClick} />

                    {/* Disasters (Blue) */}
                    {disasters.map(d => (
                        <Marker
                            key={`disaster-${d.id}`}
                            position={[d.lat, d.lng]}
                            icon={blueIcon}
                            eventHandlers={{ click: () => handleMarkerClick('disaster', d) }}
                        >
                            <Popup>
                                <strong>Điểm Nóng: {d.name}</strong> <br />
                                <em>Loại: {d.type}</em><br />
                                {d.details} <br />
                            </Popup>
                        </Marker>
                    ))}

                    {/* Relief Requests (Red) */}
                    {requests.map(r => (
                        <Marker
                            key={`req-${r.id}`}
                            position={[r.lat, r.lng]}
                            icon={redIcon}
                            eventHandlers={{ click: () => handleMarkerClick('request', r) }}
                        >
                            <Popup>
                                <strong>Yêu Cầu: {r.name}</strong> <br />
                                SĐT: {r.phone} <br />
                                Nhu cầu: {r.needs} <br />
                                Trạng thái: <strong>{r.status}</strong>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Inventories (Green) */}
                    {inventories.map(i => (
                        <Marker
                            key={`inv-${i.id}`}
                            position={[i.lat, i.lng]}
                            icon={greenIcon}
                            eventHandlers={{ click: () => handleMarkerClick('inventory', i) }}
                        >
                            <Popup>
                                <strong>Kho: {i.name}</strong> <br />
                                Tồn kho: {i.quantity} {i.unit}
                            </Popup>
                        </Marker>
                    ))}

                    {/* Conditional GIS Layers */}
                    {showHeatmap && <HeatmapLayer points={disasters} />}
                    {routingMode && routingStart && routingEnd && (
                        <RoutingMachine start={routingStart} end={routingEnd} />
                    )}

                </MapContainer>

                {/* Unified Report Modal */}
                {reportModal.show && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000, width: '350px'
                    }}>
                        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '15px' }}>
                            <button
                                style={{ flex: 1, padding: '10px', background: 'none', border: 'none', fontWeight: 'bold', borderBottom: reportModal.submitType === 'disaster' ? '2px solid #ef4444' : 'none', color: reportModal.submitType === 'disaster' ? '#ef4444' : '#64748b' }}
                                onClick={() => setReportModal({ ...reportModal, submitType: 'disaster' })}
                            >Báo Điểm Nóng</button>
                            <button
                                style={{ flex: 1, padding: '10px', background: 'none', border: 'none', fontWeight: 'bold', borderBottom: reportModal.submitType === 'request' ? '2px solid #3b82f6' : 'none', color: reportModal.submitType === 'request' ? '#3b82f6' : '#64748b' }}
                                onClick={() => setReportModal({ ...reportModal, submitType: 'request' })}
                            >Xin Cứu Trợ</button>
                        </div>

                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>Tọa độ: {reportModal.lat.toFixed(4)}, {reportModal.lng.toFixed(4)}</p>

                        <form onSubmit={submitReport}>
                            {reportModal.submitType === 'disaster' ? (
                                <>
                                    <input type="text" placeholder="Tiêu đề (VD: Ngập lụt nghiêm trọng)" value={reportForm.name} onChange={e => setReportForm({ ...reportForm, name: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }} />
                                    <select value={reportForm.type} onChange={e => setReportForm({ ...reportForm, type: e.target.value })} style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}>
                                        <option value="Flood">Lũ lụt</option>
                                        <option value="Storm">Lốc / Bão</option>
                                        <option value="Drought">Hạn hán</option>
                                    </select>
                                </>
                            ) : (
                                <>
                                    <input type="text" placeholder="Họ và tên người yêu cầu" value={reportForm.name} onChange={e => setReportForm({ ...reportForm, name: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }} />
                                    <input type="text" placeholder="Số điện thoại liên hệ" value={reportForm.phone} onChange={e => setReportForm({ ...reportForm, phone: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }} />
                                </>
                            )}

                            <textarea
                                placeholder={reportModal.submitType === 'disaster' ? "Chi tiết sự cố..." : "Tình trạng cụ thể và Nhu cầu (Ví dụ: Cần mì gói, nước sạch...)"}
                                value={reportForm.details}
                                onChange={e => setReportForm({ ...reportForm, details: e.target.value })}
                                required
                                rows="3"
                                style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                            ></textarea>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="btn btn-outline btn-sm" onClick={() => setReportModal({ show: false, lat: null, lng: null, submitType: 'disaster' })}>Hủy</button>
                                <button type="submit" className="btn btn-primary btn-sm">Gửi Thông Tin</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPage;
