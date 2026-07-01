// Main Application Logic for Amareshwar College Website

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';

document.addEventListener('DOMContentLoaded', () => {
    // Add favicon dynamically
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'Images/Home/amreshwarlogo-200x216.png';
    document.head.appendChild(link);

    // Clean the URL in the address bar (remove .html) on production
    if (!isLocal && window.location.pathname.endsWith('.html')) {
        const cleanPath = window.location.pathname.slice(0, -5);
        window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
    }

    const pageId = document.body.dataset.page || 'home';
    const content = window.websiteContent;

    if (!content) {
        console.error("Website content not loaded! Make sure content.js is included first.");
        return;
    }

    // 1. Set page title
    const pageData = content.pages[pageId];
    if (pageData && pageData.title) {
        document.title = `${pageData.title} | ${content.siteName}`;
    } else {
        document.title = content.siteName;
    }

    // 2. Render Header
    renderHeader(content, pageId);

    // 3. Render Footer
    renderFooter(content);

    // 4. Render Main Content
    renderMainContent(content, pageId);

    // 5. Initialize Interactive Elements
    initTicker();
    initMobileMenu();
    initHeroCarousel();
    initLightbox();
    initNotificationTicker();
});

// Helper to clean .html extension from links for clean URLs on deployment
function cleanUrl(href) {
    if (!href) return '#';
    const h = href.trim();
    if (isLocal) {
        return h;
    }
    if (h.toLowerCase().endsWith('.html')) {
        return h.slice(0, -5);
    }
    return h;
}

// Utility to detect document or external links and open in new tab
function getLinkTarget(href) {
    if (!href) return '';
    const h = href.toLowerCase().trim();
    if (h === '#' || h === '') return '';
    if (h.startsWith('mailto:') || h.startsWith('tel:')) return '';
    if (h.startsWith('http://') || h.startsWith('https://') || h.startsWith('docs/') || h.endsWith('.pdf') || h.endsWith('.xls') || h.endsWith('.xlsx') || h.endsWith('.doc') || h.endsWith('.docx')) {
        return 'target="_blank" rel="noopener noreferrer"';
    }
    return '';
}

// ============================================================
// HEADER - Exact replica of amareshwarcollege.in
// ============================================================
function renderHeader(content, pageId) {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    const phone = content.quickContact.phone;
    const email = content.quickContact.email;

    // News ticker items for the top bar
    const newsTickerItems = content.tickerNews.map(item => `
        <span class="news-ticker-item">${item}</span>
    `).join('');

    // Generate menu HTML
    const navMenuHTML = generateNavMenuHTML(content.navMenu, pageId);

    headerContainer.innerHTML = `
        <!-- TOP BAR: Dark navy with phone, email, NEWS ticker -->
        <div class="top-bar-dark">
            <div class="max-w-[1200px] mx-auto px-4 flex items-center h-[40px]">
                <!-- Left: Contact Info -->
                <div class="flex items-center space-x-4 shrink-0">
                    <a href="tel:${phone}" class="flex items-center text-gray-300 hover:text-white text-[13px]">
                        <svg class="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        ${phone}
                    </a>
                    <a href="mailto:${email}" class="flex items-center text-gray-300 hover:text-white text-[13px]">
                        <svg class="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        ${email}
                    </a>
                </div>

                <!-- Right: NEWS ticker -->
                <div class="flex items-center ml-4 flex-grow overflow-hidden">
                    <span class="bg-[#d30404] text-white text-[11px] font-bold px-3 py-[3px] uppercase tracking-wider shrink-0 mr-3">NEWS</span>
                    <div class="news-ticker-wrap flex-grow overflow-hidden">
                        <div class="news-ticker-content" id="news-ticker-content">
                            ${newsTickerItems} ${newsTickerItems}
                        </div>
                    </div>
                    <div class="flex items-center shrink-0 ml-2 space-x-1">
                        <button onclick="scrollNewsTicker(-1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white border border-gray-600 rounded-sm transition-colors">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button onclick="scrollNewsTicker(1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white border border-gray-600 rounded-sm transition-colors">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- HEADER BRANDING: White bg, logo left, centered college name -->
        <header class="bg-white shadow-sm relative z-50">
            <div class="max-w-[1200px] mx-auto px-4 py-4 flex items-center">
                <!-- Logo -->
                <a href="${cleanUrl('index.html')}" class="shrink-0 mr-4">
                    ${content.logo ? `
                        <img src="Images/Home/amreshwarlogo-200x216.png" alt="${content.siteName} Logo" class="w-[70px] h-[75px] object-contain select-none">
                    ` : `
                        <div class="w-[70px] h-[75px] bg-gray-200 border border-gray-300 rounded-full flex items-center justify-center shrink-0 shadow-sm text-[#3a4c6c] font-bold text-sm select-none">
                            LOGO
                        </div>
                    `}
                </a>
                
                <!-- College Name - Centered -->
                <div class="flex-grow text-center">
                    <p class="text-[#d30404] text-[15px] italic font-medium font-serif-brand leading-tight">RRK Samithi's</p>
                    <h1 class="text-[#1a1a4e] text-[22px] md:text-[26px] font-bold uppercase font-serif-brand leading-tight tracking-wide">
                        AMARESHWAR ARTS AND COMMERCE DEGREE COLLEGE, AURAD-B
                    </h1>
                    <p class="text-[#333] text-[13px] font-medium italic mt-0.5">Affiliated By Gulbarga University Gulbarga</p>
                </div>

                <!-- Mobile Menu Button -->
                <button id="mobile-menu-btn" class="xl:hidden p-2 text-[#1a1a4e] hover:text-[#d30404] transition-colors focus:outline-none shrink-0 ml-2" aria-label="Toggle Navigation">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path id="hamburger-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>

            <!-- NAVIGATION BAR: Blue to Red gradient -->
            <nav class="navbar-gradient hidden xl:block">
                <div class="max-w-[1200px] mx-auto px-4">
                    <ul class="flex items-center justify-center">
                        ${navMenuHTML}
                    </ul>
                </div>
            </nav>

            <!-- Mobile Navigation Menu (Collapsed) -->
            <div id="mobile-menu" class="hidden xl:hidden bg-[#b30000] text-white border-t border-red-800 shadow-inner max-h-[80vh] overflow-y-auto">
                <ul class="py-2 divide-y divide-red-800/40">
                    ${generateMobileMenuHTML(content.navMenu, pageId)}
                </ul>
            </div>
        </header>
    `;
}

