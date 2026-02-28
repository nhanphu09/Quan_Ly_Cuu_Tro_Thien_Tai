import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-icon-wrap">
                    <div className="not-found-glow"></div>
                    <ShieldAlert className="not-found-icon" strokeWidth={1.5} />
                </div>

                <h1 className="not-found-404">404</h1>
                <h2 className="not-found-title">Khu Vực Không Tồn Tại</h2>

                <p className="not-found-desc">
                    Có vẻ như vùng đất bạn đang tìm kiếm đã mất kết nối hoặc không bao giờ tồn tại.
                    Hãy cùng chúng tôi quay về trung tâm cứu trợ an toàn nhé.
                </p>

                <Link to="/" className="btn btn-primary">
                    <Home size={20} /> Về Trang Chủ
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
