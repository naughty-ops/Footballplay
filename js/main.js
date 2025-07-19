// Main application logic
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const navIndicator = document.querySelector('.nav-indicator');
  const navbar = document.querySelector('.navbar');
  const viewMoreBtn = document.getElementById('viewMoreBtn');
  const hiddenNews = document.querySelectorAll('.hidden-news');
  const statsTabs = document.querySelectorAll('.stats-tab');
  const statsTabContents = document.querySelectorAll('.stats-tab-content');
  const scrollToTopBtn = document.getElementById('scrollToTop');
  const groupBtns = document.querySelectorAll('.group-btn');
  const roundBtns = document.querySelectorAll('.round-btn');
  
  // Initialize notifications for completed matches
  showMatchCompletionNotifications();
  
  // Stats tabs functionality
  statsTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      statsTabs.forEach(t => t.classList.remove('active'));
      statsTabContents.forEach(c => c.classList.remove('active'));
      
      this.classList.add('active');
      const tabId = this.dataset.tab + 'Tab';
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Initially hide all news except first two
  hiddenNews.forEach(news => {
    news.style.display = 'none';
  });
  
  // Improved View More button functionality
  viewMoreBtn.addEventListener('click', function() {
    let allHiddenVisible = true;
    hiddenNews.forEach(news => {
      if (news.style.display === 'none') {
        allHiddenVisible = false;
      }
    });
    
    hiddenNews.forEach(news => {
      news.style.display = allHiddenVisible ? 'none' : 'block';
    });
    
    this.innerHTML = allHiddenVisible ? 'View More News <i class="fas fa-chevron-down"></i>' : 
      'Show Less <i class="fas fa-chevron-up"></i>';
    this.classList.toggle('expanded');
  });
  
  // Set initial indicator position
  const activeItem = document.querySelector('.nav-item.active');
  moveIndicator(activeItem);
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (this.classList.contains('admin-link')) return;
      
      // Remove active from all
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      moveIndicator(this);
      createRipple(e, this);
      loadContent(this.dataset.tab);
    });
  });
  
  // Scroll-to-top button functionality
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Group Navigation Filtering
  groupBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      groupBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentGroup = this.dataset.group;
      filterFixtures(currentGroup, currentRound);
    });
  });
  
  // Round Navigation Filtering
  roundBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      roundBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentRound = this.dataset.round;
      filterFixtures(currentGroup, currentRound);
    });
  });
  
  function moveIndicator(item) {
    const itemRect = item.getBoundingClientRect();
    const navbarRect = navbar.getBoundingClientRect();
    navIndicator.style.width = `${itemRect.width}px`;
    navIndicator.style.left = `${itemRect.left - navbarRect.left}px`;
  }
  
  function createRipple(e, element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - element.getBoundingClientRect().left - radius}px`;
    ripple.style.top = `${e.clientY - element.getBoundingClientRect().top - radius}px`;
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
  
  function loadContent(tab) {
    document.querySelectorAll('.content-container').forEach(content => {
      content.style.display = 'none';
    });
    document.querySelector(`.${tab}-content`).style.display = 'block';
    
    // Generate fixtures when fixture tab is loaded
    if (tab === 'fixture') {
      generateFixtureCards();
    }
  }
  
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.nav-item.active');
    moveIndicator(activeItem);
  });
});

// Auto scroll
document.addEventListener('DOMContentLoaded', function() {
  const scroller = document.getElementById('scroller');
  const images = scroller.querySelectorAll('img');
  let currentIndex = 0;
  
  function autoScroll() {
    currentIndex = (currentIndex + 1) % images.length;
    scroller.scrollTo({
      left: currentIndex * scroller.offsetWidth,
      behavior: 'smooth'
    });
  }
  
  let scrollInterval = setInterval(autoScroll, 3000);
  
  scroller.addEventListener('mouseenter', () => clearInterval(scrollInterval));
  scroller.addEventListener('touchstart', () => clearInterval(scrollInterval));
  
  scroller.addEventListener('mouseleave', () => {
    scrollInterval = setInterval(autoScroll, 3000);
  });
  
  scroller.addEventListener('scroll', () => {
    currentIndex = Math.round(scroller.scrollLeft / scroller.offsetWidth);
  });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === document.getElementById('playerModal')) {
    closePlayerModal();
  }
});