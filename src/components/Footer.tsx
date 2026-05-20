export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant py-12">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs uppercase tracking-widest text-on-surface-variant opacity-70">
          © 2024 Bookcodeit. Internal Resource Management.
        </div>
        <div className="flex gap-8 text-xs uppercase tracking-widest text-on-surface-variant">
          <a href="#" className="font-semibold text-primary hover:underline">
            피드백 남기기
          </a>
          <a href="#" className="hover:underline">
            이용 약관
          </a>
          <a href="#" className="hover:underline">
            개인정보 처리방침
          </a>
        </div>
      </div>
    </footer>
  );
}
