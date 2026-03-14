import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666'];

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [campaigns, setCampaigns] = useState([]);
    const [donations, setDonations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [reliefRequests, setReliefRequests] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [summary, setSummary] = useState(null);
    const [newsList, setNewsList] = useState([]);
    const [newsForm, setNewsForm] = useState({ title: '', content: '', imageUrl: '' });
    const [expenses, setExpenses] = useState([]);
    const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', description: '' });
    const [inventoryForm, setInventoryForm] = useState({ name: '', quantity: '', unit: 'kg', lat: '', lng: '' });
    const [users, setUsers] = useState([]);
    const [userForm, setUserForm] = useState({ username: '', password: '', role: 'user' });
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [campRes, donRes, volRes, reqRes, invRes, sumRes, newsRes, expRes, userRes] = await Promise.all([
                axios.get('http://localhost:5001/api/campaigns', config),
                axios.get('http://localhost:5001/api/donations', config),
                axios.get('http://localhost:5001/api/volunteers', config),
                axios.get('http://localhost:5001/api/relief-requests', config),
                axios.get('http://localhost:5001/api/inventory', config),
                axios.get('http://localhost:5001/api/dashboard/summary', config),
                axios.get('http://localhost:5001/api/news'),
                axios.get('http://localhost:5001/api/expenses', config),
                axios.get('http://localhost:5001/api/users', config)
            ]);
            setCampaigns(campRes.data);
            setDonations(donRes.data);
            setVolunteers(volRes.data);
            setReliefRequests(reqRes.data);
            setInventory(invRes.data);
            setSummary(sumRes.data);
            setNewsList(newsRes.data);
            setExpenses(expRes.data);
            setUsers(userRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/api/relief-requests/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleVolunteerUpdate = async (id, updates) => {
        try {
            await axios.put(`http://localhost:5001/api/volunteers/${id}`, updates, { headers: { Authorization: `Bearer ${token}` } });
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to update volunteer', error);
            toast.error('Lỗi cập nhật Tình nguyện viên!');
        }
    };

    const handleNewsSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/news', newsForm, { headers: { Authorization: `Bearer ${token}` } });
            setNewsForm({ title: '', content: '', imageUrl: '' });
            fetchDashboardData();
            toast.success('Đăng tin thành công!');
        } catch (error) {
            console.error('Lỗi đăng tin:', error);
            toast.error('Lỗi đăng tin!');
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/expenses', expenseForm, { headers: { Authorization: `Bearer ${token}` } });
            setExpenseForm({ title: '', amount: '', description: '' });
            fetchDashboardData();
            toast.success('Đã ghi nhận khoản chi!');
        } catch (error) {
            console.error('Lỗi ghi sổ:', error);
            toast.error('Lỗi ghi sổ!');
        }
    };

    const handleInventorySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/inventory', inventoryForm, { headers: { Authorization: `Bearer ${token}` } });
            setInventoryForm({ name: '', quantity: '', unit: 'kg', lat: '', lng: '' });
            fetchDashboardData();
            toast.success('Đã thêm lô hàng vào kho thành công!');
        } catch (error) {
            console.error('Lỗi thêm kho hàng:', error);
            toast.error('Lỗi thêm kho hàng!');
        }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/users', userForm, { headers: { Authorization: `Bearer ${token}` } });
            setUserForm({ username: '', password: '', role: 'user' });
            fetchDashboardData();
            toast.success('Thêm người dùng thành công!');
        } catch (error) {
            toast.error('Lỗi thêm người dùng!');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Xác nhận xóa người dùng này?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchDashboardData();
            toast.success('Đã xóa người dùng!');
        } catch (error) {
            toast.error('Lỗi xóa người dùng');
        }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await axios.put(`http://localhost:5001/api/users/${id}`, { role }, { headers: { Authorization: `Bearer ${token}` } });
            fetchDashboardData();
            toast.success('Cập nhật quyền thành công!');
        } catch (error) {
            toast.error('Lỗi cập nhật quyền');
        }
    };

    const handleDeleteCampaign = async (id) => {
        if (!window.confirm('Xác nhận xóa chiến dịch này?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/campaigns/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchDashboardData();
            toast.success('Đã xóa chiến dịch!');
        } catch (error) {
            toast.error('Lỗi xóa chiến dịch');
        }
    };

    const handleDeleteInventory = async (id) => {
        if (!window.confirm('Xác nhận xóa lô hàng này?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/inventory/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchDashboardData();
            toast.success('Đã xóa lô hàng!');
        } catch (error) {
            toast.error('Lỗi xóa lô hàng');
        }
    };

    const handleDonationStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/api/donations/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            fetchDashboardData();
            toast.success('Cập nhật trạng thái quyên góp!');
        } catch (error) {
            toast.error('Lỗi cập nhật trạng thái');
        }
    };

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.utils.writeFile(workbook, `${fileName}.xlsx`);
    };

    const exportToPDF = (data, columns, fileName) => {
        const doc = new jsPDF();
        const tableColumn = columns.map(c => c.header);
        const tableRows = data.map(item => columns.map(c => item[c.key]));
        doc.autoTable({ head: [tableColumn], body: tableRows });
        doc.save(`${fileName}.pdf`);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">Admin Panel</div>
                <nav className="admin-nav">
                    <button className={`admin-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Tổng Quan</button>
                    <button className={`admin-nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Người Dùng</button>
                    <button className={`admin-nav-link ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}>Chiến Dịch</button>
                    <button className={`admin-nav-link ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>Quyên Góp</button>
                    <button className={`admin-nav-link ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Người Yêu Cầu</button>
                    <button className={`admin-nav-link ${activeTab === 'volunteers' ? 'active' : ''}`} onClick={() => setActiveTab('volunteers')}>Tình Nguyện Viên</button>
                    <button className={`admin-nav-link ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Kho Hàng</button>
                    <button className={`admin-nav-link ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>Sổ Thu Chi</button>
                    <button className={`admin-nav-link ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>Tin Tức</button>
                </nav>
            </aside>

            <main className="admin-content">
                <header className="admin-header">
                    <h2>
                        {activeTab === 'dashboard' && 'Tổng Quan Hệ Thống'}
                        {activeTab === 'users' && 'Quản Lý Người Dùng'}
                        {activeTab === 'campaigns' && 'Quản Lý Chiến Dịch'}
                        {activeTab === 'donations' && 'Danh Sách Quyên Góp'}
                        {activeTab === 'requests' && 'Yêu Cầu Cứu Trợ'}
                        {activeTab === 'volunteers' && 'Quản Lý Tình Nguyện Viên'}
                        {activeTab === 'inventory' && 'Quản Lý Kho Hàng'}
                        {activeTab === 'expenses' && 'Sổ Thu Chi (Minh Bạch Tài Chính)'}
                        {activeTab === 'news' && 'Quản Trị Tin Tức'}
                    </h2>
                    <button className="btn btn-primary btn-sm" onClick={handleLogout}>Đăng Xuất</button>
                </header>

                <div className="admin-body">
                    {activeTab === 'dashboard' && summary && (
                        <div>
                            <div className="summary-cards" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                                <div className="card" style={{ padding: '20px', flex: 1, backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                                    <h3>Tổng Chiến Dịch</h3>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{summary.stats.totalCampaigns}</p>
                                </div>
                                <div className="card" style={{ padding: '20px', flex: 1, backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                                    <h3>Tổng Quyên Góp</h3>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{summary.stats.totalDonated.toLocaleString()} VNĐ</p>
                                </div>
                                <div className="card" style={{ padding: '20px', flex: 1, backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                                    <h3>Tình Nguyện Viên</h3>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>{summary.stats.totalVolunteers}</p>
                                </div>
                            </div>

                            <div className="charts-container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <div className="chart-wrapper" style={{ flex: '1 1 500px', minHeight: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <h3>Tiến Độ Chiến Dịch</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={summary.campaigns}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="target" name="Mục Tiêu" fill="#8884d8" />
                                            <Bar dataKey="current" name="Hiện Tại" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-wrapper" style={{ flex: '1 1 400px', minHeight: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <h3>Tỷ Trọng Kho Hàng</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={summary.inventory} dataKey="quantity" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                                {summary.inventory.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <form onSubmit={handleUserSubmit} className="card" style={{ padding: '20px', marginBottom: '30px', backgroundColor: '#fff', borderRadius: '8px' }}>
                                <h3>Thêm Người Dùng</h3>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', marginTop: '15px' }}>
                                    <input type="text" placeholder="Tên đăng nhập" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} />
                                    <input type="password" placeholder="Mật khẩu" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} />
                                    <select style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                                        <option value="user">User</option>
                                        <option value="volunteer">Volunteer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '16px' }}>Tạo Người Dùng</button>
                            </form>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Quyền (Role)</th>
                                        <th>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.username}</td>
                                            <td>
                                                <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} style={{ padding: '5px' }}>
                                                    <option value="user">User</option>
                                                    <option value="volunteer">Volunteer</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => handleDeleteUser(u.id)}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'campaigns' && (
                        <div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên Chiến Dịch</th>
                                        <th>Mục Tiêu</th>
                                        <th>Hiện Tại</th>
                                        <th>Trạng Thái</th>
                                        <th>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.title}</td>
                                            <td>{c.target.toLocaleString()} VNĐ</td>
                                            <td>{c.current.toLocaleString()} VNĐ</td>
                                            <td><span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => handleDeleteCampaign(c.id)}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên Người Yêu Cầu</th>
                                    <th>SĐT</th>
                                    <th>Nhu Cầu</th>
                                    <th>Trạng Thái</th>
                                    <th>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reliefRequests.map(r => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td>{r.name}</td>
                                        <td>{r.phone}</td>
                                        <td>{r.needs}</td>
                                        <td><span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                                        <td>
                                            {r.status === 'Pending' && (
                                                <button className="btn btn-sm btn-outline" onClick={() => handleUpdateStatus(r.id, 'Resolved')} style={{ color: 'green', borderColor: 'green' }}>✓ Duyệt</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'inventory' && (
                        <div>
                            <form onSubmit={handleInventorySubmit} className="card" style={{ padding: '20px', marginBottom: '30px', backgroundColor: '#fff', borderRadius: '8px' }}>
                                <h3>Thêm Lô Hàng Mới (Cấu hình Vị trí kho)</h3>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', marginTop: '15px' }}>
                                    <input type="text" placeholder="Tên hàng hóa (Vd: Mì tôm)" required style={{ flex: 2, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={inventoryForm.name} onChange={e => setInventoryForm({ ...inventoryForm, name: e.target.value })} />
                                    <input type="number" placeholder="Số lượng" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={inventoryForm.quantity} onChange={e => setInventoryForm({ ...inventoryForm, quantity: e.target.value })} />
                                    <select style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={inventoryForm.unit} onChange={e => setInventoryForm({ ...inventoryForm, unit: e.target.value })}>
                                        <option value="kg">kg</option>
                                        <option value="thùng">thùng</option>
                                        <option value="cái">cái</option>
                                        <option value="chai">chai</option>
                                        <option value="túi">túi</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                    <input type="number" step="any" placeholder="Vĩ độ kho hàng (Lat...)" style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={inventoryForm.lat} onChange={e => setInventoryForm({ ...inventoryForm, lat: e.target.value })} />
                                    <input type="number" step="any" placeholder="Kinh độ kho hàng (Lng...)" style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={inventoryForm.lng} onChange={e => setInventoryForm({ ...inventoryForm, lng: e.target.value })} />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '16px' }}>Lưu Kho</button>
                            </form>

                            <div style={{ marginBottom: '15px', textAlign: 'right' }}>
                                <button className="btn btn-outline btn-sm" style={{ marginRight: '10px' }} onClick={() => exportToExcel(inventory, 'KhoHang')}>Xuất Excel</button>
                                <button className="btn btn-outline btn-sm" onClick={() => exportToPDF(inventory, [{ header: 'ID', key: 'id' }, { header: 'Name', key: 'name' }, { header: 'Qty', key: 'quantity' }, { header: 'Unit', key: 'unit' }], 'KhoHang')}>Xuất PDF</button>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên Hàng Hóa</th>
                                        <th>Số Lượng</th>
                                        <th>Đơn Vị</th>
                                        <th>Tọa Độ</th>
                                        <th>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map(i => (
                                        <tr key={i.id}>
                                            <td>{i.id}</td>
                                            <td>{i.name}</td>
                                            <td>{i.quantity.toLocaleString()}</td>
                                            <td>{i.unit}</td>
                                            <td>{i.lat && i.lng ? `${i.lat}, ${i.lng}` : 'Chưa đặt'}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => handleDeleteInventory(i.id)}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'news' && (
                        <div>
                            <form onSubmit={handleNewsSubmit} className="card" style={{ padding: '20px', marginBottom: '30px', backgroundColor: '#fff', borderRadius: '8px' }}>
                                <h3>Đăng Bản Tin Mới</h3>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', marginTop: '15px' }}>
                                    <input type="text" placeholder="Tiêu đề bài viết" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} />
                                    <input type="text" placeholder="URL Hình ảnh (tuỳ chọn)" style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={newsForm.imageUrl} onChange={e => setNewsForm({ ...newsForm, imageUrl: e.target.value })} />
                                </div>
                                <textarea placeholder="Nội dung bài viết..." required rows="5" style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }} value={newsForm.content} onChange={e => setNewsForm({ ...newsForm, content: e.target.value })}></textarea>
                                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '16px' }}>Đăng Tải</button>
                            </form>

                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tiêu Đề</th>
                                        <th>Ngày Đăng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsList.map(n => (
                                        <tr key={n.id}>
                                            <td>{n.id}</td>
                                            <td>{n.title}</td>
                                            <td>{new Date(n.createdAt).toLocaleDateString('vi-VN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Expenses tab */}
                    {activeTab === 'expenses' && (
                        <div>
                            <form onSubmit={handleExpenseSubmit} className="card" style={{ padding: '20px', marginBottom: '30px', backgroundColor: '#fff', borderRadius: '8px' }}>
                                <h3>Ghi Nhận Khoản Chi Mới</h3>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', marginTop: '15px' }}>
                                    <input type="text" placeholder="Tên khoản chi (Vd: Mua 100 tấn gạo)" required style={{ flex: 2, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={expenseForm.title} onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })} />
                                    <input type="number" placeholder="Số tiền (VNĐ)" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
                                </div>
                                <input type="text" placeholder="Ghi chú chi tiết..." style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }} value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} />
                                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '16px' }}>Lưu Vào Sổ</button>
                            </form>

                            <div style={{ marginBottom: '15px', textAlign: 'right' }}>
                                <button className="btn btn-outline btn-sm" style={{ marginRight: '10px' }} onClick={() => exportToExcel(expenses, 'SoThuChi')}>Xuất Excel</button>
                                <button className="btn btn-outline btn-sm" onClick={() => exportToPDF(expenses, [{ header: 'Date', key: 'date' }, { header: 'Title', key: 'title' }, { header: 'Amount', key: 'amount' }], 'SoThuChi')}>Xuất PDF</button>
                            </div>

                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Ngày Chi</th>
                                        <th>Hạng Mục</th>
                                        <th>Số Tiền</th>
                                        <th>Ghi Chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map(e => (
                                        <tr key={e.id}>
                                            <td>{e.id}</td>
                                            <td>{new Date(e.date).toLocaleDateString('vi-VN')}</td>
                                            <td>{e.title}</td>
                                            <td style={{ color: '#dc3545', fontWeight: 'bold' }}>-{e.amount.toLocaleString()} VNĐ</td>
                                            <td>{e.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Donations and Volunteers tabs remain similar, shortened for brevity */}
                    {activeTab === 'donations' && (
                        <div>
                            <div style={{ marginBottom: '15px', textAlign: 'right' }}>
                                <button className="btn btn-outline btn-sm" style={{ marginRight: '10px' }} onClick={() => exportToExcel(donations.map(d => ({ id: d.id, donorName: d.donorName, amount: d.amount, campaign: d.Campaign?.title })), 'QuyenGop')}>Xuất Excel</button>
                            </div>
                            <table className="admin-table">
                                <thead><tr><th>ID</th><th>Người Ủng Hộ</th><th>Số Tiền</th><th>Chiến Dịch</th><th>Trạng Thái</th><th>Thao Tác</th></tr></thead>
                                <tbody>
                                    {donations.map(d => (
                                        <tr key={d.id}>
                                            <td>{d.id}</td>
                                            <td>{d.donorName}</td>
                                            <td>{d.amount.toLocaleString()}</td>
                                            <td>{d.Campaign?.title}</td>
                                            <td><span className={`status-badge ${(d.status || 'pending').toLowerCase()}`}>{d.status || 'pending'}</span></td>
                                            <td>
                                                <select value={d.status || 'pending'} onChange={(e) => handleDonationStatusUpdate(d.id, e.target.value)} style={{ padding: '5px' }}>
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === 'volunteers' && (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ & Tên</th>
                                    <th>SĐT</th>
                                    <th>Kỹ Năng</th>
                                    <th>Trạng Thái</th>
                                    <th>Điều Phối Vào Vùng Dịch</th>
                                    <th>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {volunteers.map(v => (
                                    <tr key={v.id}>
                                        <td>{v.id}</td>
                                        <td>
                                            <div style={{ fontWeight: 'bold', color: '#333' }}>{v.name}</div>
                                            <div style={{ fontSize: '12px', color: '#777' }}>{v.email}</div>
                                        </td>
                                        <td>{v.phone}</td>
                                        <td><span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '12px', fontSize: '13px' }}>{v.skills}</span></td>
                                        <td>
                                            <span className={`status-badge ${(v.status || 'Pending').toLowerCase()}`}>
                                                {v.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={v.ReliefRequestId || ''}
                                                onChange={(e) => handleVolunteerUpdate(v.id, { ReliefRequestId: e.target.value === '' ? null : e.target.value })}
                                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', maxWidth: '200px', backgroundColor: v.status !== 'Approved' ? '#f3f4f6' : '#fff' }}
                                                disabled={v.status !== 'Approved'}
                                            >
                                                <option value="">-- Đang chờ Lệnh --</option>
                                                {reliefRequests.filter(r => r.status !== 'Resolved').map(r => (
                                                    <option key={r.id} value={r.id}>
                                                        Trạm: {r.name} - {r.needs.substring(0, 20)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            {(!v.status || v.status === 'Pending') ? (
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    <button className="btn btn-sm" onClick={() => handleVolunteerUpdate(v.id, { status: 'Approved' })} style={{ backgroundColor: '#10b981', color: 'white', border: 'none' }}>Duyệt</button>
                                                    <button className="btn btn-sm" onClick={() => handleVolunteerUpdate(v.id, { status: 'Rejected' })} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}>Từ Chối</button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '13px', color: v.status === 'Approved' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                                    {v.status === 'Approved' ? '✅ Đã Duyệt' : '❌ Đã Loại'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;
