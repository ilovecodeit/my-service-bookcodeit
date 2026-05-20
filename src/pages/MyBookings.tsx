import { PlusCircle, Calendar, Clock, MoreVertical, ChevronRight, MapPin, Tablet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  item: string;
  user: string;
  status: 'confirmed' | 'cancelled' | 'pending' | 'completed';
  createdAt: Timestamp;
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

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

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const getDDay = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  const getKoreanStatus = (status: string) => {
    switch (status) {
      case 'confirmed': return '예약 완료';
      case 'cancelled': return '취소됨';
      case 'completed': return '이용 완료';
      case 'pending': return '대기 중';
      default: return status;
    }
  };

  return (
    <div className="py-12 flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-primary mb-2">내 예약 목록</h1>
          <p className="text-on-surface-variant text-base">전체 예약 내역을 확인하고 관리할 수 있습니다.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          <PlusCircle size={20} />
          새 예약 만들기
        </button>
      </div>

      {/* Upcoming */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          <h2 className="text-primary">다가오는 예약</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {upcomingBookings.length > 0 ? upcomingBookings.map((booking, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={booking.id}
                whileHover={{ borderColor: '#041627' }}
                className={`bg-white rounded-xl p-6 flex flex-col md:flex-row gap-6 cursor-pointer transition-colors ${
                  index === 0 
                    ? 'border-4 border-[#3962f7]' 
                    : 'border border-outline-variant'
                }`}
                onClick={() => navigate('/detail')}
              >
                <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
                  {booking.item.includes('회의실') ? <MapPin size={48} className="text-primary/20" /> : <Tablet size={48} className="text-primary/20" />}
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold">
                        {getDDay(booking.date)}
                      </span>
                      <button className="text-on-surface-variant"><MoreVertical size={18} /></button>
                    </div>
                    <h3 className="text-lg text-primary mb-2">{booking.item}</h3>
                    <div className="flex flex-col gap-1 opacity-70">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar size={14} />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock size={14} />
                        <span>{booking.startTime} - {booking.endTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs text-on-surface-variant">예약자: {booking.user}</span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-12 text-center border border-dashed border-outline-variant rounded-xl text-on-surface-variant">
                다가오는 예약이 없습니다.
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Past */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-8 bg-outline-variant rounded-full"></div>
          <h2 className="text-secondary opacity-70">지난 예약</h2>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">예약 자원</th>
                <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">일시</th>
                <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">예약자</th>
                <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider text-right">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <AnimatePresence mode="popLayout">
                {pastBookings.length > 0 ? pastBookings.map((item) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id} 
                    className="hover:bg-surface-bright transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                          {item.item.includes('회의실') ? <MapPin size={18} /> : <Tablet size={18} />}
                        </div>
                        <span className="font-semibold text-primary">{item.item}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-primary mb-0.5">{item.date}</p>
                      <p className="text-xs text-on-surface-variant">{item.startTime} - {item.endTime}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-on-surface-variant">{item.user}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${
                        item.status === 'cancelled' 
                          ? 'bg-red-50 text-red-600 ring-red-600/20' 
                          : item.status === 'completed'
                            ? 'bg-green-50 text-green-600 ring-green-600/20'
                            : 'bg-gray-50 text-gray-600 ring-gray-600/20'
                      }`}>
                        {getKoreanStatus(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => navigate('/detail')}
                        className="text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                      지난 예약 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