// Generate nested desktop menu items - RED navbar style
function generateNavMenuHTML(menuItems, activePageId) {
    return menuItems.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = isMenuItemActive(item, activePageId);

        if (hasChildren) {
            return `
                <li class="relative group">
                    <a href="${cleanUrl(item.href)}" ${getLinkTarget(item.href)} class="nav-item-red flex items-center px-3 py-3 text-[13px] font-semibold text-white hover:bg-[#b30000] transition-colors whitespace-nowrap ${isActive ? 'bg-[#b30000]' : ''}">
                        ${item.label}
                        <svg class="w-3 h-3 ml-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </a>
                    
                    <!-- Dropdown level 1 -->
                    <ul class="absolute left-0 mt-0 w-64 bg-white border border-gray-200 shadow-xl py-1 z-50 dropdown-menu-animate">
                        ${item.children.map(subItem => {
                const subHasChildren = subItem.children && subItem.children.length > 0;
                const subIsActive = isMenuItemActive(subItem, activePageId);

                if (subHasChildren) {
                    return `
                                    <li class="relative group/sub">
                                        <a href="${cleanUrl(subItem.href)}" ${getLinkTarget(subItem.href)} class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#d30404] hover:text-white flex justify-between items-center transition-all">
                                            <span>${subItem.label}</span>
                                            <svg class="w-3 h-3 text-gray-400 group-hover/sub:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                                        </a>
                                        
                                        <!-- Dropdown level 2 -->
                                        <ul class="absolute left-full top-0 mt-0 ml-0 w-56 bg-white border border-gray-200 shadow-xl py-1 z-50 dropdown-menu-animate group-hover/sub:opacity-100 group-hover/sub:visible">
                                            ${subItem.children.map(grandItem => {
                        const grandHasChildren = grandItem.children && grandItem.children.length > 0;

                        if (grandHasChildren) {
                            return `
                                                        <li class="relative group/grand">
                                                            <a href="${cleanUrl(grandItem.href)}" ${getLinkTarget(grandItem.href)} class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#d30404] hover:text-white flex justify-between items-center transition-all">
                                                                <span>${grandItem.label}</span>
                                                                <svg class="w-3 h-3 text-gray-400 group-hover/grand:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                                                            </a>
                                                            
                                                            <!-- Dropdown level 3 -->
                                                            <ul class="absolute left-full top-0 mt-0 ml-0 w-56 bg-white border border-gray-200 shadow-xl py-1 z-50 dropdown-menu-animate group-hover/grand:opacity-100 group-hover/grand:visible">
                                                                ${grandItem.children.map(finalItem => `
                                                                    <li>
                                                                        <a href="${cleanUrl(finalItem.href)}" ${getLinkTarget(finalItem.href)} class="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#d30404] hover:text-white font-medium transition-all">
                                                                            ${finalItem.label}
                                                                        </a>
                                                                    </li>
                                                                `).join('')}
                                                            </ul>
                                                        </li>
                                                    `;
                        }

                        return `
                                                    <li>
                                                        <a href="${cleanUrl(grandItem.href)}" ${getLinkTarget(grandItem.href)} class="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#d30404] hover:text-white font-medium transition-all">
                                                            ${grandItem.label}
                                                        </a>
                                                    </li>
                                                `;
                    }).join('')}
                                        </ul>
                                    </li>
                                `;
                }

                return `
                                <li>
                                    <a href="${cleanUrl(subItem.href)}" ${getLinkTarget(subItem.href)} class="block px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#d30404] hover:text-white transition-all ${subIsActive ? 'bg-[#d30404] text-white' : ''}">
                                        ${subItem.label}
                                    </a>
                                </li>
                            `;
            }).join('')}
                    </ul>
                </li>
            `;
        }

        return `
            <li>
                <a href="${cleanUrl(item.href)}" ${getLinkTarget(item.href)} class="nav-item-red block px-3 py-3 text-[13px] font-semibold text-white hover:bg-[#b30000] transition-colors whitespace-nowrap ${isActive ? 'bg-[#b30000]' : ''}">
                    ${item.label}
                </a>
            </li>
        `;
    }).join('');
}

// Generate nested mobile menu items
function generateMobileMenuHTML(menuItems, activePageId, depth = 0) {
    return menuItems.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        const paddingLeft = 4 + (depth * 4);

        if (hasChildren) {
            const toggleId = `mob-toggle-${item.label.replace(/\s+/g, '-').toLowerCase()}`;
            return `
                <li class="w-full">
                    <button onclick="toggleMobileSubmenu('${toggleId}')" class="w-full text-left px-${paddingLeft} py-3 text-[14px] font-bold text-white hover:bg-red-950/20 flex justify-between items-center transition-all">
                        <span>${item.label}</span>
                        <svg class="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <ul id="${toggleId}" class="hidden bg-red-950/10 border-t border-b border-red-950/20 divide-y divide-red-800/20">
                        ${generateMobileMenuHTML(item.children, activePageId, depth + 1)}
                    </ul>
                </li>
            `;
        }

        return `
            <li>
                <a href="${cleanUrl(item.href)}" ${getLinkTarget(item.href)} class="block px-${paddingLeft} py-3 text-[14px] font-medium text-red-100 hover:bg-red-950/20 transition-all">
                    ${item.label}
                </a>
            </li>
        `;
    }).join('');
}

// Toggle mobile sub-menus
window.toggleMobileSubmenu = function (submenuId) {
    const el = document.getElementById(submenuId);
    if (el) {
        el.classList.toggle('hidden');
    }
};

// Check if a menu item represents the currently active page
function isMenuItemActive(item, activePageId) {
    const cleanHref = cleanUrl(item.href);
    if (cleanHref === activePageId || (activePageId === 'home' && cleanHref === 'index')) {
        return true;
    }
    if (item.children) {
        return item.children.some(child => isMenuItemActive(child, activePageId));
    }
    return false;
}

