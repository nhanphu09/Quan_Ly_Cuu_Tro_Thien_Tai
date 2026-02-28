import React, { useState } from 'react';
import axios from 'axios';
import { Heart, Stethoscope, Truck, ChefHat, Wrench, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const Volunteer = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const skillsOptions = [
        { id: 'yte', label: 'Cấp cứu & Y tế', icon: <Stethoscope size={20} /> },
        { id: 'vanchuyen', label: 'Vận chuyển / Lái xe', icon: <Truck size={20} /> },
        { id: 'nauan', label: 'Hậu cần & Nấu ăn', icon: <ChefHat size={20} /> },
        { id: 'xaydung', label: 'Sửa chữa & Dọn dẹp', icon: <Wrench size={20} /> },
        { id: 'cuuho', label: 'Cứu hộ an toàn', icon: <Shield size={20} /> },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCustomSkillSelect = (skillLabel) => {
        setFormData({ ...formData, skills: skillLabel });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5001/api/volunteers', formData);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi. Xin vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl border border-green-100">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Cảm Ơn Tấm Lòng Của Bạn!</h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Đơn đăng ký tình nguyện viên của <strong>{formData.name}</strong> đã được gửi thành công. Đội ngũ điều phối của chúng tôi sẽ xem xét cấu hình Kỹ năng <strong>"{formData.skills}"</strong> của bạn và liên hệ qua Số điện thoại hoặc Email khi có nhiệm vụ tại vùng tâm bão.
                    </p>
                    <button
                        onClick={() => { setIsSuccess(false); setFormData({ name: '', email: '', phone: '', skills: '' }); }}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                    >
                        Gửi hồ sơ khác
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Trở Thành Tình Nguyện Viên</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Sức mạnh tập thể sẽ giúp chúng ta vượt qua mọi khó khăn. Hãy góp sức mình ngay hôm nay.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-indigo-50 p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và Tên *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Nhập tên đầy đủ"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="09xx xxx xxx"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Email (Tùy chọn)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Năng Lực & Kỹ Năng Tình Nguyện *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {skillsOptions.map((skill, index) => (
                                <div
                                    key={skill.id}
                                    onClick={() => handleCustomSkillSelect(skill.label)}
                                    className={`volunteer-skill-card animate-fade-in-up ${formData.skills === skill.label ? 'selected' : ''}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="volunteer-skill-icon">
                                        {skill.icon}
                                    </div>
                                    <span className="font-medium text-sm">{skill.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs text-gray-500 mb-2">Hoặc nhập tay kỹ năng khác (nếu có):</label>
                            <input
                                type="text"
                                name="skills"
                                required
                                value={formData.skills}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Ví dụ: Phiên dịch ngôn ngữ ký hiệu, Bơi lội siêu việt..."
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1'}`}
                        >
                            {isSubmitting ? 'ĐANG GỬI HỒ SƠ...' : 'ĐĂNG KÝ THAM GIA ĐỘI CỨU TRỢ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Volunteer;
