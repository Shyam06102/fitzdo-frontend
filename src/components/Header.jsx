import { GlobeAltIcon } from "@heroicons/react/24/solid";

export default function Header() {
  return (
    <header className="py-2 px-4 border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex flex-col leading-tight">
          <span className="text-2xl font-black tracking-tight">
            FITZDO
          </span>
          <span className="text-xs font-medium text-center text-gray-700">
            &amp; BUSINESS
          </span>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <img
              src="https://flagcdn.com/w20/in.png"
              alt="India"
              className="w-5 h-3 rounded-sm"
            />
            <span>IN</span>
          </div>
          <div className="flex items-center space-x-2">
            <GlobeAltIcon className="h-4 w-4 text-gray-600" />
            <span>EN</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Fitzdo is Secure</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}