// ============================================================
// FOOTER - Matching original site with background overlay
// ============================================================
function renderFooter(content) {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    const phone = content.quickContact.phone;
    const email = content.quickContact.email;
    const address = content.quickContact.address;

    footerContainer.innerHTML = `
        <!-- Main Footer with background overlay -->
        <footer class="relative text-white py-14 overflow-hidden">
            <!-- Background image with purple overlay -->
            <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('Images/Home/am.jpg');"></div>
            <div class="absolute inset-0 bg-[#2d0845]/90"></div>
            
            <div class="max-w-[1200px] mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <!-- Widget 1: College Info + Social -->
                <div>
                    <div class="flex items-center mb-4">
                        <img src="Images/Home/amreshwarlogo-200x216.png" alt="Logo" class="w-14 h-14 object-contain mr-3 bg-white/10 p-1 rounded">
                        <h3 class="text-white text-[15px] font-bold font-serif-brand leading-tight">
                            Amareshwar Arts And Commerce Degree College, Aurad-B
                        </h3>
                    </div>
                    <div class="flex space-x-3 mt-5">
                        <a href="#" class="w-9 h-9 rounded-full bg-white/20 hover:bg-[#3b5998] flex items-center justify-center transition-colors">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                        </a>
                        <a href="#" class="w-9 h-9 rounded-full bg-white/20 hover:bg-black flex items-center justify-center transition-colors">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                        </a>
                        <a href="#" class="w-9 h-9 rounded-full bg-white/20 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 flex items-center justify-center transition-colors">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>
                        </a>
                        <a href="#" class="w-9 h-9 rounded-full bg-white/20 hover:bg-[#FF0000] flex items-center justify-center transition-colors">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
                        </a>
                    </div>
                </div>

                <!-- Widget 2: Useful Links -->
                <div>
                    <h3 class="text-white text-[16px] font-bold font-serif-brand mb-5 pb-2 border-b border-white/20">
                        Usefull Links
                    </h3>
                    <ul class="space-y-2.5 text-[13px]">
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="${cleanUrl('about-the-college.html')}" class="text-gray-300 hover:text-white transition-colors">About</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Publications</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Projects</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="${cleanUrl('teaching-non-teaching-staff.html')}" class="text-gray-300 hover:text-white transition-colors">Our Staff</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-[#d30404] hover:text-white transition-colors font-semibold">RTI</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Students Corner</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Other Links</a>
                        </li>
                    </ul>
                </div>

                <!-- Widget 3: Others Links -->
                <div>
                    <h3 class="text-white text-[16px] font-bold font-serif-brand mb-5 pb-2 border-b border-white/20">
                        Others Links
                    </h3>
                    <ul class="space-y-2.5 text-[13px]">
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Programmes Offered</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-[#d30404] hover:text-white transition-colors font-semibold">IQAC</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Alumni</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Committees & Cells</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">NAAC</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Institutional Distinctiveness</a>
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full bg-[#d30404] mr-2.5 shrink-0"></span>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Best Practices</a>
                        </li>
                    </ul>
                </div>

                <!-- Widget 4: Contact Information -->
                <div>
                    <h3 class="text-white text-[16px] font-bold font-serif-brand mb-5 pb-2 border-b border-white/20">
                        Contact Information
                    </h3>
                    <ul class="space-y-4 text-[13px]">
                        <li class="flex items-start">
                            <svg class="w-4 h-4 mr-2.5 text-[#d30404] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span class="text-gray-300 leading-relaxed">${address}</span>
                        </li>
                        <li class="flex items-center">
                            <svg class="w-4 h-4 mr-2.5 text-[#d30404] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            <a href="tel:${phone}" class="text-gray-300 hover:text-white transition-colors">${phone}</a>
                        </li>
                        <li class="flex items-center">
                            <svg class="w-4 h-4 mr-2.5 text-[#d30404] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <a href="mailto:${email}" class="text-gray-300 hover:text-white transition-colors">${email}</a>
                        </li>
                        <li class="flex items-center">
                            <svg class="w-4 h-4 mr-2.5 text-[#d30404] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                            <a href="#" class="text-gray-300 hover:text-white transition-colors">Brochure</a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>

        <!-- Copyright bottom strip -->
        <div class="bg-[#1a0530] text-gray-400 text-[12px] py-4 border-t border-white/10 select-none">
            <div class="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <p>&copy; ${new Date().getFullYear()} Amareshwar Arts and Commerce Degree College, Aurad-B. All Rights Reserved.</p>
                <div class="flex flex-col md:flex-row items-center md:space-x-4 space-y-1 md:space-y-0">
                    <span>Affiliated to Gulbarga University</span>
                    <span class="hidden md:inline">|</span>
                    <span>Re-accredited by NAAC</span>
                    <span class="hidden md:inline">|</span>
                    <span>Developed and Designed by <a href="https://hiideals.com/" target="_blank" class="text-yellow-300 hover:text-yellow-400 hover:underline font-bold transition-all cursor-pointer">Hi-Ideals</a>.</span>
                </div>
            </div>
        </div>
    `;
}

// ============================================================
// MAIN CONTENT ROUTER
// ============================================================
function renderMainContent(content, pageId) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    if (pageId === 'home') {
        renderHomepageContent(content, mainContent);
    } else {
        renderSubpageContent(content, pageId, mainContent);
    }
}

