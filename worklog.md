---
Task ID: 1
Agent: Main Agent
Task: Fix UI issues - jitter, missing reset button, hero image, scroll-to-top button

Work Log:
- Read all relevant source files (AppShell, HomeView, ScrollToTopButton, AgentChatPopup, Header, Sidebar, globals.css, stores)
- Identified jitter causes: backdrop-blur on Header, animate-pulse on chat button, transition-all on cards
- Fixed Header: removed backdrop-blur, replaced with solid bg-background
- Fixed HomeView: changed transition-all to transition-colors on cards
- Fixed AgentChatPopup: removed animate-pulse from floating chat button
- Added scroll-behavior: smooth and will-change: scroll-position to main container
- Added reset progress button to HomeView stats section with AlertDialog confirmation
- Generated professional hero banner image (hero-banner.png) and logo icon (logo-icon.png)
- Updated HomeView hero section with background image overlay design
- Rewrote ScrollToTopButton: uses main scroll container ref, shows/hides based on scroll threshold (300px), positioned bottom-24 right-6 to not overlap chatbot button, streamlined design matching chatbot aesthetic
- Updated AppShell to pass mainRef to ScrollToTopButton and added will-change style
- Build verified successfully

Stage Summary:
- Page jitter fixed (removed backdrop-blur, animate-pulse, transition-all)
- Reset progress button added to main page (HomeView)
- Professional hero banner generated and integrated
- Scroll-to-top button fully rewritten and functional (shows on scroll, positioned above chatbot, no overlap)
