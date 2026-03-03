import React, { useState } from 'react';
import { ArrowLeft, Bell, CircleUserRound, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ViewInquiry: React.FC = () => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('New');

  const statusOptions = ['New', 'In Progress', 'Resolved'];

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/inquiries')}
            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-[#050F24]" />
          </button>
          <h1 className="text-xl font-semibold text-[#050F24]">View Inquiry</h1>
        </div>

        <div className="flex items-center gap-2 ml-8">
          <button 
            onClick={() => setActiveButton(activeButton === 'bell' ? null : 'bell')}
            className={`p-1.5 rounded-full transition-all ${
              activeButton === 'bell' ? 'bg-[#DF2025] text-white' : 'text-[#050F24] hover:bg-gray-200'
            }`}
          >
            <Bell size={24} />
          </button>
          <button 
            onClick={() => setActiveButton(activeButton === 'user' ? null : 'user')}
            className={`p-1.5 rounded-full transition-all ${
              activeButton === 'user' ? 'bg-[#DF2025] text-white' : 'text-[#050F24] hover:bg-gray-200'
            }`}
          >
            <CircleUserRound size={27} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-[#E1E1E1] shadow-sm p-8">
        
        {/* Message Details Section */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#050F24] mb-6">Message Details</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-w-2xl">
              <div className="flex gap-4">
                <span className="text-[#6F757E] font-normal w-20">Name:</span>
                <span className="text-[#050F24] font-normal">Jennie Rubyjane Katigbak</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#6F757E] w-20">Date:</span>
                <span className="text-[#050F24]">10 October, 2025</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#6F757E] w-20">Email:</span>
                <span className="text-[#050F24]">jennierubyjane@gmail.com</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#6F757E] w-20">Time:</span>
                <span className="text-[#050F24]">15:22</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#6F757E] w-20">Contact:</span>
                <span className="text-[#050F24]">09127296749</span>
              </div>
            </div>
          </div>

          {/* Status Picker */}
          <div className="relative">
              <button 
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className={`flex items-center justify-between w-45 px-6 py-2 border-2 border-[#DF2025] rounded-full font-normal hover:bg-[#DF2025] hover:text-white transition-colors overflow-hidden 
                  ${
                  isStatusOpen 
                    ? 'bg-[#DF2025] text-white' 
                    : 'text-[#DF2025]'
                }`}
              >
                {currentStatus}
                <div className="flex flex-col scale-75">
                  <ChevronDown size={24} className={isStatusOpen ? 'rotate-180' : ''} />
                </div>
              </button>

              {isStatusOpen && (
                <div className="absolute right-0 mt-2 w-45 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {statusOptions.map((status) => (
                    <button 
                      key={status}
                      className={`w-full text-left px-6 py-3 text-sm hover:bg-gray-50 text-[#6F757E] hover:text-[#DF2025]`}
                      onClick={() => { setCurrentStatus(status); setIsStatusOpen(false); }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
            )}
          </div>
        </div>

        {/* Message Content Section */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-[#050F24] mb-4">Message Content</h3>
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h4 className="text-lg font-medium text-[#050F24] mb-6">Lorem Ipsum</h4>
            <div className="text-[#050F24] leading-relaxed space-y-4">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
              </ul>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </div>
        </div>

        {/* Response Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#050F24] mb-4">Response Section</h3>
          <div className="relative">
            <textarea 
              placeholder="Type response here...."
              className="w-full h-64 bg-[#F5F5F5] border border-gray-200 rounded-3xl p-6 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none transition-all"
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={() => router.push('/inquiries')}
            className="px-8 py-2.5 rounded-full bg-[#DF2025] text-white hover:bg-[#b3191d] transition-colors"
          >
          Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInquiry;