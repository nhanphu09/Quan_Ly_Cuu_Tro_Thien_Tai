import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/campaigns')
            .then(res => res.json())
            .then(data => setCampaigns(data))
            .catch(err => console.error('Error fetching campaigns:', err));
    }, []);

    return (
        <div className="home-container">
            <section className="hero">
                <div className="hero-content hero-glass-card animate-fade-in-up">
                    <h1 style={{ color: '#fff' }}>{t('home.title')}</h1>
                    <p>{t('home.subtitle')}</p>
                    <div className="hero-actions" style={{ marginTop: '2rem' }}>
                        <Link to="/donate" className="btn btn-primary">{t('home.donate_now')}</Link>
                        <Link to="/volunteer" className="btn btn-secondary">{t('home.register_volunteer')}</Link>
                    </div>
                </div>
            </section>

            <section className="featured-campaigns">
                <h2>{t('home.latest_campaigns')}</h2>
                <div className="campaign-grid">
                    {campaigns.length === 0 ? (
                        <p className="loading-text">Đang tải dữ liệu chiến dịch...</p>
                    ) : (
                        campaigns.map((campaign, index) => (
                            <div key={campaign.id} className={`campaign-card animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="card-image placeholder"></div>
                                <h3>{campaign.title}</h3>
                                <p>{campaign.description || 'Chưa có mô tả'}</p>
                                <div className="progress-bar" style={{ height: '10px', borderRadius: '5px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                                    <div
                                        className="progress progress-bar-striped"
                                        style={{ width: `${Math.min((campaign.current / campaign.target) * 100, 100)}%`, backgroundColor: 'var(--primary-color)', height: '100%' }}
                                    ></div>
                                </div>
                                <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{t('home.raised')}: {campaign.current.toLocaleString('vi-VN')} / {campaign.target.toLocaleString('vi-VN')} VNĐ</p>
                                <Link to={`/campaigns/${campaign.id}`} className="btn btn-outline">{t('home.view_all')}</Link>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
