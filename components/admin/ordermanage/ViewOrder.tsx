import React, { useState } from 'react';
import { ArrowLeft, Bell, CircleUserRound, Printer, Download, ChevronDown, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Progress {
  label: 'Pending' | 'Processing' | 'Paid' | 'Completed';
  date: string;
  active: boolean;
}

const ViewOrder: React.FC = () => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Pending');

  const statusOptions = ['Pending', 'Processing', 'Paid', 'Completed', 'Refunded'];
  
  const progress: Progress[] = [
    { label: 'Pending', date: '28 Sep, 2025', active: true },
    { label: 'Processing', date: '02 Oct, 2025', active: true },
    { label: 'Paid', date: '03 Oct, 2025', active: true },
    { label: 'Completed', date: '03 Oct, 2025', active: false }
  ]

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/orders')}
          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-[#050F24]" />
          </button>
          <h1 className="text-xl font-semibold text-[#050F24]">View Order</h1>
        </div>

        <div className="flex items-center gap-2 ml-8">
          {/* Bell Button */}
          <button 
            onClick={() => setActiveButton(activeButton === 'bell' ? null : 'bell')}
            className={`p-1.5 rounded-full transition-all overflow-hidden ${
              activeButton === 'bell' 
                ? 'bg-[#DF2025] text-white' 
                : 'text-[#050F24] hover:bg-gray-200'
            }`}
          >
            <Bell size={24} />
          </button>

          {/* User Button */}
          <button 
            onClick={() => setActiveButton(activeButton === 'user' ? null : 'user')}
            className={`p-1.5 rounded-full transition-all overflow-hidden ${
              activeButton === 'user' 
                ? 'bg-[#DF2025] text-white' 
                : 'text-[#050F24] hover:bg-gray-200'
            }`}
          >
            <CircleUserRound size={27} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="bg-white rounded-3xl border border-[#E1E1E1] shadow-sm p-8">
        
        {/* Status Dropdown & Icons */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#050F24]">Order Details</h2>
            <div className="mt-4">
              <table className="text-sm border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="text-[#6F757E] font-normal pr-8">Order ID:</td>
                    <td className="text-[#050F24] font-normal">XX-XXXXXXX</td>
                  </tr>
                  <tr>
                    <td className="text-[#6F757E] font-normal pr-8">From:</td>
                    <td className="text-[#050F24] font-normal">DD Mon, YYYY</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Dropdown */}
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
            <button className="p-2 text-[#DF2025] hover:bg-red-50 rounded-lg"><Printer size={20} /></button>
            <button className="p-2 text-[#DF2025] hover:bg-red-50 rounded-lg"><Download size={20} /></button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mx-auto bg-[#DF2025] rounded-2xl p-12 px-[6%] mb-[-60px] w-[95%] relative z-10 flex justify-between items-start text-white overflow-hidden">
          {/* Progress Track */}
          <div className="absolute top-[49px] left-[10%] right-[10%] h-4 flex items-center">
            <div className="absolute w-full h-[2px] bg-white/20" />
            <div 
              className="absolute h-[2px] bg-white transition-all duration-500 ease-in-out" 
              style={{ 
                width: `${(progress.filter(p => p.active).length - 1) / (progress.length - 1) * 100}%` 
              }}
            />
          </div>

          {progress.map((step, idx) => (
            <div key={idx} className="relative z-20 flex flex-col items-center text-center w-24">
              <div className={`w-4 h-4 rounded-full mb-4 z-30 transition-all duration-500 ${
                step.active ? 'bg-white' : 'bg-[#e55357]' 
              }`} />
              
              <div className={`transition-opacity duration-500 ${step.active ? 'opacity-100' : 'opacity-50'}`}>
                <p className="font-semibold text-base whitespace-nowrap">{step.label}</p>
                {/* Papakita lang yung date pag :active */}
                {step.active && (
                  <p className="text-[12px] mt-1 opacity-80">{step.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 pt-20 pb-3">
        
          {/* Billing Info */}
          <h3 className="text-lg font-semibold text-[#050F24] mb-4">Billing Information</h3>
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative mb-8">
            <button className="absolute top-6 right-6 text-[#CCCDCD]"><Info size={18} /></button>
            <div className="space-y-3">
              <p className="text-lg font-semibold text-[#050F24]">Jennie Rubyjane Katigbak</p>
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="text-[#6F757E] w-40 font-normal align-top">Email Address :</td>
                    <td className="text-[#050F24] font-normal pl-1">jennierubyjane@gmail.com</td>
                  </tr>
                  <tr>
                    <td className="text-[#6F757E] font-normal align-top">Contact Number :</td>
                    <td className="text-[#050F24] font-normal pl-1">09127296749</td>
                  </tr>
                  <tr>
                    <td className="text-[#6F757E] font-normal align-top">Delivery Address :</td>
                    <td className="text-[#050F24] font-normal pl-1 leading-relaxed">1235 Juan Luna Street, Barangay 129, Tondo, Manila, 1012, Philippines</td>
                  </tr>
                  <tr>
                    <td className="text-[#6F757E] font-normal align-top">Delivery Preference :</td>
                    <td className="text-[#050F24] font-normal pl-1">Delivery</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Items Table */}
          <h3 className="text-lg font-semibold text-[#050F24] mb-4">Order Items Table</h3>
          <div className="mb-8 border border-gray-200 rounded-3xl pb-5 pt-5 pl-0 pr-0 shadow-sm bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#050F24] font-semibold border-b border-gray-100">
                  <th className="pb-4 pl-8 font-semibold text-left w-[30%]">Product</th>
                  <th className="pb-4 px-4 font-semibold text-center w-[25%]">ID No.</th>
                  <th className="pb-4 px-4 font-semibold text-center w-[35%]">Quantity</th>
                  <th className="pb-4 pr-8 font-semibold text-center w-[10%]">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 pb-2">
                {[1, 2, 3].map((item) => (
                  <tr key={item}>
                    <td className="pl-8 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0" />
                      <div>
                        <p className="font-normal text-[#050F24]">Product Name</p>
                        <p className="text-xs font-normal text-[#6F757E]">Product Type</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-normal text-center text-[#6F757E]">EL-00552</td>
                    <td className="px-4 py-4 font-normal text-center text-[#6F757E]">1500</td>
                    <td className="pr-8 py-4 font-normal text-center text-[#6F757E]">₱130</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Payment Preference */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-[#050F24] mb-4">Payment Preference</h3>
              <div className="bg-white p-6 border border-gray-200 rounded-3xl shadow-sm relative flex-grow">
                <button className="absolute top-6 right-6 text-[#CCCDCD]"><Info size={18} /></button>
                <div className="space-y-1">
                  <p className="text-[20px] text-[#050F24] font-medium">Master Card</p>
                  <p className="text-[15px] text-[#6F757E] font-normal">Master 1234 **** 58745</p>
                  <p className="text-[10px] text-[#6F757E] font-normal">Expire 12/23</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="font-medium text-[15px]">Jennie Katigbak</p>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#EB001B]" />
                      <div className="w-6 h-6 rounded-full bg-[#F79E1B] opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-[#050F24] mb-4">Order Summary</h3>
              <div className="bg-white p-6 border border-gray-200 rounded-3xl shadow-sm flex-grow">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-[#6F757E]">
                    <span>Product Price :</span>
                    <span className="text-[#6F757E] font-normal">₱3050</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6F757E]">
                    <span>Delivery Fee :</span>
                    <span className="text-[#6F757E] font-normal">₱200</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-50">
                    <span className="font-medium text-[20px] text-[#050F24]">Total :</span>
                    <span className="font-medium text-[20px] text-[#050F24]">₱3250</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          {/* Cancel Button */}
            <div className="flex justify-end pt-8">
              <button onClick={() => router.push('/orders')} className="flex items-center justify-center gap-3 bg-[#DF2025] w-45 h-11 text-white px-6 py-3 rounded-full font-normal hover:bg-[#b3191d] transition-colors">
                Cancel Order
              </button>
            </div>
      </div>
    </div>
  );
};

export default ViewOrder;