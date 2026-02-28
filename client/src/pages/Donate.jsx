import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Donate = () => {
    const { token } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        donorName: '',
        email: '',
        amount: '',
        message: '',
        paymentMethod: 'bank'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mô phỏng độ trễ khi kết nối cổng thanh toán
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // Gửi dữ liệu tới Backend
            await axios.post('http://localhost:5001/api/donations', formData, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting donation:', error);
            toast.error('Rất tiếc, có lỗi xảy ra khi thực hiện giao dịch. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="donate-container" style={{ padding: '80px 20px', minHeight: '60vh' }}>
                <div className="donate-success-card">
                    <div className="success-icon">💖</div>
                    <h2 className="success-title">Quyên Góp Thành Công!</h2>
                    <div className="success-message">
                        Cảm ơn tấm lòng vàng của <strong>{formData.donorName}</strong>.
                        <br />
                        Khoản đóng góp <strong>{Number(formData.amount).toLocaleString('vi-VN')} VNĐ</strong> qua {formData.paymentMethod === 'bank' ? 'Chuyển Khoản' : formData.paymentMethod === 'momo' ? 'MoMo' : 'ZaloPay'} đã được ghi nhận.
                    </div>
                    <div className="success-email-notice">
                        <i>📧</i>
                        <span>Biên lai xác nhận đã được gửi đến: <strong>{formData.email}</strong></span>
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '2rem' }}
                        onClick={() => {
                            setIsSuccess(false);
                            setFormData({ donorName: '', email: '', amount: '', message: '', paymentMethod: 'bank' });
                        }}>
                        Trở Về Trang Gây Quỹ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="donate-container">
            {isSubmitting && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 9999,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="spinner" style={{
                        width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #2ecc71',
                        borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px'
                    }}></div>
                    <h3 style={{ color: '#2c3e50' }}>Đang kết nối cổng thanh toán an toàn...</h3>
                    <p style={{ color: '#7f8c8d' }}>Vui lòng không đóng trình duyệt!</p>
                </div>
            )}

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>

            <section className="donate-hero">
                <h1>Chung Tay Cứu Trợ</h1>
                <p>Mỗi sự đóng góp của bạn, dù lớn hay nhỏ, đều là một tia sáng hy vọng.</p>
            </section>

            <div className="donate-content">
                <form className="donate-form" onSubmit={handleSubmit} style={{ position: 'relative' }}>
                    <h2>Thông Tin Quyên Góp</h2>

                    <div className="form-group">
                        <label htmlFor="donorName">Họ và Tên</label>
                        <input
                            type="text"
                            id="donorName"
                            name="donorName"
                            value={formData.donorName}
                            onChange={handleChange}
                            required
                            placeholder="Tên của bạn để lưu danh"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Địa Chỉ Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Nhận biên lai xác nhận qua email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Số Tiền (VNĐ)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            placeholder="Ví dụ: 500000"
                            min="10000"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Lời Nhắn (Tùy chọn)</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Gửi lời động viên đến đồng bào..."
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Chọn Cổng Thanh Toán</label>
                        <div className="payment-methods">
                            <label className={`payment-option ${formData.paymentMethod === 'bank' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank"
                                    checked={formData.paymentMethod === 'bank'}
                                    onChange={handleChange}
                                />
                                <span>Chuyển Khoản Ngân Hàng</span>
                            </label>
                            <label className={`payment-option ${formData.paymentMethod === 'momo' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="momo"
                                    checked={formData.paymentMethod === 'momo'}
                                    onChange={handleChange}
                                />
                                <span>Thanh Toán MoMo</span>
                            </label>
                            <label className={`payment-option ${formData.paymentMethod === 'zalopay' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="zalopay"
                                    checked={formData.paymentMethod === 'zalopay'}
                                    onChange={handleChange}
                                />
                                <span>Ví ZaloPay</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                        {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN CHUYỂN TIỀN'}
                    </button>
                </form>

                <div className="donate-info">
                    <h3>Cam Kết Minh Bạch</h3>
                    <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '20px' }}>
                        Toàn bộ số tiền quyên góp sẽ được chuyển thẳng đến các quỹ cứu trợ thiên tai khẩn cấp và được thống kê công khai trên trang chủ theo thời gian thực.
                    </p>
                    <div className="bank-info-card" style={{ background: '#f8fafc', borderLeft: '4px solid #3b82f6', padding: '20px' }}>
                        <h4 style={{ color: '#1e3a8a', marginTop: 0 }}>Thông Tin Tổ Chức Nhận</h4>
                        <p><strong>Số Tài Khoản:</strong> 0071001234567</p>
                        <p><strong>Ngân Hàng:</strong> Vietcombank (Chi Nhánh TP.HCM)</p>
                        <p><strong>Chủ Tài Khoản:</strong> QUỸ CỨU TRỢ THIÊN TAI VIETNAM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donate;
