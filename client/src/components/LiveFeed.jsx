import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LiveFeed = () => {
    const [latestDonationId, setLatestDonationId] = useState(null);
    const initialLoadDone = useRef(false);

    useEffect(() => {
        const fetchRecentDonations = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/donations/recent');
                const recentDonations = res.data;

                if (recentDonations.length > 0) {
                    const latest = recentDonations[0];

                    if (initialLoadDone.current && latest.id !== latestDonationId) {
                        // We have a new donation!
                        toast.success(`${latest.donorName} vừa quyên góp ${latest.amount.toLocaleString('vi-VN')} VNĐ! 🎉`, {
                            position: "bottom-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
                            style: {
                                borderRadius: '12px',
                                boxShadow: 'var(--shadow-lg)'
                            }
                        });
                    }

                    // Update tracking ID
                    if (latest.id !== latestDonationId) {
                        setLatestDonationId(latest.id);
                    }
                }

                initialLoadDone.current = true;
            } catch (err) {
                console.error("LiveFeed fetch error:", err);
            }
        };

        // Fetch immediately and then every 10 seconds
        fetchRecentDonations();
        const interval = setInterval(fetchRecentDonations, 10000);

        return () => clearInterval(interval);
    }, [latestDonationId]);

    return null; // This component doesn't render anything visible, just triggers toasts
};

export default LiveFeed;