// ============================================================
// HOMEPAGE - Exact replica layout
// ============================================================
function renderHomepageContent(content, container) {
    // 1. Hero banner slider
    const slidesHTML = content.heroSlides ? content.heroSlides.map((slide, idx) => `
        <div class="hero-slide ${idx === 0 ? 'active' : ''} absolute inset-0 bg-cover bg-center" style="background-image: url('${slide.image}');">
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative max-w-5xl mx-auto px-4 text-center z-10">
                <span class="text-[#ffd700] text-[16px] md:text-[20px] font-semibold italic font-serif-brand block mb-2">
                    Welcome to
                </span>
                <h2 class="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-serif-brand drop-shadow-lg">
                    ${slide.title}
                </h2>
            </div>
        </div>
    `).join('') : `
        <div class="hero-slide active absolute inset-0 bg-cover bg-center" style="background-image: url('Images/Home/am.jpg');">
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative max-w-5xl mx-auto px-4 text-center z-10">
                <span class="text-[#ffd700] text-[16px] md:text-[20px] font-semibold italic font-serif-brand block mb-2">Welcome to</span>
                <h2 class="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-serif-brand drop-shadow-lg">${content.siteName}</h2>
            </div>
        </div>
    `;

    const indicatorsHTML = content.heroSlides ? content.heroSlides.map((_, idx) => `
        <button onclick="setHeroSlide(${idx})" class="hero-dot w-3 h-3 rounded-full ${idx === 0 ? 'bg-white w-5' : 'bg-white/50'} transition-all"></button>
    `).join('') : `
        <button onclick="setHeroSlide(0)" class="hero-dot w-3 h-3 rounded-full bg-white transition-all"></button>
    `;

    const heroHTML = `
        <section class="relative bg-gray-900 overflow-hidden select-none">
            <div class="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
                ${slidesHTML}
            </div>

            <!-- Left/Right Controls -->
            <button onclick="prevHeroSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#d30404] text-white p-2.5 rounded-full shadow transition-all z-20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onclick="nextHeroSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#d30404] text-white p-2.5 rounded-full shadow transition-all z-20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>

            <!-- Indicators -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                ${indicatorsHTML}
            </div>
        </section>
    `;

    // 2. Notification Ticker Bar (below slider)
    const notifTickerItems = [
        "2023-24 UG Revised Calendar of Events",
        "Postponed UG exam Dates",
        "Admission are open for 2024-25"
    ];
    const notifTickerHTML = `
        <div class="bg-white border-b border-gray-200 py-2.5 overflow-hidden">
            <div class="max-w-[1200px] mx-auto px-4 flex items-center">
                <span class="bg-[#d30404] text-white text-[11px] font-bold px-3 py-[4px] uppercase tracking-wider shrink-0 mr-3">Notifications</span>
                <div class="notif-ticker-wrap flex-grow overflow-hidden relative">
                    <div class="notif-ticker-content flex whitespace-nowrap" id="notif-ticker-content">
                        ${notifTickerItems.map(item => `<span class="notif-ticker-item text-[13px] text-gray-700 font-medium px-6">${item}</span>`).join('')}
                        ${notifTickerItems.map(item => `<span class="notif-ticker-item text-[13px] text-gray-700 font-medium px-6">${item}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    // 3. About section + Notifications panel (two columns)
    const homeData = content.pages['home'];

    let aboutHeading = "About Amareshwar Arts And Commerce Degree College, Aurad-B";
    let aboutParagraphs = [];

    if (homeData && homeData.sections) {
        homeData.sections.forEach(sec => {
            if (sec.heading.toLowerCase().includes("about")) {
                aboutHeading = sec.heading;
                aboutParagraphs = sec.content.filter(block => block.type === 'p').map(b => b.text);
            }
        });
    }

    const defaultNotices = [
        { label: "Assignment Notice for B.COM Sem-6", isNew: true },
        { label: "2023-24 UG Revised Calendar of Events", isNew: true },
        { label: "Postponed UG exam Dates", isNew: true },
        { label: "Admission are open for 2024-25", isNew: true },
        { label: "Internal Assessment Notice B.COM Sem-4", isNew: true },
        { label: "Viva Practical Exam Schedule BA Sem-2", isNew: true },
        { label: "Library Book Return Notice", isNew: true },
        { label: "NSS Camp Registration Open", isNew: true }
    ];

    const noticesHTML = defaultNotices.map(n => `
        <div class="flex items-start py-2.5 border-b border-gray-100 last:border-b-0">
            <span class="notification-new-badge shrink-0 mr-2 mt-0.5">★ New</span>
            <a href="#" class="text-[13px] text-gray-700 hover:text-[#d30404] transition-colors leading-snug font-medium">
                ${n.label}
            </a>
        </div>
    `).join('');

    const mainIntroHTML = `
        <section class="py-12 bg-white">
            <div class="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <!-- About Column -->
                <div class="lg:col-span-2">
                    <h2 class="text-[22px] md:text-[24px] font-serif-brand font-bold text-[#1a1a4e] italic mb-1 leading-tight">
                        ${aboutHeading}
                    </h2>
                    <div class="w-16 h-[3px] bg-[#d30404] mb-5"></div>
                    <div class="space-y-4 text-gray-600 leading-relaxed text-[14px] text-justify">
                        ${aboutParagraphs.map(p => `<p>${p}</p>`).join('')}
                    </div>
                    <div class="mt-6">
                        <a href="${cleanUrl('about-the-college.html')}" class="inline-block bg-[#1a1a4e] hover:bg-[#d30404] text-white text-[13px] font-semibold px-6 py-2.5 rounded-full uppercase tracking-wider transition-all">
                            Read More
                        </a>
                    </div>
                </div>

                <!-- Notifications Panel -->
                <div class="bg-white border border-gray-200 rounded overflow-hidden self-start shadow-sm">
                    <div class="bg-[#d30404] text-white py-3 px-4">
                        <h3 class="font-bold text-[15px] font-serif-brand flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            Notifications
                        </h3>
                    </div>
                    <div class="p-4 max-h-[350px] overflow-y-auto notification-scroll">
                        ${noticesHTML}
                    </div>
                </div>
            </div>
        </section>
    `;

    // 4. Courses Offered section with background overlay
    const coursesHTML = `
        <section class="relative py-14 overflow-hidden">
            <!-- Background with purple/magenta overlay -->
            <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('Images/Home/am.jpg');"></div>
            <div class="absolute inset-0 bg-[#6b1d5e]/85"></div>
            
            <div class="max-w-[1200px] mx-auto px-4 relative z-10">
                <div class="text-center mb-10">
                    <h2 class="text-[24px] md:text-[28px] font-serif-brand font-bold text-white italic mb-1">
                        Courses Offered
                    </h2>
                    <div class="w-16 h-[3px] bg-[#d30404] mx-auto"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <!-- BA Card -->
                    <div class="bg-transparent border-2 border-[#e8524a] rounded-lg p-8 text-center hover:bg-white/10 transition-all">
                        <div class="w-16 h-16 rounded-full bg-[#d30404] flex items-center justify-center mx-auto mb-5">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zM12 14v7"></path></svg>
                        </div>
                        <h3 class="text-white text-[18px] font-bold font-serif-brand italic mb-5">Bachelors Of Arts</h3>
                        <a href="${cleanUrl('ba.html')}" class="inline-block bg-[#d30404] hover:bg-[#b30000] text-white text-[12px] font-semibold px-5 py-2 rounded-full uppercase tracking-wider transition-all">
                            Read More
                        </a>
                    </div>

                    <!-- B.Com Card -->
                    <div class="bg-transparent border-2 border-[#3a7bd5] rounded-lg p-8 text-center hover:bg-white/10 transition-all">
                        <div class="w-16 h-16 rounded-full bg-[#d30404] flex items-center justify-center mx-auto mb-5">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zM12 14v7"></path></svg>
                        </div>
                        <h3 class="text-white text-[18px] font-bold font-serif-brand italic mb-5">Bachelors Of Commerce</h3>
                        <a href="${cleanUrl('b-com.html')}" class="inline-block bg-[#3a7bd5] hover:bg-[#2d62b3] text-white text-[12px] font-semibold px-5 py-2 rounded-full uppercase tracking-wider transition-all">
                            Read More
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `;

    container.innerHTML = heroHTML + notifTickerHTML + mainIntroHTML + coursesHTML;
}
// Helper to get PDF/XLS document paths for SSR pages
function getSsrLink(pageId, text, type) {
    const trimmed = text.trim();
    if (pageId === 'curriculum-planning-and-delivery') {
        if (trimmed === 'Session Plan') {
            return 'Docs/SSR/Curriculum Planning/session-plan.pdf';
        }
        if (trimmed === 'Time Table And Internal Time Table') {
            return 'Docs/SSR/Curriculum Planning/time-table-and-internal-time-table.pdf';
        }
    }
    if (pageId === 'add-on-courses') {
        if (type === 'p' && trimmed === 'Notices Add on Course') {
            return 'Docs/SSR/Add On Courses/1_notices_add-on-course.pdf';
        }
        if (type === 'list') {
            if (trimmed === 'Syllabus') return 'Docs/SSR/Add On Courses/2_syllabus.pdf';
            if (trimmed === 'Enrollment') return 'Docs/SSR/Add On Courses/3_enrollment.pdf';
            if (trimmed === 'Attendance') return 'Docs/SSR/Add On Courses/4_attendance.pdf';
            if (trimmed === 'Result Sheet') return 'Docs/SSR/Add On Courses/5_result_sheet.pdf';
            if (trimmed === 'Certificate') return 'Docs/SSR/Add On Courses/6_certificate.pdf';
        }
    }
    if (pageId === 'project-and-internship') {
        if (trimmed === 'Student Project Certificates') {
            return 'Docs/SSR/Project And Internship/student-project-certificates.pdf';
        }
    }
    if (pageId === 'feedback-2') {
        if (trimmed === 'Feedback Analysis') {
            return 'Docs/SSR/Feedback/Feedback-analysis.pdf';
        }
        if (trimmed === 'Action Taken Report') {
            return 'Docs/SSR/Feedback/action-taken-report.pdf';
        }
        if (trimmed === 'Communication With University') {
            return 'Docs/SSR/Feedback/communication-with-university.pdf';
        }
    }
    if (pageId === 'students-admission-details') {
        let fn = trimmed.replace(/\s+/g, '-').replace(/B\.com/i, 'B.Com');
        return `Docs/SSR/Students Admission Details/${fn}.pdf`;
    }
    if (pageId === 'result') {
        let fn = trimmed.replace(/\s+/g, '-');
        return `Docs/SSR/Result/${fn}.pdf`;
    }
    if (pageId === 'scholarships') {
        let fn = trimmed.replace(/\s+/g, '-');
        return `Docs/SSR/Scholarships/${fn}.xls`;
    }
    return null;
}

