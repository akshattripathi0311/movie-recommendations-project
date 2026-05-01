// --- NAVBAR SCROLL EFFECT ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- IMAGE SKELETON LOADER REMOVAL ---
// Called directly from HTML onload event
function removeSkeleton(imgElement) {
    imgElement.parentElement.classList.remove('skeleton');
}

// --- FAVORITES TOGGLE (Heart Icon) ---
function toggleFav(event, element) {
    event.stopPropagation(); // Prevents the modal from opening when clicking the heart
    element.classList.toggle('active');
}

// --- MODAL LOGIC ---
function openModal(title, writer, rating, summary, imgSrc) {
    const modal = document.getElementById('movieModal');
    const modalImg = document.getElementById('modalImg');

    // 1. Populate text immediately
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalWriter').textContent = writer;
    document.getElementById('modalRating').textContent = '★ ' + rating;
    document.getElementById('modalSummary').textContent = summary;

    // 2. Prevent Flicker: Hide the image visually before setting a new source
    modalImg.style.opacity = '0';
    modalImg.style.display = 'block'; // Ensure it's visible in the layout

    // 3. Preload the new image in the background
    const tempImage = new Image();
    
    tempImage.onload = function() {
        // Once fully loaded, attach it to the visible image tag and fade it in
        modalImg.src = imgSrc;
        modalImg.style.opacity = '1';
        modalImg.style.display = 'block';
    };
    
    tempImage.onerror = function() {
        // Fallback: If image link is broken, still show the poster with a placeholder
        modalImg.style.opacity = '1';
        modalImg.style.display = 'block';
        modalImg.src = imgSrc; // Still attempt to load the image
    };

    // Trigger the image load
    tempImage.src = imgSrc;

    // 4. Open the modal smoothly while the image loads in the background
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('movieModal');
    const modalImg = document.getElementById('modalImg');
    
    // Close the modal
    modal.classList.remove('active');

    // Prevent the OLD poster from flashing the next time you open a different movie
    setTimeout(() => {
        modalImg.style.opacity = '0';
        modalImg.src = ''; 
    }, 300); // Wait for the close animation to finish before clearing
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeModal();
});

// --- CATEGORY TAB FILTERING ---
const tabs = document.querySelectorAll('.tab-btn');
const cards = document.querySelectorAll('.movie-card');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab style
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter logic
        const filterValue = tab.getAttribute('data-filter');
        cards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-genre') === filterValue) {
                card.style.display = 'block';
                // Reset animation for filtered items
                setTimeout(() => card.style.opacity = '1', 50); 
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    });
});

// --- LIVE SEARCH FILTERING ---
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    cards.forEach(card => {
        // Grabbing the title text from the specific card
        const title = card.querySelector('.movie-title').innerText.toLowerCase();
        
        if (title.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// --- SCROLL ANIMATIONS (Intersection Observer) ---
// This makes sections smoothly fade in and slide up as you scroll down
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Triggers when 15% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach((section) => {
    observer.observe(section);
});
// --- TRENDING SCROLL FOCUS ANIMATION (Massive Scale) ---
const trendingSection = document.getElementById('trending');
const trendingRow = document.querySelector('.trending-row');

if (trendingSection && trendingRow) {
    const trendingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // User scrolled to the section: trigger massive scale
                trendingRow.classList.add('focused-scale');
                
                // Calculate the exact center of the row and smoothly scroll to it
                setTimeout(() => {
                    const centerScrollPosition = (trendingRow.scrollWidth - trendingRow.clientWidth) / 2;
                    trendingRow.scrollTo({
                        left: centerScrollPosition,
                        behavior: 'smooth'
                    });
                }, 100); // Tiny delay ensures the CSS gap applies before measuring
                
            } else {
                // User scrolled away: shrink back to normal
                trendingRow.classList.remove('focused-scale');
            }
        });
    }, {
        // Triggers when 40% of the section is visible (more sensitive than before)
        threshold: 0.4 
    });

    trendingObserver.observe(trendingSection);
}
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. EXPLORE ARCHIVE BUTTON FUNCTIONALITY ---
    const exploreBtn = document.getElementById('exploreArchiveBtn');
    
    // Change 'archive' to 'gallery' or whatever ID wraps your movie grid
    const targetSection = document.getElementById('archive') || document.getElementById('gallery'); 

    if (exploreBtn && targetSection) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Smoothly scrolls the target section into view
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // --- 2. SMOOTH FADE-IN ANIMATION OBSERVER ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Triggers when 20% of the element hits the screen
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it fades in
            }
        });
    }, observerOptions);

    // Attach observer to the welcome section (and anything else with fade-in-up)
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => scrollObserver.observe(el));

});