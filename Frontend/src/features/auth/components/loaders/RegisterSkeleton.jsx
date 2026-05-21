import React from 'react';
import '../../style/Skeleton.scss';

const RegisterSkeleton = () => {
  return (
    <div className="skeleton-container min-h-screen flex text-[#ffffff]">
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-transparent via-[#050505]/60 to-[#050505] pointer-events-none"></div>
      
      {/* Navbar Mock */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-8">
        <div className="h-6 w-24 sk-pulse rounded-sm"></div>
        <div className="flex gap-8">
          <div className="h-6 w-6 rounded-full sk-pulse"></div>
          <div className="h-6 w-6 rounded-full sk-pulse"></div>
        </div>
      </nav>
      
      <main className="relative z-20 w-full min-h-screen flex items-center justify-end px-6 md:px-16 lg:px-24">
        <div className="w-full lg:w-[600px] xl:w-[680px] flex flex-col pt-32 pb-24">
          
          <div className="mb-14 space-y-4">
              <div className="h-16 xl:h-20 w-3/4 sk-pulse rounded-sm"></div>
              <div className="h-16 xl:h-20 w-1/2 sk-pulse rounded-sm"></div>
              <div className="w-24 h-1 sk-neon-line mt-4"></div>
          </div>
          
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                <div className="h-10 w-full sk-pulse rounded-sm border-b border-white/5"></div>
                <div className="h-10 w-full sk-pulse rounded-sm border-b border-white/5"></div>
                <div className="h-10 w-full sk-pulse rounded-sm border-b border-white/5"></div>
                <div className="h-10 w-full sk-pulse rounded-sm border-b border-white/5"></div>
            </div>
            
            <div className="pt-4">
               <div className="h-4 w-64 sk-pulse rounded-sm"></div>
            </div>
            
            <div className="pt-6 w-full md:w-2/3">
               <div className="h-14 w-full sk-pulse rounded-[2px]"></div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RegisterSkeleton;
