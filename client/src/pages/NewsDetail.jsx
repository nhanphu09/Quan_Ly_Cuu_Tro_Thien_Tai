import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/news/${id}`);
                setNews(res.data);
            } catch (error) {
                console.error('Error fetching news detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewsItem();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải nội dung...</div>;
    if (!news) return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy bản tin.</div>;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {news.imageUrl && (
                    <img src={news.imageUrl} alt={news.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                )}

                <div style={{ padding: '40px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <Link to="/news" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Trở về Tin Tức</Link>
                    </div>

                    <h1 style={{ color: '#1e293b', fontSize: '32px', marginBottom: '15px', lineHeight: '1.3' }}>{news.title}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '14px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                        <span style={{ marginRight: '20px' }}>📅 {new Date(news.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span>✍️ {news.author}</span>
                    </div>

                    <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                        {news.content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
