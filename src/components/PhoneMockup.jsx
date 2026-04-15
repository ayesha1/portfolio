export default function PhoneMockup({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* iPhone frame */}
      <div className="relative rounded-[40px] border-[6px] border-gray-900 bg-gray-900 shadow-xl overflow-hidden"
        style={{ width: 280, height: 580 }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-gray-900 rounded-b-2xl z-20" />

        {/* Screen content */}
        <div className="w-full h-full rounded-[34px] overflow-hidden bg-[#f7f9ff]">
          {children}
        </div>

      </div>
    </div>
  )
}
