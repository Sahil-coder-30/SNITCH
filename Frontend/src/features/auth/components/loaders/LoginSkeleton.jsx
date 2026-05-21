import React from 'react';
import '../../style/Skeleton.scss';

const LoginSkeleton = () => {
  return (
    <div className="skeleton-container h-screen flex">
      {/* Background Gradient Mock */}
      <div className="fixed inset-y-0 right-0 w-full lg:w-3/4 bg-gradient-to-l from-[#040404] via-[#040404]/80 to-transparent z-10 pointer-events-none"></div>
      
      {/* Navbar Mock */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-8">
        <div className="h-6 w-24 sk-pulse rounded-sm"></div>
        <div className="flex gap-8">
          <div className="h-6 w-6 rounded-full sk-pulse"></div>
          <div className="h-6 w-6 rounded-full sk-pulse"></div>
        </div>
      </nav>

      {/* Main Grid */}
      <main className="relative w-full h-screen flex items-center justify-center px-6 overflow-hidden z-20">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16 mx-auto relative pt-0">
          
          {/* Left Side typography mock */}
          <section className="hidden lg:flex lg:col-span-6 flex-col justify-center p-8 lg:p-0 h-auto relative">
            <div className="space-y-8 pl-0 xl:pl-4">
              <div className="h-2 w-12 sk-neon-line rounded-sm"></div>
              
              <div className="space-y-4">
                  <div className="h-16 xl:h-20 w-3/4 sk-pulse rounded-sm"></div>
                  <div className="h-16 xl:h-20 w-1/2 sk-pulse rounded-sm"></div>
              </div>
              
              <div className="space-y-2 mt-4 inline-block w-full max-w-sm">
                  <div className="h-3 w-full sk-pulse rounded-sm"></div>
                  <div className="h-3 w-4/5 sk-pulse rounded-sm"></div>
                  <div className="h-3 w-2/3 sk-pulse rounded-sm"></div>
              </div>

              <div className="flex gap-16 pt-12">
                 <div className="h-8 w-16 sk-pulse rounded-sm"></div>
                 <div className="h-8 w-16 sk-pulse rounded-sm"></div>
              </div>
            </div>
          </section>

          {/* Right Side form mock */}
          <section className="lg:col-span-6 p-8 md:p-14 h-auto flex flex-col justify-center relative">
            <div className="w-full space-y-10 relative z-10 max-w-md mx-auto lg:mr-0 pl-0 lg:pl-12 xl:pl-20">
              
              <header className="mb-6 border-b border-white/5 pb-8">
                <div className="h-1 w-10 sk-neon-line mb-4 rounded-sm"></div>
                <div className="h-10 w-1/3 sk-pulse rounded-sm"></div>
              </header>

              <div className="space-y-10">
                <div className="h-12 w-full sk-pulse rounded-sm border-b border-white/5"></div>
                <div className="h-12 w-full sk-pulse rounded-sm border-b border-white/5"></div>

                <div className="flex items-center justify-between pt-2">
                  <div className="h-4 w-24 sk-pulse rounded-sm"></div>
                  <div className="h-4 w-24 sk-pulse rounded-sm"></div>
                </div>

                <div className="pt-6">
                  <div className="h-16 w-full sk-pulse rounded-[2px]"></div>
                </div>
              </div>

              <div className="py-6 flex justify-center">
                <div className="h-5 w-32 sk-pulse rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="h-12 w-full sk-pulse rounded-[2px]"></div>
                <div className="h-12 w-full sk-pulse rounded-[2px]"></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginSkeleton;
