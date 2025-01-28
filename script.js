// DOM要素の取得
const cursor = document.querySelector('.cursor');
const links = document.querySelectorAll('a, button');
const splitTypes = document.querySelectorAll('.line');
const workItems = document.querySelectorAll('.work-item');
const skillCategories = document.querySelectorAll('.skill-category');
const scrollElements = document.querySelectorAll('.js-scroll');
const filterButtons = document.querySelectorAll('.filter-button');
const navLinks = document.querySelectorAll('.nav-link, .logo');
const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');
const navRight = document.querySelector('.nav-right');
const parallaxElements = document.querySelectorAll('[data-scroll-speed]');

// カーソル関連の変数
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let lastScroll = 0;

// カスタムカーソルのアニメーション
gsap.to({}, 0.016, {
    repeat: -1,
    onRepeat: function() {
        cursorX += (mouseX - cursorX) / 8;
        cursorY += (mouseY - cursorY) / 8;
        gsap.set(cursor, {
            left: cursorX,
            top: cursorY
        });
    }
});

// マウス移動時のカーソル更新
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
});

// リンクホバー時のカーソル効果
links.forEach(link => {
    link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// Locomotive Scroll初期化
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    lerp: 0.05,
    multiplier: 0.5,
    smartphone: {
        smooth: true
    },
    tablet: {
        smooth: true
    }
});

// GSAPアニメーション設定
gsap.registerPlugin(ScrollTrigger);

// ヒーローセクションのテキストアニメーション
const tl = gsap.timeline();
splitTypes.forEach((char, i) => {
    const text = new SplitType(char, { types: 'chars' });
    tl.from(text.chars, {
        opacity: 0,
        yPercent: 100,
        rotateX: -90,
        stagger: 0.02,
        duration: 1,
        ease: 'power4.out'
    }, i * 0.1);
});

// 作品一覧のスクロールアニメーション
workItems.forEach((item) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'top center',
            scrub: 1
        },
        y: 100,
        opacity: 0
    });
});

// スキルセクションのアニメーション
skillCategories.forEach((category, index) => {
    gsap.from(category, {
        scrollTrigger: {
            trigger: category,
            start: 'top bottom',
            end: 'top center',
            scrub: 1
        },
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 1
    });
});

// スクロールアニメーションのユーティリティ関数
const elementInView = (el, offset = 0) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (1 - offset)
    );
};

const displayScrollElement = (element) => {
    element.classList.add('scrolled');
};

const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
};

// スクロールアニメーションの処理
const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 0.25)) {
            displayScrollElement(el);
        }
    });
};

// スクロールイベントの設定
window.addEventListener('scroll', () => {
    handleScrollAnimation();
});

// 初期表示時のアニメーション実行
handleScrollAnimation();

// Locomotive ScrollとScrollTriggerの連携
ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
        return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    },
    pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
});

// ScrollTriggerの更新
ScrollTrigger.addEventListener('refresh', () => scroll.update());
ScrollTrigger.refresh();

// Navbar scroll effect
nav.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ナビゲーションリンクのホバーエフェクト
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            scale: 3,
            duration: 0.3
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            scale: 1,
            duration: 0.3
        });
    });
});

// プロジェクトフィルター
const workItemsArray = Array.from(workItems);
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // アクティブクラスの更新
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // プロジェクトのフィルタリング
        workItemsArray.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                gsap.to(item, {
                    opacity: 1,
                    duration: 0.5,
                    y: 0,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(item, {
                    opacity: 0.3,
                    duration: 0.5,
                    y: 50,
                    ease: 'power2.out'
                });
            }
        });
    });
});

// スクロールインジケーターのアニメーション
gsap.to('.scroll-indicator', {
    y: 20,
    opacity: 0,
    ease: 'power2.inOut',
    repeat: -1,
    duration: 1.5
});

// モバイルメニューの切り替え
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navRight.classList.toggle('active');
});

// パララックス効果
parallaxElements.forEach(element => {
    const speed = element.dataset.scrollSpeed;
    gsap.to(element, {
        y: (i, target) => -scroll.scroll.instance.scroll.y * speed,
        ease: 'none',
        scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});
