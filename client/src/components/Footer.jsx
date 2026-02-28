import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-modern">
            <div className="footer-grid">
                {/* Brand Info */}
                <div className="footer-brand">
                    <h2>
                        <Heart size={28} fill="currentColor" style={{ color: "var(--primary-color)" }} />
                        <span>Cứu Trợ 24h</span>
                    </h2>
                    <p>
                        Nền tảng công nghệ kết nối những tấm lòng vàng với các khu vực chịu ảnh hưởng bởi thiên tai. Minh bạch, nhanh chóng và hiệu quả.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="social-icon"><Facebook size={18} /></a>
                        <a href="#" className="social-icon"><Twitter size={18} /></a>
                        <a href="#" className="social-icon"><Instagram size={18} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-links">
                    <h3>Liên Kết Nhanh</h3>
                    <ul>
                        <li><Link to="/campaigns">Chiến Dịch Gây Quỹ</Link></li>
                        <li><Link to="/map">Bản Đồ Cảnh Báo</Link></li>
                        <li><Link to="/volunteer">Đăng Ký Tình Nguyện</Link></li>
                        <li><Link to="/statement">Minh Bạch Sao Kê</Link></li>
                        <li><Link to="/news">Tin Tức Khẩn Cấp</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div className="footer-links">
                    <h3>Hỗ Trợ</h3>
                    <ul>
                        <li><Link to="/">Hướng dẫn quyên góp</Link></li>
                        <li><Link to="/">Câu hỏi thường gặp</Link></li>
                        <li><Link to="/">Bảo mật thông tin</Link></li>
                        <li><Link to="/">Điều khoản</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-links footer-contact">
                    <h3>Liên Hệ</h3>
                    <ul>
                        <li>
                            <MapPin className="footer-contact-icon" size={20} />
                            <span>123 Đường Cứu Trợ, Quận Trung Tâm, TP. Hà Nội, Việt Nam</span>
                        </li>
                        <li>
                            <Phone className="footer-contact-icon" size={20} />
                            <span>Hotline: 1900 1234</span>
                        </li>
                        <li>
                            <Mail className="footer-contact-icon" size={20} />
                            <span>hotro@cuutro24h.vn</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Hệ Thống Quản Lý Cứu Trợ. Vì cộng đồng.</p>
                <div className="footer-bottom-links">
                    <Link to="/">Chính sách</Link>
                    <Link to="/">Bản tin</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
