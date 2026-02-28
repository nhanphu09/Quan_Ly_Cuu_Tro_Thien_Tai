import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CampaignDetail = () => {
    const { id } = useParams();
    const { user, token } = useContext(AuthContext);
    const [campaign, setCampaign] = useState(null);
    const [comments, setComments] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newUpdate, setNewUpdate] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCampaignData = async () => {
        try {
            // Because we don't have GET /api/campaigns/:id natively yet, 
            // we will fetch all and filter for now as a quick bypass
            const campRes = await axios.get('http://localhost:5001/api/campaigns');
            const foundCamp = campRes.data.find(c => c.id === parseInt(id));
            setCampaign(foundCamp);

            const commRes = await axios.get(`http://localhost:5001/api/campaigns/${id}/comments`);
            setComments(commRes.data);

            const updatesRes = await axios.get(`http://localhost:5001/api/campaigns/${id}/updates`);
            setUpdates(updatesRes.data);
        } catch (error) {
            console.error('Error fetching campaign detail:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaignData();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await axios.post(
                `http://localhost:5001/api/campaigns/${id}/comments`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Lỗi khi gửi bình luận:', error);
            toast.error('Không thể gửi bình luận, vui lòng thử lại.');
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!newUpdate.trim()) return;
        try {
            const res = await axios.post(
                `http://localhost:5001/api/campaigns/${id}/updates`,
                { content: newUpdate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUpdates([res.data, ...updates]);
            setNewUpdate('');
            toast.success('Đã cập nhật tiến độ chiến dịch!');
        } catch (error) {
            console.error('Lỗi khi cập nhật tiến độ:', error);
            toast.error('Không thể đăng cập nhật, vui lòng thử lại.');
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success('Đã copy đường dẫn chiến dịch để chia sẻ!');
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải chiến dịch...</div>;
    if (!campaign) return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy chiến dịch.</div>;

    const progress = Math.min((campaign.current / campaign.target) * 100, 100);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {/* Header Image Placeholder */}
                <div style={{ height: '300px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
                    {campaign.title}
                </div>

                <div style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} className="animate-fade-in-up">
                        <div>
                            <span className={`status-badge ${campaign.status.toLowerCase()}`}>{campaign.status}</span>
                            <h1 style={{ color: '#1e293b', fontSize: '32px', margin: '15px 0' }}>{campaign.title}</h1>
                        </div>
                        <button onClick={handleShare} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔗 Chia Sẻ
                        </button>
                    </div>

                    <div style={{ margin: '30px 0', padding: '25px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <strong style={{ fontSize: '20px', color: '#0369a1' }}>Đã quyên góp: {campaign.current.toLocaleString('vi-VN')} VNĐ</strong>
                            <span style={{ color: '#64748b' }}>Mục tiêu: {campaign.target.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <div className="progress-bar-container" style={{ backgroundColor: '#e0f2fe', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
                            <div className="progress-bar-striped" style={{ width: `${progress}%`, backgroundColor: '#0284c7', height: '100%', borderRadius: '10px' }}></div>
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Link to="/donate" className="btn btn-primary" style={{ padding: '12px 40px', fontSize: '18px' }}>💖 Quyên Góp Ngay</Link>
                        </div>
                    </div>

                    <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '16px', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
                        <h3>Mô tả chiến dịch</h3>
                        {campaign.description}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '40px 0' }} />

                    {/* Timeline Updates Section */}
                    <div className="updates-section" style={{ marginBottom: '40px' }}>
                        <h3 style={{ marginBottom: '20px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            ⏳ Nhật Ký & Tiến Độ Cứu Trợ
                        </h3>

                        {user && user.role === 'admin' && (
                            <form onSubmit={handleUpdateSubmit} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <strong style={{ display: 'block', marginBottom: '10px', color: 'var(--primary-color)' }}>🔧 Khu Vực Đăng Tải Dành Cho Admin</strong>
                                <textarea
                                    placeholder="Cập nhật tiến độ chiến dịch (Vd: Hàng cứu trợ đã đến nơi...)"
                                    value={newUpdate}
                                    onChange={(e) => setNewUpdate(e.target.value)}
                                    rows="3"
                                    required
                                    style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px', fontSize: '15px' }}
                                ></textarea>
                                <div style={{ textAlign: 'right' }}>
                                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>Đăng Cập Nhật</button>
                                </div>
                            </form>
                        )}

                        <div className="updates-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderLeft: '3px solid #e2e8f0', paddingLeft: '20px', marginLeft: '10px' }}>
                            {updates.length === 0 ? (
                                <p style={{ color: '#64748b', fontStyle: 'italic' }}>Chiến dịch này chưa có cập nhật tiến độ nào.</p>
                            ) : (
                                updates.map(update => (
                                    <div key={update.id} style={{ position: 'relative', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                                        <div style={{ position: 'absolute', left: '-29px', top: '20px', width: '15px', height: '15px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', border: '3px solid #fff' }}></div>
                                        <span style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold' }}>
                                            Ngày {new Date(update.createdAt).toLocaleDateString('vi-VN')} lúc {new Date(update.createdAt).toLocaleTimeString('vi-VN')}
                                        </span>
                                        <div style={{ color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                                            {update.content}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '40px 0' }} />

                    <div className="comments-section">
                        <h3 style={{ marginBottom: '20px', color: '#0f172a' }}>Lời động viên ({comments.length})</h3>

                        {user ? (
                            <form onSubmit={handleCommentSubmit} style={{ marginBottom: '30px' }}>
                                <textarea
                                    placeholder="Viết lời động viên của bạn..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows="3"
                                    required
                                    style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px', fontSize: '15px' }}
                                ></textarea>
                                <div style={{ textAlign: 'right' }}>
                                    <button type="submit" className="btn btn-primary">Gửi Bình Luận</button>
                                </div>
                            </form>
                        ) : (
                            <div style={{ padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center', marginBottom: '30px', color: '#475569' }}>
                                Vui lòng <Link to="/login" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Đăng nhập</Link> để gửi lời động viên.
                            </div>
                        )}

                        <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {comments.map(c => (
                                <div key={c.id} style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <strong style={{ color: '#1e293b' }}>{c.User ? c.User.username : 'Ẩn danh'}</strong>
                                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div style={{ color: '#334155', lineHeight: '1.5' }}>
                                        {c.content}
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>Chưa có bình luận nào. Hãy là người đầu tiên gửi lời động viên!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetail;
