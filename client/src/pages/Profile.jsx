import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Award, Clock, CreditCard, Heart, User, Mail, Calendar } from 'lucide-react';

const Profile = () => {
    const { user, token } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileData(res.data);
            } catch (err) {
                setError('Không thể tải dữ liệu hồ sơ. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
            setError('Bạn chưa đăng nhập.');
        }
    }, [token]);

    if (loading) return <div className="text-center py-20">Đang tải dữ liệu hồ sơ...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!profileData) return null;

    const { user: userData, history, totalDonated } = profileData;
    const hasGoldenBadge = totalDonated > 5000000;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Hồ Sơ Của Bạn</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cột trái: Thông tin cá nhân & Huy hiệu */}
                <div className="md:col-span-1 space-y-6">
                    {/* Card Thông tin */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4">
                            <User size={48} className="text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{userData.username}</h2>
                        <div className="space-y-3 mt-6">
                            <div className="flex items-center text-gray-600">
                                <Mail size={18} className="mr-3 text-gray-400" />
                                <span>Thành viên hệ thống</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar size={18} className="mr-3 text-gray-400" />
                                <span>Tham gia: {new Date(userData.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Huy Hiệu */}
                    <div className={`rounded-xl shadow-md p-6 border ${hasGoldenBadge ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                            <Award className="mr-2 text-indigo-500" /> Huy Hiệu Bảng Vàng
                        </h3>

                        <div className="text-center py-4">
                            {hasGoldenBadge ? (
                                <div className="animate-pulse">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-200 mb-3">
                                        <Heart size={40} className="text-white" fill="currentColor" />
                                    </div>
                                    <h4 className="font-bold text-xl text-yellow-700">Tấm Lòng Vàng</h4>
                                    <p className="text-sm text-yellow-600 mt-2">Cảm ơn bạn đã đóng góp vô cùng lớn lao cho cộng đồng!</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                        <Award size={40} className="text-gray-400" />
                                    </div>
                                    <h4 className="font-semibold text-gray-500">Chưa Đạt Huy Hiệu</h4>
                                    <p className="text-sm text-gray-500 mt-2">Hãy tiếp tục ủng hộ trên 5.000.000 VNĐ để mở khóa huy hiệu Tấm Lòng Vàng nhé.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200/50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Tổng quyên góp:</span>
                                <span className="font-bold text-green-600">{totalDonated.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            {/* Thanh tiến độ lên 5 triệu */}
                            {!hasGoldenBadge && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min((totalDonated / 5000000) * 100, 100)}%` }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Lịch sử quyên góp */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                            <Clock className="mr-2 text-blue-500" /> Lịch Sử Quyên Góp
                        </h3>

                        {history.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 text-sm">
                                            <th className="p-3 border-b">Mã GD</th>
                                            <th className="p-3 border-b">Ngày</th>
                                            <th className="p-3 border-b">Chiến dịch</th>
                                            <th className="p-3 border-b">Số tiền</th>
                                            <th className="p-3 border-b">Phương thức</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((donation) => (
                                            <tr key={donation.id} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="p-3 text-sm font-mono text-gray-500">#{donation.id}</td>
                                                <td className="p-3 text-sm">{new Date(donation.createdAt).toLocaleDateString('vi-VN')}</td>
                                                <td className="p-3 text-sm font-medium text-gray-700">
                                                    {donation.Campaign ? donation.Campaign.title : 'Quyên góp chung'}
                                                </td>
                                                <td className="p-3 font-semibold text-green-600">
                                                    {donation.amount.toLocaleString('vi-VN')} đ
                                                </td>
                                                <td className="p-3 text-sm text-gray-500 flex items-center">
                                                    <CreditCard size={14} className="mr-1" />
                                                    {donation.paymentMethod}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Bạn chưa có giao dịch quyên góp nào.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
