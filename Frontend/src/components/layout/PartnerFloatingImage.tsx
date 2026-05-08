import React from 'react';

const PartnerFloatingImage = () => {
    return (
        <div className="fixed right-3 sm:right-6 top-32 sm:top-44 z-40 group">
            <div className="relative p-1 rounded-[24px] sm:rounded-[32px] bg-black/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-700 hover:scale-105 hover:bg-white/10 hover:border-primary/20 group">
                <div className="relative w-auto h-32 sm:h-48 md:h-64 overflow-hidden rounded-[18px] sm:rounded-[24px]">
                    <img
                        src="/partner.png"
                        alt="Partner"
                        className="w-full h-full object-contain p-2 sm:p-3 drop-shadow-2xl"
                    />
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-1 -right-1 w-2 sm:w-4 h-2 sm:h-4 bg-primary rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -top-1 -left-1 w-1.5 sm:w-3 h-1.5 sm:h-3 bg-secondary rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>
        </div>
    );
};

export default PartnerFloatingImage;
