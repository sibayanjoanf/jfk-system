'use client';

import React, { useState } from 'react';
import { Pencil, Plus, Trash2, ChevronDown, ChevronUp, Building2, Megaphone, Images, HelpCircle, BellRing } from 'lucide-react';
import HeaderNotifications from '@/components/admin/HeaderNotif';
import HeaderUser from '@/components/admin/HeaderUser';

interface Branch {
  id: string;
  name: string;
  phone: string;
  telephone: string;
}

interface Announcement {
  id: string;
  text: string;
  active: boolean;
}

interface ShowcaseImage {
  id: string;
  image: string;
  product: string;
  category: string;
}

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  open: boolean;
}

const SystemSetting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'company' | 'storefront'>('notifications');
  const [activeStorefrontTab, setActiveStorefrontTab] = useState<'announcements' | 'showcase' | 'faq'>('announcements');

  // Notification settings
  const [settings, setSettings] = useState({
    inquiriesPush: true, inquiriesEmail: false,
    reportPush: true, reportEmail: false,
    remindersPush: true, remindersEmail: false,
  });
  const toggleSetting = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  // Company info
  const [companyForm, setCompanyForm] = useState({ name: 'JFK Tile and Stone Builders', address: '', contact: '', email: '' });

  // Branches
  const [branches, setBranches] = useState<Branch[]>([
    { id: '1', name: 'Bulangon Branch', phone: '09602887539', telephone: '6775351' },
    { id: '2', name: 'Barit Branch', phone: '09650321774', telephone: '6775351' },
    { id: '3', name: 'Rizal Branch', phone: '09951916946', telephone: '6775351' },
  ]);
  const [newBranch, setNewBranch] = useState({ name: '', phone: '', telephone: '' });
  const [showAddBranch, setShowAddBranch] = useState(false);

  const addBranch = () => {
    if (!newBranch.name) return;
    setBranches(prev => [...prev, { id: Date.now().toString(), ...newBranch }]);
    setNewBranch({ name: '', phone: '', telephone: '' });
    setShowAddBranch(false);
  };
  const deleteBranch = (id: string) => setBranches(prev => prev.filter(b => b.id !== id));

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: '1', text: 'Special Offer: Get 10% off on all Floor Tiles this month!', active: false },
    { id: '2', text: 'Free delivery for orders over ₱50,000', active: true },
    { id: '3', text: 'Visit our showrooms in Barit, Bulangon, and Rizal', active: true },
    { id: '4', text: 'Quality Tile and Stone Builders since 2009', active: true },
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const addAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setAnnouncements(prev => [...prev, { id: Date.now().toString(), text: newAnnouncement, active: true }]);
    setNewAnnouncement('');
  };
  const deleteAnnouncement = (id: string) => setAnnouncements(prev => prev.filter(a => a.id !== id));
  const toggleAnnouncement = (id: string) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));

  // Showcase
  const [showcaseImages, setShowcaseImages] = useState<ShowcaseImage[]>([
    { id: '1', image: '', product: 'GBY66038 40', category: 'Glossy Porcelain' },
    { id: '2', image: '', product: 'GBY66018', category: 'Glossy Porcelain' },
    { id: '3', image: '', product: 'BMD65008', category: 'Glossy Porcelain' },
    { id: '4', image: '', product: 'One Piece Watercloset', category: 'Bathroom Fixtures' },
    { id: '5', image: '', product: 'KARAGIN 6658', category: 'Glazed Porcelain' },
  ]);
  const [newShowcase, setNewShowcase] = useState({ image: '', product: '', category: '' });
  const [showAddShowcase, setShowAddShowcase] = useState(false);

  const addShowcase = () => {
    if (!newShowcase.product) return;
    setShowcaseImages(prev => [...prev, { id: Date.now().toString(), ...newShowcase }]);
    setNewShowcase({ image: '', product: '', category: '' });
    setShowAddShowcase(false);
  };
  const deleteShowcase = (id: string) => setShowcaseImages(prev => prev.filter(s => s.id !== id));

  // FAQ
  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: '1', 
      category: 'Delivery & Pickup', 
      question: 'What should I do if my tiles or fixture arrive damaged?', 
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat adipiscing elit.', 
      open: true 
    },
    { id: '2', 
      category: 'Orders & Inquiries', 
      question: 'How long does it take to process my inquiry?', 
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat adipiscing elit.', 
      open: false 
    },
    { id: '3', 
      category: 'Payment', 
      question: 'Do you offer "Contractor Pricing" or "Bulk Order" discounts?', 
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat adipiscing elit.', 
      open: false 
    },
    { id: '4', 
      category: 'Products & Pricing', 
      question: 'Can I request a sample before committing to a full order?', 
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat adipiscing elit.', 
      open: false 
    },
    { id: '5', 
      category: 'Returns & Exchanges', 
      question: 'Can I return "Leftover" individual tiles from my project?', 
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat adipiscing elit.', 
      open: false 
    },
    { id: '6', 
      category: 'Technical Support', 
      question: 'Can I install new tile directly over my existing flooring?', 
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat adipiscing elit.', 
      open: false 
    },
  ]);
  const [newFaq, setNewFaq] = useState({ category: '', question: '', answer: '' });
  const [showAddFaq, setShowAddFaq] = useState(false);

  const addFaq = () => {
    if (!newFaq.question) return;
    setFaqs(prev => [...prev, { id: Date.now().toString(), ...newFaq, open: false }]);
    setNewFaq({ category: '', question: '', answer: '' });
    setShowAddFaq(false);
  };
  const deleteFaq = (id: string) => setFaqs(prev => prev.filter(f => f.id !== id));
  const toggleFaq = (id: string) => setFaqs(prev => prev.map(f => f.id === id ? { ...f, open: !f.open } : f));

  const tabs = [
    { key: 'notifications', label: 'Notifications', icon: BellRing },
    { key: 'company', label: 'Company', icon: Building2 },
    { key: 'storefront', label: 'Storefront', icon: Megaphone },
  ] as const;

  const storefrontTabs = [
    { key: 'announcements', label: 'Announcements', icon: Megaphone },
    { key: 'showcase', label: 'Showcase', icon: Images },
    { key: 'faq', label: 'FAQ', icon: HelpCircle },
  ] as const;

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="shrink-0">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Admin</p>
          <h1 className="text-lg font-semibold text-gray-900">System Settings</h1>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        {/* Sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium transition-all border-b border-gray-50 last:border-0 ${
                  isActive ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} />
                  {tab.label}
                </div>
                <ChevronDown size={14} className={`text-gray-300 transition-transform ${isActive ? '-rotate-90' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Notification Settings</h2>
              <p className="text-xs text-gray-400 mb-8 leading-relaxed">
                Important updates about orders or account may still be sent to you, even with notifications disabled.
              </p>
              <div className="space-y-8">
                <NotificationRow
                  title="Inquiries"
                  desc="Notifications for customer inquiries submitted through your website."
                  push={settings.inquiriesPush} email={settings.inquiriesEmail}
                  onTogglePush={() => toggleSetting('inquiriesPush')}
                  onToggleEmail={() => toggleSetting('inquiriesEmail')}
                />
                <NotificationRow
                  title="Reports"
                  desc="Notifications for when new inventory reports are generated or stock updates are available."
                  push={settings.reportPush} email={settings.reportEmail}
                  onTogglePush={() => toggleSetting('reportPush')}
                  onToggleEmail={() => toggleSetting('reportEmail')}
                />
                <NotificationRow
                  title="Reminders"
                  desc="Notifications about pending orders and recent activity in your system."
                  push={settings.remindersPush} email={settings.remindersEmail}
                  onTogglePush={() => toggleSetting('remindersPush')}
                  onToggleEmail={() => toggleSetting('remindersEmail')}
                />
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">

              {/* Logo + Name */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-1">Brand</h2>
                <p className="text-xs text-gray-400 mb-6">Update your company logo and display name.</p>
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                      <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute -top-1 -left-1 bg-gray-900 text-white p-1.5 rounded-full border-2 border-white hover:bg-red-600 transition-colors">
                      <Pencil size={10} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Company Name</label>
                    <input
                      type="text"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-1">Basic Information</h2>
                <p className="text-xs text-gray-400 mb-6">Contact details shown to customers.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Address', key: 'address', placeholder: 'Business address' },
                    { label: 'Contact Number', key: 'contact', placeholder: 'Mobile number' },
                    { label: 'Email Address', key: 'email', placeholder: 'Business email' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={companyForm[key as keyof typeof companyForm]}
                        onChange={(e) => setCompanyForm({ ...companyForm, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                  <button className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Branches */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Branches</h2>
                    <p className="text-xs text-gray-400 mt-1">Manage your physical store locations.</p>
                  </div>
                  <button
                    onClick={() => setShowAddBranch(!showAddBranch)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Plus size={13} />
                    Add Branch
                  </button>
                </div>

                {showAddBranch && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <p className="text-xs font-semibold text-gray-700">New Branch</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { placeholder: 'Branch name', key: 'name' },
                        { placeholder: 'Phone number', key: 'phone' },
                        { placeholder: 'Telephone', key: 'telephone' },
                      ].map(({ placeholder, key }) => (
                        <input
                          key={key}
                          type="text"
                          placeholder={placeholder}
                          value={newBranch[key as keyof typeof newBranch]}
                          onChange={(e) => setNewBranch({ ...newBranch, [key]: e.target.value })}
                          className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShowAddBranch(false)} className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                      <button onClick={addBranch} className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Add</button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {branches.map((branch) => (
                    <div key={branch.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{branch.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{branch.phone} · {branch.telephone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deleteBranch(branch.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Storefront Tab */}
          {activeTab === 'storefront' && (
            <div className="space-y-6">

              {/* Storefront sub-tabs */}
              <div className="flex gap-2 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5">
                {storefrontTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveStorefrontTab(tab.key)}
                      className={`flex items-center gap-2 flex-1 justify-center px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                        activeStorefrontTab === tab.key ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={13} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Announcements */}
              {activeStorefrontTab === 'announcements' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Text Announcements</h2>
                      <p className="text-xs text-gray-400 mt-1">Banners shown to customers on your storefront.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={newAnnouncement}
                      onChange={(e) => setNewAnnouncement(e.target.value)}
                      placeholder="Enter announcement text..."
                      className="flex-1 px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && addAnnouncement()}
                    />
                    <button onClick={addAnnouncement} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      <Plus size={14} />
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <Toggle label="" enabled={ann.active} onClick={() => toggleAnnouncement(ann.id)} />
                          <p className={`text-sm ${ann.active ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{ann.text}</p>
                        </div>
                        <button onClick={() => deleteAnnouncement(ann.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 shrink-0">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Showcase */}
              {activeStorefrontTab === 'showcase' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Showcase Images</h2>
                      <p className="text-xs text-gray-400 mt-1">Featured products displayed on your homepage.</p>
                    </div>
                    <button
                      onClick={() => setShowAddShowcase(!showAddShowcase)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Plus size={13} />
                      Add Image
                    </button>
                  </div>

                  {showAddShowcase && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                      <p className="text-xs font-semibold text-gray-700">New Showcase Item</p>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-colors">
                        <Images size={20} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Click to upload image</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Product name"
                          value={newShowcase.product}
                          onChange={(e) => setNewShowcase({ ...newShowcase, product: e.target.value })}
                          className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                        />
                        <select
                          value={newShowcase.category}
                          onChange={(e) => setNewShowcase({ ...newShowcase, category: e.target.value })}
                          className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-gray-600"
                        >
                          <option value="">Select category</option>
                          <option>Tiles</option>
                          <option>Stones</option>
                          <option>Fixtures</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAddShowcase(false)} className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                        <button onClick={addShowcase} className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Add</button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {showcaseImages.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                          {item.image ? <img src={item.image} alt={item.product} className="w-full h-full object-cover" /> : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Images size={16} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.product}</p>
                          <p className="text-xs text-gray-400">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => deleteShowcase(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {activeStorefrontTab === 'faq' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Frequently Asked Questions</h2>
                      <p className="text-xs text-gray-400 mt-1">Manage FAQ items shown on your website.</p>
                    </div>
                    <button
                      onClick={() => setShowAddFaq(!showAddFaq)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Plus size={13} />
                      Add FAQ
                    </button>
                  </div>

                  {showAddFaq && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                      <p className="text-xs font-semibold text-gray-700">New FAQ</p>
                      <input
                        type="text"
                        placeholder="Category (e.g. Orders, Delivery)"
                        value={newFaq.category}
                        onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Question"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                      />
                      <textarea
                        placeholder="Answer"
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                        rows={3}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAddFaq(false)} className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                        <button onClick={addFaq} className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Add</button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="rounded-xl border border-gray-100 overflow-hidden">
                        <div
                          className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {faq.category && (
                              <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded-full font-medium shrink-0">{faq.category}</span>
                            )}
                            <p className="text-sm font-medium text-gray-900 truncate">{faq.question}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteFaq(faq.id); }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                            {faq.open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                          </div>
                        </div>
                        {faq.open && (
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                            <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NotificationRowProps {
  title: string; desc: string;
  push: boolean; email: boolean;
  onTogglePush: () => void; onToggleEmail: () => void;
}

const NotificationRow = ({ title, desc, push, email, onTogglePush, onToggleEmail }: NotificationRowProps) => (
  <div className="flex justify-between items-start gap-4 pb-8 border-b border-gray-50 last:border-0 last:pb-0">
    <div className="max-w-sm">
      <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </div>
    <div className="flex flex-col gap-3 shrink-0">
      <Toggle label="Push" enabled={push} onClick={onTogglePush} />
      <Toggle label="Email" enabled={email} onClick={onToggleEmail} />
    </div>
  </div>
);

const Toggle = ({ label, enabled, onClick }: { label: string; enabled: boolean; onClick: () => void }) => (
  <div className="flex items-center gap-3 cursor-pointer group" onClick={onClick}>
    <div className={`w-9 h-5 flex items-center rounded-full px-0.5 transition-colors duration-200 ${enabled ? 'bg-red-600' : 'bg-gray-200'}`}>
      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
    {label && <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors font-medium">{label}</span>}
  </div>
);

export default SystemSetting;