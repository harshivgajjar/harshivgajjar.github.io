// Book state management
let currentPage = 1;
const totalPages = 16;
let isBookOpen = false;

// DOM elements
const cover = document.getElementById('cover');
const book = document.getElementById('book');
const bookNavigation = document.querySelector('.book-navigation');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    totalPagesSpan.textContent = totalPages;
    updateNavigationButtons();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    book.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    book.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    // Add floating elements animation
    animateFloatingElements();
});

// Open book function
function openBook() {
    isBookOpen = true;
    
    // Animate cover opening
    cover.style.transform = 'rotateY(-180deg) translateZ(-200px)';
    cover.style.opacity = '0';
    
    // Show book
    setTimeout(() => {
        book.classList.add('open');
        showPage(1);
        
        // Show navigation and close button
        setTimeout(() => {
            bookNavigation.classList.add('visible');
            closeBtn.classList.add('visible');
        }, 800);
    }, 400);
}

// Close book function
function closeBook() {
    isBookOpen = false;
    
    // Hide navigation and close button
    bookNavigation.classList.remove('visible');
    closeBtn.classList.remove('visible');
    
    // Hide book
    book.classList.remove('open');
    
    // Reset cover
    setTimeout(() => {
        cover.style.transform = 'rotateY(0deg) translateZ(0px)';
        cover.style.opacity = '1';
        currentPage = 1;
        updateNavigationButtons();
    }, 800);
}

// Show specific page
function showPage(pageNumber) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show current page
    const currentPageElement = document.getElementById(`page${pageNumber}`);
    if (currentPageElement) {
        currentPageElement.classList.add('active');
    }
    
    // Update page indicator
    currentPageSpan.textContent = pageNumber;
    currentPage = pageNumber;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Add page turn animation
    if (currentPageElement) {
        currentPageElement.classList.add('page-turn');
        setTimeout(() => {
            currentPageElement.classList.remove('page-turn');
        }, 600);
    }
}

// Next page function
function nextPage() {
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
}

// Previous page function
function previousPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Update button styles
    if (prevBtn.disabled) {
        prevBtn.style.opacity = '0.5';
    } else {
        prevBtn.style.opacity = '1';
    }
    
    if (nextBtn.disabled) {
        nextBtn.style.opacity = '0.5';
    } else {
        nextBtn.style.opacity = '1';
    }
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    if (!isBookOpen) return;
    
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            nextPage();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousPage();
            break;
        case 'Escape':
            closeBook();
            break;
    }
}

// Touch/swipe navigation
function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next page
            nextPage();
        } else {
            // Swipe right - previous page
            previousPage();
        }
    }
}

// Floating elements animation
function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-heart, .floating-star, .floating-flower');
    
    floatingElements.forEach((element, index) => {
        // Randomize animation duration and delay
        const duration = 4 + Math.random() * 4;
        const delay = Math.random() * 2;
        
        element.style.animationDuration = `${duration}s`;
        element.style.animationDelay = `${delay}s`;
        
        // Add random movement
        setInterval(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        }, 8000 + Math.random() * 4000);
    });
}

// Add page flip sound effect (optional)
function playPageFlipSound() {
    // Create audio context for page flip sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Enhanced page transitions with sound
function enhancedPageTransition(newPage) {
    // Play page flip sound
    playPageFlipSound();
    
    // Add enhanced animation
    const currentPageElement = document.getElementById(`page${currentPage}`);
    const newPageElement = document.getElementById(`page${newPage}`);
    
    if (currentPageElement && newPageElement) {
        // Fade out current page
        currentPageElement.style.transition = 'opacity 0.3s ease';
        currentPageElement.style.opacity = '0';
        
        setTimeout(() => {
            showPage(newPage);
            currentPageElement.style.opacity = '1';
        }, 300);
    } else {
        showPage(newPage);
    }
}

// Add mouse hover effects for pages
document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    
    pages.forEach(page => {
        page.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
        });
        
        page.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        });
    });
});

// Add loading animation
window.addEventListener('load', function() {
    const bookContainer = document.querySelector('.book-container');
    bookContainer.style.opacity = '0';
    bookContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        bookContainer.style.transition = 'all 1s ease';
        bookContainer.style.opacity = '1';
        bookContainer.style.transform = 'translateY(0)';
    }, 100);
});

// Add parallax effect for floating elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const floatingElements = document.querySelectorAll('.floating-heart, .floating-star, .floating-flower');
    
    floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add click effects for buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style); 

// THEME SWITCHER (FAB + POPOVER)
const themeFab = document.getElementById('themeFab');
const themePopover = document.getElementById('themePopover');
const closeThemePopover = document.getElementById('closeThemePopover');
const themeSwitcher = document.getElementById('theme-switcher');

function setTheme(theme) {
    document.body.classList.remove('theme-default', 'theme-cute', 'theme-professional');
    switch (theme) {
        case 'cute':
            document.body.classList.add('theme-cute');
            break;
        case 'professional':
            document.body.classList.add('theme-professional');
            break;
        default:
            document.body.classList.add('theme-default');
    }
    localStorage.setItem('bookTheme', theme);
}

if (themeFab && themePopover && themeSwitcher) {
    themeFab.addEventListener('click', () => {
        themePopover.style.display = 'flex';
    });
    closeThemePopover.addEventListener('click', () => {
        themePopover.style.display = 'none';
    });
    themeSwitcher.addEventListener('change', e => {
        setTheme(e.target.value);
        themePopover.style.display = 'none';
    });
    // Load saved theme
    const savedTheme = localStorage.getItem('bookTheme') || 'default';
    themeSwitcher.value = savedTheme;
    setTheme(savedTheme);
}

// GUESTBOOK FEATURE
const guestbookForm = document.getElementById('guestbook-form');
const guestbookEntriesDiv = document.getElementById('guestbook-entries');
function loadGuestbook() {
    const entries = JSON.parse(localStorage.getItem('guestbookEntries') || '[]');
    guestbookEntriesDiv.innerHTML = '';
    entries.reverse().forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'guestbook-entry';
        let imgHTML = '';
        if (entry.image) {
            imgHTML = `<img src="${entry.image}" alt="Guest image" />`;
        }
        entryDiv.innerHTML = `
            ${imgHTML}
            <div class="entry-content">
                <div class="entry-name">${entry.name}</div>
                <div class="entry-message">${entry.message}</div>
                <div class="entry-date">${entry.date}</div>
            </div>
        `;
        guestbookEntriesDiv.appendChild(entryDiv);
    });
}
if (guestbookForm) {
    guestbookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('guest-name').value.trim();
        const message = document.getElementById('guest-message').value.trim();
        const imageInput = document.getElementById('guest-image');
        const date = new Date().toLocaleString();
        if (!name || !message) return;
        let image = '';
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                image = evt.target.result;
                saveGuestbookEntry(name, message, image, date);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveGuestbookEntry(name, message, image, date);
        }
        guestbookForm.reset();
    });
}
function saveGuestbookEntry(name, message, image, date) {
    const entries = JSON.parse(localStorage.getItem('guestbookEntries') || '[]');
    entries.push({ name, message, image, date });
    localStorage.setItem('guestbookEntries', JSON.stringify(entries));
    loadGuestbook();
}
loadGuestbook();

// Smooth scroll to guestbook
const guestbookLink = document.querySelector('.guestbook-link');
if (guestbookLink) {
    guestbookLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('guestbook').scrollIntoView({ behavior: 'smooth' });
    });
} 