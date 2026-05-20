import { Heart, Users, Tv, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function ResourceDetail() {
  const timeSlots = [
    { time: '09:00 - 10:00', status: 'available' },
    { time: '10:00 - 11:00', status: 'booked' },
    { time: '11:00 - 12:00', status: 'selected' },
    { time: '12:00 - 13:00', status: 'available' },
    { time: '13:00 - 14:00', status: 'available' },
    { time: '14:00 - 15:00', status: 'available' },
    { time: '15:00 - 16:00', status: 'available' },
    { time: '16:00 - 17:00', status: 'available' },
  ];

  const recommendations = [
    { name: '대회의실 B', floor: '3층', capacity: '최대 10명', image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=400' },
    { name: '미팅룸 401', floor: '4층', capacity: '최대 8명', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400' },
    { name: '대강당', floor: '2층', capacity: '최대 50명', image: 'https://images.unsplash.com/photo-1505373633519-2f22b7405206?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="py-12 flex flex-col gap-16">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 aspect-[16/9] rounded-xl overflow-hidden border border-outline-variant shadow-sm"
        >
          <img 
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1000" 
            alt="Meeting Room" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 flex flex-col justify-center"
        >
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold mb-4">3층</span>
            <h1 className="text-primary-container mb-2">대회의실 A</h1>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <div className="flex items-center gap-1 text-sm">
                <Users size={16} />
                <span>최대 12명 수용</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Tv size={16} />
                <span>대형 디스플레이 완비</span>
              </div>
            </div>
          </div>
          
          <p className="text-on-surface-variant text-base mb-8 leading-relaxed">
            임원 회의 및 대규모 프로젝트 킥오프를 위한 최적의 공간입니다. 고화질 화상 회의 시스템과 전자 화이트보드가 설치되어 있어 효율적인 협업이 가능합니다.
          </p>
          
          <div className="flex gap-4">
            <button className="flex-1 bg-primary text-white py-4 px-8 rounded-lg font-bold hover:opacity-90 transition-opacity active:scale-[0.98]">
              이 시간으로 예약하기
            </button>
            <button className="flex items-center justify-center border border-outline-variant px-6 py-4 rounded-lg hover:bg-surface-container transition-colors active:scale-[0.98]">
              <Heart size={20} className="mr-2" />
              <span className="font-semibold">찜하기</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Date & Time Selection */}
      <section>
        <div className="mb-8">
          <h2 className="text-primary-container">예약 일정 선택</h2>
          <p className="text-on-surface-variant text-sm mt-1">원하시는 날짜와 시간을 선택해 주세요.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Mockup */}
          <div className="bg-white p-6 border border-outline-variant rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg">2024년 5월</h3>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-surface-container rounded"><ChevronLeft size={20} /></button>
                <button className="p-1 hover:bg-surface-container rounded"><ChevronRight size={20} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-on-surface-variant mb-4">
              <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(31)].map((_, i) => (
                <button 
                  key={i} 
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    i + 1 === 6 ? 'bg-primary text-white' : 'hover:bg-surface-container'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          
          {/* Time Slots */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeSlots.map((slot, idx) => (
                <button
                  key={idx}
                  disabled={slot.status === 'booked'}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    slot.status === 'selected' 
                      ? 'border-2 border-primary bg-primary/10' 
                      : slot.status === 'booked'
                        ? 'opacity-40 bg-surface-container cursor-not-allowed border-outline-variant'
                        : 'border-outline-variant hover:border-primary bg-white'
                  }`}
                >
                  <span className="block text-sm font-bold">{slot.time}</span>
                  <span className={`text-[10px] font-bold mt-1 block uppercase ${
                    slot.status === 'selected' ? 'text-primary' : 'text-on-surface-variant'
                  }`}>
                    {slot.status === 'selected' ? '선택됨' : slot.status === 'booked' ? '예약 완료' : '예약 가능'}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center p-4 bg-surface-container-low rounded-lg text-on-surface-variant text-sm border border-outline-variant/30">
              <Info size={16} className="mr-2 shrink-0" />
              <span>선택하신 시간은 5월 6일 11:00 - 12:00 (1시간) 입니다.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-primary-container">비슷한 회의실 추천</h2>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant rounded-full hover:bg-white"><ChevronLeft size={20} /></button>
            <button className="p-2 border border-outline-variant rounded-full hover:bg-white"><ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="h-48 overflow-hidden">
                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg text-primary">{rec.name}</h3>
                  <span className="text-xs font-semibold text-on-surface-variant opacity-70">{rec.floor}</span>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant text-sm">
                  <Users size={14} />
                  <span>{rec.capacity}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