function renderSubpageContent(content, pageId, container) {
    const pageData = content.pages[pageId];
    if (!pageData) {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 py-16 text-center select-none">
                <h2 class="text-3xl font-serif-brand font-bold text-[#1a1a4e] mb-4">Page Under Construction</h2>
                <p class="text-gray-600 mb-8">The requested page (${pageId}) is currently being structured.</p>
                <a href="${cleanUrl('index.html')}" class="bg-[#1a1a4e] hover:bg-[#d30404] text-white px-6 py-2.5 rounded font-semibold text-sm transition-colors uppercase tracking-wider shadow">
                    Back to Homepage
                </a>
            </div>
        `;
        return;
    }

    // Breadcrumbs & Banner HTML
    const pageTitle = pageData.title;
    const bannerHTML = `
        <div class="bg-[#1a1a4e] text-white py-12 select-none relative overflow-hidden">
            <div class="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div class="max-w-[1200px] mx-auto px-4 relative z-10">
                <h1 class="text-3xl md:text-4xl font-serif-brand font-bold leading-tight mb-2 select-text">${pageTitle}</h1>
                <div class="flex items-center space-x-2 text-xs text-gray-300 select-none">
                    <a href="${cleanUrl('index.html')}" class="hover:text-white transition-colors">Home</a>
                    <span>/</span>
                    <span class="text-white font-medium">${pageTitle}</span>
                </div>
            </div>
        </div>
    `;

    // Render blocks
    let blocksHTML = '';

    if (pageId === 'contact-us') {
        blocksHTML = renderContactUsPage(content);
    } else if (pageId === 'gallery') {
        blocksHTML = renderGalleryPage();
    } else if (pageId === 'about-the-college') {
        blocksHTML = renderAboutTheCollegePage(content, pageData);
    } else {
        window.switchCourseTab = window.switchCourseTab || function (tabId, buttonEl) {
            document.querySelectorAll('.tab-content-panel').forEach(panel => {
                panel.classList.add('hidden');
            });
            const activePanel = document.getElementById(tabId);
            if (activePanel) {
                activePanel.classList.remove('hidden');
            }
            document.querySelectorAll('.course-tab-btn').forEach(btn => {
                btn.classList.remove('bg-[#1a1a4e]');
                btn.classList.add('bg-[#b30000]', 'hover:bg-[#990000]');
            });
            if (buttonEl) {
                buttonEl.classList.remove('bg-[#b30000]', 'hover:bg-[#990000]');
                buttonEl.classList.add('bg-[#1a1a4e]');
            }
        };

        const renderSectionBlocks = (section) => {
            return section.content.map(block => {
                if (block.type === 'p') {
                    if (block.text.includes("Content Not Available")) {
                        return `
                            <div class="bg-gray-50 border-l-4 border-[#1a1a4e] text-gray-500 p-4 rounded text-sm select-none my-4">
                                ${block.text}
                            </div>
                        `;
                    }

                    let link = null;
                    if (pageId === 'iqac') {
                        const trimmedText = block.text.trim();
                        const sectionHeading = section.heading ? section.heading.trim() : '';
                        if (sectionHeading === 'IQAC') {
                            if (trimmedText === 'Undertaking') {
                                link = 'Docs/NAAC/IQAC/Undertaking.pdf';
                            } else if (trimmedText === 'Declaration') {
                                link = 'Docs/NAAC/IQAC/declaration.pdf';
                            } else if (trimmedText === '2F') {
                                link = 'Docs/NAAC/IQAC/2F.pdf';
                            } else if (trimmedText === '12B') {
                                link = 'Docs/NAAC/IQAC/12B.pdf';
                            } else if (trimmedText.includes('C-9051_certificateold_-DCF')) {
                                link = 'Docs/NAAC/IQAC/C-9051_certificateold_-DCF-6.pdf';
                            }
                        } else if (sectionHeading === 'AQAR') {
                            if (trimmedText === 'AQAR 2018-19') {
                                link = 'Docs/NAAC/AQAR/2018_19.pdf';
                            } else if (trimmedText === 'AQAR 2019-20') {
                                link = 'Docs/NAAC/AQAR/2019_20.pdf';
                            } else if (trimmedText === 'AQAR 2020-21') {
                                link = 'Docs/NAAC/AQAR/2020_21.pdf';
                            } else if (trimmedText === 'AQAR 2021-22') {
                                link = 'Docs/NAAC/AQAR/2021_22.pdf';
                            }
                        } else if (sectionHeading === 'IQAC-Meeting Minutes') {
                            if (trimmedText.includes('2018-19')) {
                                link = 'Docs/NAAC/IQAC_meeting/1st.pdf';
                            } else if (trimmedText.includes('2019-20')) {
                                link = 'Docs/NAAC/IQAC_meeting/2nd.pdf';
                            } else if (trimmedText.includes('2020-21')) {
                                link = 'Docs/NAAC/IQAC_meeting/3rd.pdf';
                            } else if (trimmedText.includes('2021-22')) {
                                link = 'Docs/NAAC/IQAC_meeting/4th.pdf';
                            } else if (trimmedText.includes('2022-23')) {
                                link = 'Docs/NAAC/IQAC_meeting/5th.pdf';
                            }
                        } else if (sectionHeading === 'IQAC Composition') {
                            if (trimmedText === 'IQAC Composition') {
                                link = 'Docs/NAAC/IQAC composition/iqac_0001.pdf';
                            }
                        }
                    } else {
                        link = getSsrLink(pageId, block.text, 'p');
                    }

                    if (link) {
                        return `
                            <p class="mb-4 text-sm md:text-[15px]">
                                <a href="${link}" target="_blank" class="text-[#d30404] hover:underline font-semibold transition-colors duration-150 cursor-pointer inline-flex items-start">
                                    <span class="inline-flex items-center justify-center w-5 h-5 bg-[#d30404] rounded-sm mr-2.5 shrink-0 mt-0.5">
                                        <span class="flex items-center justify-center w-3.5 h-3.5 bg-white rounded-full">
                                            <svg class="w-2.5 h-2.5 text-[#d30404]" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </span>
                                    <span>${block.text}</span>
                                </a>
                            </p>
                        `;
                    }

                    return `<p class="text-gray-600 leading-relaxed mb-4 text-sm md:text-[15px]">${block.text}</p>`;
                } else if (block.type === 'list') {
                    return `
                        <ul class="space-y-2 mb-6 text-gray-600 text-sm md:text-[15px]">
                            ${block.items.map(item => {
                        let link = null;
                        if (pageId === 'extension-activities') {
                            let filename = item.trim()
                                .replace(/’/g, '')
                                .replace(/\s+/g, ' ');

                            filename = filename.replace(/\.\s/, '.-');
                            filename = filename.replace(/\s/g, '-');

                            if (section.heading === '2019-20' && item.includes('climate change')) {
                                filename = '5.-climate-change-docs-1';
                            }

                            link = `Docs/SSR/Extension Activities/${section.heading}/${filename}.pdf`;
                        } else {
                            link = getSsrLink(pageId, item, 'list');
                        }

                        if (link) {
                            return `
                                        <li class="leading-relaxed list-none">
                                            <a href="${link}" target="_blank" class="text-[#d30404] hover:underline font-semibold transition-colors duration-150 cursor-pointer inline-flex items-start">
                                                <span class="inline-flex items-center justify-center w-5 h-5 bg-[#d30404] rounded-sm mr-2.5 shrink-0 mt-0.5">
                                                    <span class="flex items-center justify-center w-3.5 h-3.5 bg-white rounded-full">
                                                        <svg class="w-2.5 h-2.5 text-[#d30404]" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </span>
                                                <span>${item}</span>
                                            </a>
                                        </li>
                                    `;
                        }
                        return `
                                    <li class="leading-relaxed list-disc ml-5">
                                        <span class="text-gray-700">${item}</span>
                                    </li>
                                `;
                    }).join('')}
                        </ul>
                    `;
                } else if (block.type === 'table') {
                    return renderHTMLTable(block.data);
                }
                return '';
            }).join('');
        };

        if (pageId === 'kannada' || pageId === 'english' || pageId === 'hindi') {
            const mainHeading = pageData.sections[1] ? pageData.sections[1].heading : `B.A-${pageData.title}`;
            const tabSections = pageData.sections.slice(2);

            const tabsNavHTML = tabSections.map((sec, idx) => {
                const isFirst = idx === 0;
                return `
                    <button onclick="switchCourseTab('tab-${idx}', this)" class="course-tab-btn w-full text-left px-4 py-3.5 text-[14px] font-bold text-white ${isFirst ? 'bg-[#1a1a4e]' : 'bg-[#b30000] hover:bg-[#990000]'} rounded transition-all flex items-center shadow-sm select-none cursor-pointer">
                        <span class="mr-2 font-mono">&raquo;</span>
                        <span>${sec.heading}</span>
                    </button>
                `;
            }).join('');

            const tabsContentHTML = tabSections.map((sec, idx) => {
                const isFirst = idx === 0;
                const bodyHTML = renderSectionBlocks(sec);
                return `
                    <div id="tab-${idx}" class="tab-content-panel ${isFirst ? '' : 'hidden'}">
                        <h3 class="text-xl font-bold text-[#1a1a4e] border-b border-gray-100 pb-2 mb-6">${sec.heading}</h3>
                        <div>
                            ${bodyHTML || '<p class="text-gray-500 italic">No content available for this section.</p>'}
                        </div>
                    </div>
                `;
            }).join('');

            blocksHTML = `
                <div class="max-w-[1200px] mx-auto px-4 py-12">
                    <div class="text-center mb-10">
                        <h2 class="text-3xl font-serif-brand font-bold text-[#d30404] tracking-wide inline-block border-b-2 border-[#d30404] pb-2">
                            ${mainHeading}
                        </h2>
                    </div>

                    <div class="flex flex-col lg:flex-row gap-8">
                        <!-- Sidebar Navigation -->
                        <div class="w-full lg:w-1/4 shrink-0">
                            <div class="flex flex-col space-y-2">
                                ${tabsNavHTML}
                            </div>
                        </div>
                        
                        <!-- Tab Content -->
                        <div class="w-full lg:w-3/4 bg-white rounded-lg shadow-sm border border-gray-150 p-6 md:p-8 min-h-[400px]">
                            ${tabsContentHTML}
                        </div>
                    </div>
                </div>
            `;
        } else {
            blocksHTML = `
                <div class="max-w-4xl mx-auto px-4 py-12">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-10">
                        ${pageData.sections.map(section => {
                let secHTML = '';
                if (section.heading) {
                    const headingClass = section.heading_type === 'h3' ? 'text-xl font-bold text-[#1a1a4e] mt-8 mb-4' : 'text-2xl font-serif-brand font-bold text-[#1a1a4e] border-b border-gray-100 pb-2 mt-10 mb-6';
                    secHTML += `<h2 class="${headingClass}">${section.heading}</h2>`;
                }
                const bodyHTML = renderSectionBlocks(section);
                return secHTML + bodyHTML;
            }).join('')}
                    </div>
                </div>
            `;
        }
    }

    container.innerHTML = bannerHTML + blocksHTML;
}

// Render HTML table
function renderHTMLTable(tableData) {
    if (!tableData || tableData.length === 0) return '';

    const headers = tableData[0];
    const rows = tableData.slice(1);

    const headerHTML = headers.map(h => `
        <th class="px-6 py-4 bg-[#1a1a4e] text-white text-xs font-bold uppercase tracking-wider text-left border-r border-[#1a1a4e]/20 last:border-r-0">
            ${h}
        </th>
    `).join('');

    const rowsHTML = rows.map((row, idx) => `
        <tr class="border-b border-gray-100 hover:bg-red-50/20 transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}">
            ${row.map(cell => `
                <td class="px-6 py-4 text-sm text-gray-700 font-medium border-r border-gray-100/50 last:border-r-0">
                    ${cell || '-'}
                </td>
            `).join('')}
        </tr>
    `).join('');

    return `
        <div class="overflow-x-auto border border-gray-200 rounded-lg shadow-sm my-8">
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>${headerHTML}</tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${rowsHTML}
                </tbody>
            </table>
        </div>
    `;
}

// Render contact page
function renderContactUsPage(content) {
    const phone = "08485-796166";
    const email = "adcab1979@gmail.com";
    const address = "Amareshwar Arts And Commerce Degree College, Aurad-B<br>Aiwan-e-shahi,Kalaburagi 585326.Karnataka.";
    const hours = "Monday – Friday : 10 am to 5 pm<br>Saturday : 10 am to 2 pm<br>Sunday : Off";

    return `
        <div class="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Left Info Panel -->
            <div class="bg-[#1a1a4e] text-white p-8 md:p-10 rounded-lg shadow-md self-start space-y-8 select-none">
                <h2 class="text-2xl font-serif-brand font-bold relative pb-2 select-text">
                    College Info
                    <span class="absolute bottom-0 left-0 w-12 h-1 bg-[#d30404]"></span>
                </h2>
                
                <div class="flex items-start">
                    <div class="bg-white/10 p-3 rounded-full mr-4 shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <div>
                        <strong class="block text-gray-300 text-xs uppercase tracking-wider mb-0.5">Call our officers assistants, anytime!</strong>
                        <span class="text-sm font-semibold select-text">${phone}</span>
                    </div>
                </div>

                <div class="flex items-start">
                    <div class="bg-white/10 p-3 rounded-full mr-4 shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                        <strong class="block text-gray-300 text-xs uppercase tracking-wider mb-0.5">Have any queries? Send us an email</strong>
                        <span class="text-sm font-semibold select-text">${email}</span>
                    </div>
                </div>

                <div class="flex items-start">
                    <div class="bg-white/10 p-3 rounded-full mr-4 shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div>
                        <strong class="block text-gray-300 text-xs uppercase tracking-wider mb-0.5">Address</strong>
                        <span class="text-sm font-semibold select-text leading-relaxed">${address}</span>
                    </div>
                </div>

                <div class="flex items-start">
                    <div class="bg-white/10 p-3 rounded-full mr-4 shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <strong class="block text-gray-300 text-xs uppercase tracking-wider mb-0.5">Collage Hours</strong>
                        <span class="text-sm font-semibold select-text leading-relaxed">${hours}</span>
                    </div>
                </div>
            </div>

            <!-- Right Contact Form -->
            <div class="lg:col-span-2 bg-white p-8 md:p-10 border border-gray-200/80 rounded-lg shadow-md">
                <h2 class="text-2xl font-serif-brand font-bold text-[#1a1a4e] mb-6 relative pb-2 select-none">
                    Send Us a Message
                    <span class="absolute bottom-0 left-0 w-12 h-1 bg-[#d30404]"></span>
                </h2>
                
                <form id="contact-form" class="space-y-6" onsubmit="handleContactSubmit(event)">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 select-none">First & Last Name</label>
                            <input type="text" required class="w-full bg-gray-50 border border-gray-200/80 focus:border-[#1a1a4e] rounded px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#1a1a4e]">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 select-none">Email Address</label>
                            <input type="email" required class="w-full bg-gray-50 border border-gray-200/80 focus:border-[#1a1a4e] rounded px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#1a1a4e]">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 select-none">Subject</label>
                        <input type="text" required class="w-full bg-gray-50 border border-gray-200/80 focus:border-[#1a1a4e] rounded px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#1a1a4e]">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 select-none">Message Content</label>
                        <textarea required rows="5" class="w-full bg-gray-50 border border-gray-200/80 focus:border-[#1a1a4e] rounded px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#1a1a4e]"></textarea>
                    </div>
                    
                    <button type="submit" class="bg-[#1a1a4e] hover:bg-[#d30404] text-white text-xs font-bold px-8 py-3.5 rounded uppercase tracking-wider shadow transition-all hover:scale-[1.02]">
                        Send Message
                    </button>
                </form>
            </div>
        </div>

        <!-- Map Section -->
        <div class="max-w-7xl mx-auto px-4 pb-16">
            <div class="w-full h-[450px] rounded-lg overflow-hidden border border-gray-200 shadow-md">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.704721731219!2d76.86085997420817!3d17.32979030446374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc8b9f653735955%3A0x558b14f3efe59a5c!2sSharada%20Vivek%20Women&#39;s%20Degree%20College%20Kalburgi!5e0!3m2!1sen!2sin!4v1782884218174!5m2!1sen!2sin" class="w-full h-full" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
            </div>
        </div>
    `;
}

// Handle contact form submission
window.handleContactSubmit = function (event) {
    event.preventDefault();
    const form = event.target;
    const inputs = form.querySelectorAll('input');
    const textarea = form.querySelector('textarea');

    const name = inputs[0].value;
    const email = inputs[1].value;
    const subject = inputs[2].value;
    const message = textarea.value;

    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:adcab1979@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    alert("Thank you! Opening your email client to send the message to adcab1979@gmail.com.");
    form.reset();
};

// Render Gallery page
function renderGalleryPage() {
    const photos = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Campus Gallery Event #${i + 1}`,
        desc: `Description block for gallery item ${i + 1}.`
    }));

    const galleryGrid = photos.map(photo => `
        <div class="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all" onclick="openLightbox(${photo.id})">
            <div class="h-56 bg-gray-200 img-placeholder relative flex items-center justify-center text-gray-400 font-bold select-none text-xs">
                IMAGE PLACEHOLDER
            </div>
            <div class="p-4 bg-white border-t border-gray-50">
                <h3 class="text-sm font-semibold text-gray-800 group-hover:text-[#d30404] transition-colors line-clamp-1">${photo.title}</h3>
                <span class="text-xs text-gray-400 mt-1 block">Click to enlarge</span>
            </div>
        </div>
    `).join('');

    return `
        <div class="max-w-7xl mx-auto px-4 py-16">
            <div class="text-center max-w-xl mx-auto mb-12 select-none">
                <h2 class="text-2xl font-serif-brand font-bold text-[#1a1a4e] mb-3">College Gallery</h2>
                <div class="w-12 h-1 bg-[#d30404] mx-auto mb-4"></div>
                <p class="text-gray-500 text-xs font-medium uppercase tracking-wider">
                    Moments and events from our academic and extra-curricular calendar.
                </p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                ${galleryGrid}
            </div>
        </div>

        <!-- Lightbox modal -->
        <div id="gallery-lightbox" class="lightbox-modal" onclick="closeLightbox()">
            <span class="lightbox-close">&times;</span>
            <div class="h-full flex items-center justify-center p-4">
                <div class="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg shadow-2xl p-16 text-center max-w-lg w-full relative" onclick="event.stopPropagation()">
                    <span onclick="closeLightbox()" class="absolute top-4 right-4 text-2xl font-bold cursor-pointer text-gray-400 hover:text-white">&times;</span>
                    <svg class="w-12 h-12 text-[#d30404] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <h3 id="lightbox-title" class="text-white text-lg font-bold font-serif-brand mb-2"></h3>
                    <p class="text-xs text-gray-400 mb-4 leading-relaxed">
                        Gallery image source is left blank as requested. Add your images to display here.
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Render About the College page
function renderAboutTheCollegePage(content, pageData) {
    const section = pageData.sections[1];
    if (!section) return '';

    const heading = section.heading;
    const paragraphs = section.content.filter(block => block.type === 'p');

    const p0 = paragraphs[0] ? paragraphs[0].text : '';
    const p1 = paragraphs[1] ? paragraphs[1].text : '';
    const p2 = paragraphs[2] ? paragraphs[2].text : '';
    const p3 = paragraphs[3] ? paragraphs[3].text : '';
    const p4 = paragraphs[4] ? paragraphs[4].text : '';

    return `
        <div class="max-w-6xl mx-auto px-4 py-16">
            <div class="flex flex-col lg:flex-row gap-12 items-center mb-10">
                <!-- Left: Decorative Image Layout -->
                <div class="shrink-0 relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto lg:mx-0 select-none">
                    <!-- Top-Left Shape -->
                    <div class="absolute -top-5 -left-5 w-36 h-36 bg-gradient-to-tr from-[#b3004b] via-[#7c0068] to-[#45006b] rounded-3xl opacity-90 z-0"></div>
                    <!-- Bottom-Right Shape -->
                    <div class="absolute -bottom-5 -right-5 w-36 h-36 bg-gradient-to-tr from-[#b3004b] via-[#7c0068] to-[#45006b] rounded-3xl opacity-90 z-0"></div>
                    <!-- College Image -->
                    <img src="Images/About us/About the College/college-400x400.png" alt="Amareshwar Arts and Commerce Degree College" class="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white">
                </div>

                <!-- Right: Content -->
                <div class="flex-grow">
                    <h2 class="text-2xl md:text-3xl font-serif-brand font-bold text-[#d30404] leading-tight mb-3">
                        ${heading}
                    </h2>
                    <div class="w-20 h-[3px] bg-gradient-to-r from-[#d30404] to-[#1a1a4e] mb-6"></div>
                    
                    <div class="space-y-4 text-gray-600 text-sm md:text-[15px] leading-relaxed">
                        ${p0 ? `<p>${p0}</p>` : ''}
                        ${p1 ? `<p>${p1}</p>` : ''}
                    </div>
                </div>
            </div>

            <!-- Bottom Full-Width Content -->
            <div class="space-y-4 text-gray-600 text-sm md:text-[15px] leading-relaxed border-t border-gray-100 pt-8">
                ${p2 ? `<p>${p2}</p>` : ''}
                ${p3 ? `<p>${p3}</p>` : ''}
                ${p4 ? `<p>${p4}</p>` : ''}
            </div>
        </div>
    `;
}

// ============================================================
// Interactive Element Initializers
// ============================================================

// News ticker in top bar
function initTicker() {
    // The CSS animation handles the scrolling
}

// News ticker scroll control
window.scrollNewsTicker = function (direction) {
    const tickerContent = document.getElementById('news-ticker-content');
    if (!tickerContent) return;

    const currentTransform = tickerContent.style.transform || '';
    const match = currentTransform.match(/translateX\((-?\d+)px\)/);
    const currentX = match ? parseInt(match[1]) : 0;
    const newX = currentX + (direction * -200);

    tickerContent.style.transition = 'transform 0.3s ease';
    tickerContent.style.transform = `translateX(${newX}px)`;
};

// Notification ticker below slider
function initNotificationTicker() {
    // CSS animation handles this
}

// Toggle mobile navigation
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('hamburger-icon');

    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');

        if (isHidden) {
            icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        } else {
            icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        }
    });
}

// Hero banner carousel
let currentHeroIndex = 0;
let heroTimer = null;

function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(nextHeroSlide, 6000);

    updateHeroCarouselIndicators();
}

window.nextHeroSlide = function () {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    slides[currentHeroIndex].classList.remove('active');
    currentHeroIndex = (currentHeroIndex + 1) % slides.length;
    slides[currentHeroIndex].classList.add('active');

    updateHeroCarouselIndicators();
};

window.prevHeroSlide = function () {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    slides[currentHeroIndex].classList.remove('active');
    currentHeroIndex = (currentHeroIndex - 1 + slides.length) % slides.length;
    slides[currentHeroIndex].classList.add('active');

    updateHeroCarouselIndicators();
};

window.setHeroSlide = function (index) {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0 || index >= slides.length) return;

    slides[currentHeroIndex].classList.remove('active');
    currentHeroIndex = index;
    slides[currentHeroIndex].classList.add('active');

    updateHeroCarouselIndicators();

    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(nextHeroSlide, 6000);
};

function updateHeroCarouselIndicators() {
    const dots = document.querySelectorAll('.hero-dot');
    if (dots.length === 0) return;

    dots.forEach((dot, idx) => {
        if (idx === currentHeroIndex) {
            dot.classList.remove('bg-white/50');
            dot.classList.add('bg-white', 'w-5');
        } else {
            dot.classList.remove('bg-white', 'w-5');
            dot.classList.add('bg-white/50');
        }
    });
}

// Lightbox handlers
window.openLightbox = function (photoId) {
    const modal = document.getElementById('gallery-lightbox');
    const title = document.getElementById('lightbox-title');

    if (modal && title) {
        title.textContent = `Campus Gallery Event #${photoId}`;
        modal.style.display = 'block';
        document.body.classList.add('overflow-hidden');
    }
};

window.closeLightbox = function () {
    const modal = document.getElementById('gallery-lightbox');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('overflow-hidden');
    }
};

function initLightbox() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}
