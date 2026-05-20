import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface Booking {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  item: string;
  user: string;
  status: 'confirmed' | 'cancelled' | 'pending' | 'completed';
  createdAt: Timestamp;
}

export default function Home() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    item: '대회의실',
    user: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(bookingsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    });

    return () => unsubscribe();
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.user) {
      alert('날짜와 예약자 성함을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });
      setFormData({
        date: '',
        startTime: '09:00',
        endTime: '10:00',
        item: '대회의실',
        user: '',
      });
      alert('예약이 성공적으로 완료되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold ring-1 ring-green-600/20">
            예약 완료
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold ring-1 ring-red-600/20">
            취소됨
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold ring-1 ring-gray-600/20">
            대기 중
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-12 py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl"
        >
          <h1 className="text-primary mb-2">효율적인 자원 관리를 시작하세요.</h1>
          <p className="text-secondary text-lg">회의실부터 전자기기까지, 필요한 모든 자원을 한 곳에서 예약하세요.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-5xl bg-white border border-outline-variant rounded-xl p-6 mt-10"
        >
          <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-3 text-left">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">날짜 선택</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div className="md:col-span-2 text-left">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">시작 시간</label>
              <select 
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary appearance-none"
              >
                <option>09:00</option>
                <option>10:00</option>
                <option>11:00</option>
                <option>12:00</option>
                <option>13:00</option>
                <option>14:00</option>
                <option>15:00</option>
                <option>16:00</option>
                <option>17:00</option>
                <option>18:00</option>
              </select>
            </div>
            <div className="md:col-span-2 text-left">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">종료 시간</label>
              <select 
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary appearance-none"
              >
                <option>10:00</option>
                <option>11:00</option>
                <option>12:00</option>
                <option>13:00</option>
                <option>14:00</option>
                <option>15:00</option>
                <option>16:00</option>
                <option>17:00</option>
                <option>18:00</option>
                <option>19:00</option>
              </select>
            </div>
            <div className="md:col-span-3 text-left">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">예약 항목</label>
              <select 
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary appearance-none"
              >
                <option>대회의실</option>
                <option>소회의실</option>
                <option>공용 노트북</option>
                <option>빔프로젝터</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? '예약 중...' : '예약하기'}
              </button>
            </div>
            <div className="md:col-span-12 text-left">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">예약자 성함</label>
              <input 
                type="text" 
                required
                value={formData.user}
                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                placeholder="성함을 입력하세요" 
                className="w-full h-12 px-4 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary transition-colors" 
              />
            </div>
          </form>
        </motion.div>
      </section>

      {/* Current Status */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-on-surface">현재 예약 현황</h2>
          <span className="px-3 py-1 bg-surface-container border border-outline-variant rounded-full text-xs font-medium">전체 {bookings.length}건</span>
        </div>
        <div className="overflow-hidden border border-outline-variant rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant">날짜</th>
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant">시간</th>
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant">항목</th>
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant">예약자</th>
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant text-center">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <AnimatePresence mode="popLayout">
                {bookings.map((booking) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={booking.id} 
                    className="hover:bg-surface-bright transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{booking.startTime} - {booking.endTime}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-secondary-container text-on-secondary-container rounded text-xs font-semibold">{booking.item}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{booking.user}</td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(booking.status)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="relative h-[300px] rounded-xl overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" 
            alt="Office" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-primary/20 flex items-end p-6">
            <div className="bg-white/90 backdrop-blur px-4 py-3 rounded-lg">
              <p className="text-sm font-bold text-primary">스마트한 공간 활용</p>
            </div>
          </div>
        </div>
        <div className="relative h-[300px] rounded-xl overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000" 
            alt="Tech" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-primary/20 flex items-end p-6">
            <div className="bg-white/90 backdrop-blur px-4 py-3 rounded-lg">
              <p className="text-sm font-bold text-primary">최신 기기 예약</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
