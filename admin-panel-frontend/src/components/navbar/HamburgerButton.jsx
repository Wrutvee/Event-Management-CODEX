export default function HamburgerButton({ isOpen, onClick }) {
  return (
    <button
      className="md:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      onClick={onClick}
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center relative">
        <span 
          className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out
            ${isOpen ? 'absolute rotate-45' : '-translate-y-1'}`}
        />
        <span 
          className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out
            ${isOpen ? 'opacity-0' : ''}`}
        />
        <span 
          className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out
            ${isOpen ? 'absolute -rotate-45' : 'translate-y-1'}`}
        />
      </div>
    </button>
  );
}