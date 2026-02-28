import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statement = () => {
    const [data, setData] = useState({ summary: {}, donations: [], expenses: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('in'); // 'in' for donations, 'out' for expenses

    useEffect(() => {
        const fetchStatements = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/statements');
                setData(res.data);
            } catch (error) {
                console.error('Error fetching statements:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatements();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Statement Data...</div>;

    const summary = data.summary;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: '#1e293b', fontSize: '36px', marginBottom: '10px' }}>Bảng Sao Kê Minh Bạch</h1>
                    <p style={{ color: '#64748b', fontSize: '18px' }}>Mọi khoản đóng góp và chi tiêu đều được ghi nhận công khai</p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px', backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #10b981' }}>
                        <h3 style={{ color: '#64748b', fontSize: '16px', marginBottom: '10px' }}>Tổng Tiền Thu Vào</h3>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>+ {summary.totalIn?.toLocaleString()} VNĐ</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px', backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #ef4444' }}>
                        <h3 style={{ color: '#64748b', fontSize: '16px', marginBottom: '10px' }}>Tổng Tiền Chi Ra</h3>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>- {summary.totalOut?.toLocaleString()} VNĐ</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px', backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #3b82f6' }}>
                        <h3 style={{ color: '#64748b', fontSize: '16px', marginBottom: '10px' }}>Tồn Quỹ Hiện Tại</h3>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>{summary.balance?.toLocaleString()} VNĐ</div>
                    </div>
                </div>

                {/* Ledger Table */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                        <button
                            style={{ flex: 1, padding: '15px', backgroundColor: activeTab === 'in' ? '#f8fafc' : '#fff', border: 'none', borderBottom: activeTab === 'in' ? '3px solid #10b981' : '3px solid transparent', fontSize: '16px', fontWeight: 'bold', color: activeTab === 'in' ? '#10b981' : '#64748b', cursor: 'pointer' }}
                            onClick={() => setActiveTab('in')}
                        >
                            Thu Vào ({data.donations.length} GD)
                        </button>
                        <button
                            style={{ flex: 1, padding: '15px', backgroundColor: activeTab === 'out' ? '#f8fafc' : '#fff', border: 'none', borderBottom: activeTab === 'out' ? '3px solid #ef4444' : '3px solid transparent', fontSize: '16px', fontWeight: 'bold', color: activeTab === 'out' ? '#ef4444' : '#64748b', cursor: 'pointer' }}
                            onClick={() => setActiveTab('out')}
                        >
                            Chi Ra ({data.expenses.length} GD)
                        </button>
                    </div>

                    <div style={{ padding: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                                    <th style={{ padding: '12px' }}>Thời Gian</th>
                                    <th style={{ padding: '12px' }}>Nội Dung</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Số Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'in' && data.donations.map(d => (
                                    <tr key={`in-${d.id}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px', color: '#64748b' }}>{new Date(d.createdAt).toLocaleString('vi-VN')}</td>
                                        <td style={{ padding: '12px' }}>Ủng hộ từ: <strong>{d.donorName}</strong></td>
                                        <td style={{ padding: '12px', textAlign: 'right', color: '#10b981', fontWeight: 'bold' }}>+ {d.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {activeTab === 'out' && data.expenses.map(e => (
                                    <tr key={`out-${e.id}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px', color: '#64748b' }}>{new Date(e.date).toLocaleString('vi-VN')}</td>
                                        <td style={{ padding: '12px' }}>Chi tiêu: <strong>{e.title}</strong><br /><span style={{ fontSize: '13px', color: '#94a3b8' }}>{e.description}</span></td>
                                        <td style={{ padding: '12px', textAlign: 'right', color: '#ef4444', fontWeight: 'bold' }}>- {e.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(activeTab === 'in' && data.donations.length === 0) && <p style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Chưa có giao dịch quyên góp nào.</p>}
                        {(activeTab === 'out' && data.expenses.length === 0) && <p style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Chưa có khoản chi nào.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statement;
