import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/news');
                setNewsList(res.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải tin tức...</div>;

    return (
        <div>
            <section className="hero">
                <h1>Tin Tức & Thông Báo Khẩn</h1>
                <p>Cập nhật tình hình thiệt hại và hoạt động cứu trợ nhanh nhất từ các vùng miền.</p>
            </section>

            <div className="container" style={{ padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="news-grid">
                    {newsList.length === 0 ? (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>Chưa có bản tin nào được đăng tải.</p>
                    ) : (
                        newsList.map(item => (
                            <div key={item.id} className="news-card">
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt={item.title} className="news-card-img" />
                                )}
                                <div className="news-card-content">
                                    <div className="news-meta">
                                        {new Date(item.createdAt).toLocaleDateString('vi-VN')} • Báo cáo bởi {item.author}
                                    </div>
                                    <h3 className="news-title">{item.title}</h3>
                                    <p className="news-excerpt">
                                        {item.content.substring(0, 100)}...
                                    </p>
                                    <div style={{ marginTop: 'auto' }}>
                                        <Link to={`/news/${item.id}`} className="btn btn-primary btn-sm">Xem Ngay</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default News;
