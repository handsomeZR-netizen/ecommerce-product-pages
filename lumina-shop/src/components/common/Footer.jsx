import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-20 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <span className="text-xl font-medium tracking-widest uppercase text-black mb-6 block">Lumina</span>
          <p className="text-gray-500 text-sm leading-7 max-w-sm">
            重新定义生活美学。我们致力于发掘全球各地具有设计感与实用性的产品，为您打造理想的生活空间。
          </p>
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-gray-900">帮助</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li className="hover:text-black cursor-pointer transition-colors">购物指南</li>
            <li className="hover:text-black cursor-pointer transition-colors">退换货政策</li>
            <li className="hover:text-black cursor-pointer transition-colors">联系客服</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-gray-900">订阅</h4>
          <div className="flex border-b border-gray-300 pb-2">
            <input 
              type="email" 
              placeholder="输入您的邮箱" 
              className="bg-transparent w-full focus:outline-none text-sm placeholder:text-gray-300" 
            />
            <button className="text-xs font-bold uppercase hover:text-gray-600">发送</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
