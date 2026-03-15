import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Section } from './components/section'
import { Decor } from './components/Decor';
import { profile, resumeSections } from './data/profile';
import './App.css'

gsap.registerPlugin(ScrollTrigger);

const navSections = ['hero', 'about', 'projects', 'photography', 'contact'];
const navLabels = ['Hello!', 'Resume', 'Graphic', 'Photography', 'Contact'];

function App() {
  const container = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      
      for (let i = navSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(navSections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(navSections[i]);
          const bgColor = el.closest('section')?.getAttribute('data-bg');
          setNavTheme(bgColor === '#1D1D1D' ? 'dark' : 'light');
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    // 清理之前的 ScrollTrigger 實例（防止 HMR 或重新渲染時衝突）
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // ScrollTrigger + Lenis（標準 smooth / inertia scrolling 組合）
    ScrollTrigger.config({ limitCallbacks: true });

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      // gsap.ticker 傳 seconds，Lenis 要 milliseconds
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // 首屏：個人化的動態文字效果
    const hero = container.current?.querySelector<HTMLElement>('#hero');
    if (hero) {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 元素選取
      const heroKicker = hero.querySelector('.heroKickerAnimated');
      const heroChars = hero.querySelectorAll('.heroChar');
      const heroNameText = hero.querySelector('.heroNameText');
      const heroRoleStatic = hero.querySelector('.heroRoleStatic');
      const rotatingText = hero.querySelector<HTMLElement>('.heroRotatingText');
      const heroBody = hero.querySelector('.heroBodyAnimated');

      // 初始狀態
      gsap.set(heroKicker, { opacity: 0, y: 20 });
      gsap.set(heroChars, { opacity: 0, y: 40, rotateY: -30 });
      gsap.set(heroNameText, { opacity: 0, y: 30 });
      gsap.set(heroRoleStatic, { opacity: 0 });
      gsap.set(rotatingText, { opacity: 0, x: -20 });
      gsap.set(heroBody, { opacity: 0, y: 20 });

      // 進場動畫序列
      intro
        // Kicker 先出現
        .to(heroKicker, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        // "Hi, I'm" 字母滑入
        .to(heroChars, {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power2.out',
        }, '-=0.2')
        // "Samuel" 進場
        .to(heroNameText, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.3')
        // "a" + 旋轉職稱
        .to(heroRoleStatic, {
          opacity: 1,
          duration: 0.3,
        }, '-=0.2')
        .to(rotatingText, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.2')
        // 副標題
        .to(heroBody, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        }, '-=0.2')
        .fromTo(
          hero.querySelector('.scrollHint'),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.1',
        );

      // 旋轉文字切換動畫
      if (rotatingText) {
        const words = rotatingText.dataset.words?.split(',') || ['Designer'];
        let currentIndex = 0;

        const rotateWord = () => {
          currentIndex = (currentIndex + 1) % words.length;
          const nextWord = words[currentIndex];

          gsap.timeline()
            .to(rotatingText, {
              y: -20,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in',
            })
            .call(() => {
              rotatingText.textContent = nextWord;
            })
            .fromTo(rotatingText,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        };

        gsap.delayedCall(2.5, () => {
          setInterval(rotateWord, 2200);
        });
      }


      // 幾何裝飾進場動畫
      const decorItems = hero.querySelectorAll<HTMLElement>('.decorItem');
      
      // 進場：依序淡入 + 縮放
      gsap.fromTo(
        decorItems,
        { opacity: 0, scale: 0.5, rotate: -15 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
          stagger: { each: 0.08, from: 'random' },
          delay: 0.3,
        }
      );

      // 各元素獨立的持續動畫
      const animConfigs: Record<string, { y?: number[]; x?: number[]; rotate?: number[]; scale?: number[]; duration: number }> = {
        // 大型色塊
        decorBlob1: { scale: [0.9, 1.15], y: [-40, 40], duration: 6 },
        decorBlob2: { scale: [0.88, 1.12], y: [30, -30], duration: 8 },
        decorMain: { rotate: [0, 360], duration: 60 },
        // 浮動點 - 增加移動幅度
        decorDot1: { y: [-45, 45], x: [-35, 35], scale: [0.7, 1.3], duration: 2.2 },
        decorDot2: { y: [-50, 50], x: [-40, 40], scale: [0.72, 1.28], duration: 2.5 },
        decorDot3: { y: [-40, 40], x: [-30, 30], scale: [0.75, 1.25], duration: 2.8 },
        decorDot4: { y: [-48, 48], x: [-38, 38], scale: [0.68, 1.32], duration: 2.0 },
        decorDot5: { y: [-38, 38], x: [-45, 45], scale: [0.74, 1.26], duration: 2.6 },
        decorDot6: { y: [-35, 35], x: [-28, 28], scale: [0.78, 1.22], duration: 3.0 },
        decorDot7: { y: [-42, 42], x: [-25, 25], scale: [0.7, 1.3], duration: 2.3 },
        decorDot8: { y: [-32, 32], x: [-35, 35], scale: [0.76, 1.24], duration: 2.9 },
        decorDot9: { y: [-46, 46], x: [-22, 22], scale: [0.72, 1.28], duration: 1.8 },
        decorDot10: { y: [-28, 28], x: [-32, 32], scale: [0.8, 1.2], duration: 3.2 },
        decorDot11: { y: [-40, 40], x: [-42, 42], scale: [0.66, 1.34], duration: 1.7 },
        decorDot12: { y: [-35, 35], x: [-25, 25], scale: [0.78, 1.22], duration: 2.7 },
        decorDot13: { y: [-30, 30], x: [-28, 28], scale: [0.74, 1.26], duration: 2.2 },
        decorDot14: { y: [-25, 25], x: [-22, 22], scale: [0.8, 1.2], duration: 2.5 },
        // 額外浮動點
        decorDot15: { y: [-42, 42], x: [-32, 32], scale: [0.72, 1.28], duration: 2.0 },
        decorDot16: { y: [-35, 35], x: [-38, 38], scale: [0.75, 1.25], duration: 2.4 },
        decorDot17: { y: [-38, 38], x: [-28, 28], scale: [0.78, 1.22], duration: 2.8 },
        decorDot18: { y: [-28, 28], x: [-42, 42], scale: [0.7, 1.3], duration: 1.8 },
        decorDot19: { y: [-46, 46], x: [-30, 30], scale: [0.74, 1.26], duration: 2.1 },
        decorDot20: { y: [-25, 25], x: [-35, 35], scale: [0.8, 1.2], duration: 3.0 },
        decorDot21: { y: [-32, 32], x: [-25, 25], scale: [0.76, 1.24], duration: 3.2 },
        decorDot22: { y: [-35, 35], x: [-46, 46], scale: [0.68, 1.32], duration: 1.9 },
        decorDot23: { y: [-42, 42], x: [-38, 38], scale: [0.72, 1.28], duration: 2.3 },
        decorDot24: { y: [-22, 22], x: [-28, 28], scale: [0.82, 1.18], duration: 2.7 },
        // 十字
        decorCross1: { rotate: [0, 180], scale: [0.8, 1.2], y: [-20, 20], duration: 6 },
        decorCross2: { rotate: [0, -180], scale: [0.82, 1.18], y: [-18, 18], duration: 8 },
        decorCross3: { rotate: [0, 90], scale: [0.85, 1.15], y: [-15, 15], duration: 10 },
        // 圓環
        decorRing1: { rotate: [0, -360], scale: [0.85, 1.15], y: [-25, 25], duration: 15 },
        decorRing2: { rotate: [0, 360], scale: [0.88, 1.12], y: [-20, 20], duration: 18 },
        decorRing3: { rotate: [0, -180], scale: [0.82, 1.18], y: [-22, 22], duration: 12 },
        // 菱形
        decorDiamond1: { rotate: [-45, 45], scale: [0.75, 1.25], y: [-18, 18], duration: 4.5 },
        decorDiamond2: { rotate: [45, -45], scale: [0.8, 1.2], y: [-15, 15], duration: 5.5 },
        // 三角形
        decorTriangle1: { rotate: [-20, 20], y: [-25, 25], x: [-15, 15], duration: 4 },
        decorTriangle2: { rotate: [20, -20], y: [-20, 20], x: [-12, 12], duration: 5 },
        // 角落
        decorCorner1: { scale: [0.85, 1.15], y: [-15, 15], duration: 4 },
        decorCorner2: { scale: [0.88, 1.12], y: [-12, 12], duration: 5 },
        // 弧線
        decorArc1: { y: [-20, 20], x: [-15, 15], scale: [0.9, 1.1], duration: 3 },
        decorArc2: { y: [-18, 18], x: [-12, 12], scale: [0.92, 1.08], duration: 4 },
        // 螺旋點群
        decorSpiral: { rotate: [0, 360], scale: [0.8, 1.2], y: [-15, 15], duration: 10 },
      };

      decorItems.forEach((el) => {
        const classList = Array.from(el.classList);
        const decorClass = classList.find((c) => c.startsWith('decor') && c !== 'decorItem');
        if (!decorClass) return;

        const config = animConfigs[decorClass];
        if (!config) return;

        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        
        if (config.y) {
          tl.to(el, { y: config.y[1], duration: config.duration, ease: 'sine.inOut' }, 0);
        }
        if (config.x) {
          tl.to(el, { x: config.x[1], duration: config.duration * 0.8, ease: 'sine.inOut' }, 0);
        }
        if (config.rotate) {
          // 判斷是否為波浪線（需要來回擺動）或其他元素（持續旋轉）
          const isWave = decorClass.startsWith('decorWave');
          if (isWave) {
            gsap.set(el, { rotate: config.rotate[0] });
            tl.to(el, { rotate: config.rotate[1], duration: config.duration, ease: 'sine.inOut' }, 0);
          } else {
            gsap.to(el, {
              rotate: config.rotate[1],
              duration: config.duration,
              ease: 'none',
              repeat: -1,
            });
          }
        }
        if (config.scale) {
          tl.to(el, { scale: config.scale[1], duration: config.duration * 0.6, ease: 'sine.inOut' }, 0);
        }
      });

      // 滑鼠微視差（快速但平滑）：讓 hero 有「跟著呼吸」的互動感
      const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if (!prefersReduced) {
        const decorRoot = hero.querySelector<HTMLElement>('.decor');
        const heroTitle = hero.querySelector<HTMLElement>('.heroTitleAnimated');
        
        if (decorRoot || heroTitle) {
          const decorToX = decorRoot ? gsap.quickTo(decorRoot, 'x', { duration: 0.55, ease: 'power3' }) : null;
          const decorToY = decorRoot ? gsap.quickTo(decorRoot, 'y', { duration: 0.55, ease: 'power3' }) : null;
          const titleToX = heroTitle ? gsap.quickTo(heroTitle, 'x', { duration: 0.8, ease: 'power2' }) : null;
          const titleToY = heroTitle ? gsap.quickTo(heroTitle, 'y', { duration: 0.8, ease: 'power2' }) : null;
          
          const onMove = (e: PointerEvent) => {
            const rect = hero.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            decorToX?.(nx * 28);
            decorToY?.(ny * 22);
            titleToX?.(nx * -8);
            titleToY?.(ny * -6);
          };
          hero.addEventListener('pointermove', onMove);
          hero.addEventListener('pointerleave', () => {
            decorToX?.(0);
            decorToY?.(0);
            titleToX?.(0);
            titleToY?.(0);
          });
        }
      }

      const heroStack = hero.querySelector<HTMLElement>('.heroStack');
      if (heroStack) {
        // 往下時 Hero 文字自然上推淡出，銜接下一段（不 pin 卡片）
        gsap.to(heroStack, {
          yPercent: -35,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.9,
          },
        });
        gsap.to(hero.querySelector('.scrollHint'), {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top 10%',
            end: 'top -10%',
            scrub: 0.9,
          },
        });
      }
    }

    // 進場動畫：用 batch 減少 ScrollTrigger 數量
    ScrollTrigger.batch('.content:not(.hero)', {
      start: 'top 75%',
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true },
        );
      },
    });


    // Photography 橫向畫廊 - Desktop 使用 ScrollTrigger，Mobile 使用原生水平滾動
    const photoGallery = container.current?.querySelector<HTMLElement>('.photoGallery');
    const photoSection = container.current?.querySelector<HTMLElement>('#photography');
    const isMobile = window.innerWidth <= 768;
    
    if (photoGallery && photoSection && !isMobile) {
      // Desktop: 垂直滾動觸發橫向移動
      const getScrollAmount = () => {
        const galleryWidth = photoGallery.scrollWidth;
        const viewportWidth = window.innerWidth;
        const galleryPadding = parseFloat(getComputedStyle(photoGallery).paddingLeft) || 0;
        return galleryWidth - viewportWidth + galleryPadding;
      };

      gsap.to(photoGallery, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: photoSection,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }
    // Mobile: 不設置 ScrollTrigger，使用 CSS 原生水平滾動

    // 導航小圓點跳動動畫
    const allNavDots = gsap.utils.toArray<HTMLElement>('.navDot');
    if (allNavDots.length > 0) {
      gsap.to(allNavDots, {
        y: -4,
        duration: 0.4,
        ease: 'power1.inOut',
        stagger: {
          each: 0.08,
          repeat: -1,
          yoyo: true,
        },
      });
    }

    // 標題裝飾線段動畫 - 持續的脈動伸縮效果
    const titleLines = gsap.utils.toArray<HTMLElement>('.titleLine');
    if (titleLines.length > 0) {
      gsap.to(titleLines, {
        width: 48,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    // Projects 圖片 hover：用 GSAP 做 zoom-in + 微微亮度提升
    const thumbLinks = gsap.utils.toArray<HTMLElement>('.projectThumbLink');
    const hoverCleanups: Array<() => void> = [];
    thumbLinks.forEach((link) => {
      const thumb = link.querySelector<HTMLElement>('.projectThumb');
      if (!thumb) return;
      const hoverAnim = gsap.to(thumb, {
        scale: 1.04,
        filter: 'brightness(1.05)',
        duration: 0.35,
        ease: 'power2.out',
        paused: true,
        transformOrigin: '50% 50%',
      });
      const onEnter = () => hoverAnim.play();
      const onLeave = () => hoverAnim.reverse();
      link.addEventListener('mouseenter', onEnter);
      link.addEventListener('mouseleave', onLeave);
      hoverCleanups.push(() => {
        link.removeEventListener('mouseenter', onEnter);
        link.removeEventListener('mouseleave', onLeave);
      });
    });

    // 確保所有 ScrollTrigger 正確初始化
    ScrollTrigger.refresh();

    // cleanup：還原 Lenis、hover listeners、ScrollTrigger 與 ticker
    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      hoverCleanups.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.clearMatchMedia();
    };
  }, { scope: container, revertOnUpdate: true });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main ref={container}>
      {/* 固定導航列 */}
      <nav className="fixedNav" data-theme={navTheme}>
        {navSections.map((id, i) => (
          <button
            key={id}
            className={`navItem ${activeSection === id ? 'active' : ''}`}
            onClick={() => scrollToSection(id)}
          >
            <span className="navDots">
              <span className="navDot"></span>
              <span className="navDot"></span>
              <span className="navDot"></span>
            </span>
            {navLabels[i]}
          </button>
        ))}
      </nav>

      {resumeSections.map((s) => (
        <Section key={s.id} id={s.id} title={s.title} bgColor={s.color}>
          {s.id === 'hero' && (
            <div className="content hero">
              <Decor className="heroDecor" />
              <div className="heroStack">
                <p className="heroKicker heroKickerAnimated">Web UI Designer & Developer</p>
                <h1 className="heroTitle heroTitleAnimated">
                  <span className="heroLine heroLineGreeting">
                    {'Hi, I\'m'.split('').map((char, i) => (
                      <span key={`h-${i}`} className="heroChar" data-char={char}>
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </span>
                  <span className="heroLine heroLineName">
                    <span className="heroNameWrapper">
                      <span className="heroNameText">Samuel</span>
                    </span>
                  </span>
                  <span className="heroLine heroLineRole">
                    <span className="heroRoleStatic">a </span>
                    <span className="heroRotatingWrapper">
                      <span className="heroRotatingText" data-words="Designer,Developer,Creator,Problem Solver">
                        Designer
                      </span>
                    </span>
                  </span>
                </h1>
                <p className="heroBody heroBodyAnimated">
                  專注於 Web UI 設計與前端開發，將設計想法轉化為流暢的互動體驗。
                </p>
                <div className="scrollHint" aria-hidden>
                  <span className="scrollDot" />
                </div>
              </div>
            </div>
          )}

          {s.id === 'about' && (
            <div className="content">
              <div className="aboutGrid">
                <aside className="aboutPhotoSide">
                  <div className="aboutPhoto">
                    <img className="aboutPhotoImg" />
                  </div>
                </aside>
                <div className="aboutMain">
                  <div className="aboutBody">
                    <p className="body">
                      從事設計相關工作多年，職涯早期以網頁與平面設計為主，之後參與企業品牌、展覽視覺以及數位產品 UI 設計。過去曾任職於宏碁、正文科技、揚智科技等公司，接觸過不同規模的設計專案與產品開發流程。
                    </p>
                    <p className="body">
                      近幾年主要的工作重心放在 Web UI 設計與前端協作，實務上大量接觸 React 與 CSS 架構，建立與前端工程師更順暢的溝通方式，讓設計稿能更貼近實際開發流程並提升協作效率。
                    </p>
                    <p className="body">
                      目前希望能往資深產品設計或設計整合的角色發展，除了設計本身，也希望能參與更多產品規劃與跨部門合作的工作。
                    </p>
                  </div>

                  <div className="experienceBlock">
                    <h3 className="skillsTitle">Experience</h3>
                    <ul className="aboutTimeline">
                      <li>
                        <span className="aboutTimelineYear">2018–2026</span>
                        <div className="aboutTimelineBody">
                          <p className="aboutTimelineCompany">軒昂股份有限公司</p>
                          <p className="aboutTimelineRole">Web UI Designer</p>
                          <p className="aboutTimelineDesc">Figma 設計稿轉 React 元件，協助優化網站介面與使用者體驗。</p>
                        </div>
                      </li>
                      <li>
                        <span className="aboutTimelineYear">2015–2018</span>
                        <div className="aboutTimelineBody">
                          <p className="aboutTimelineCompany">揚智科技</p>
                          <p className="aboutTimelineRole">Senior Visual Designer</p>
                          <p className="aboutTimelineDesc">主導國際展覽主視覺與攤位設計，負責企業識別與官網設計。</p>
                        </div>
                      </li>
                      <li>
                        <span className="aboutTimelineYear">2014–2015</span>
                        <div className="aboutTimelineBody">
                          <p className="aboutTimelineCompany">Acer 宏碁</p>
                          <p className="aboutTimelineRole">UI Designer</p>
                          <p className="aboutTimelineDesc">負責 BYOC 雲端產品 APP UI 設計與設計規範建立。</p>
                        </div>
                      </li>
                      <li>
                        <span className="aboutTimelineYear">2010–2014</span>
                        <div className="aboutTimelineBody">
                          <p className="aboutTimelineCompany">正文科技</p>
                          <p className="aboutTimelineRole">Visual Designer</p>
                          <p className="aboutTimelineDesc">企業品牌與產品視覺設計，包含網站、展覽與產品 UI。</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="skillsBlock">
                    <h3 className="skillsTitle">Skills</h3>
                    <div className="skillsGrid">
                      {profile.skillGroups.map((group) => (
                        <div key={group.title} className="skillsGroup">
                          <p className="skillsGroupTitle">{group.title}</p>
                          <div className="skillsPills">
                            {group.items.map((item) => (
                              <span key={item} className="pill">{item}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {s.id === 'projects' && (
            <div className="content">
              <div className="projectsGrid4">
                {Array.from({ length: Math.ceil(profile.projects.length / 4) }).map((_, groupIdx) => {
                  const start = groupIdx * 4;
                  const group = profile.projects.slice(start, start + 4);
                  return (
                    <div key={`group-${start}`} className="projectsGroup">
                      <div className="projectsRow images">
                        {group.map((p) => {
                          return (
                            <a
                              key={`img-${p.title}`}
                              className="projectThumbLink"
                              href={p.href}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={p.title}
                            >
                              <div className="projectThumb" aria-hidden>
                                {p.img ? (
                                  <img src={p.img} alt={p.title} className="projectImg" />
                                ) : null}
                              </div>
                            </a>
                          );
                        })}
                      </div>

                      <div className="projectsRow texts">
                        {group.map((p) => (
                          <a
                            key={`txt-${p.title}`}
                            className="projectTextLink"
                            href={p.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="projectMeta">
                              <span className="projectYear">{p.year ?? '—'}</span>
                              <span className="projectDot">·</span>
                              <span className="projectType">{p.tags?.[0] ?? 'Case study'}</span>
                            </div>
                            <h4 className="projectTitle">{p.title}</h4>
                            <p className="projectDesc">
                              假文案：聚焦視覺系統與版面規範，建立一致的版面秩序與元件化規格，並能與前端協作落地。
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {s.id === 'photography' && (
            <div className="photographySection">
              <div className="photographyIntro content">
                <p className="body">
                  除了設計工作，攝影是我記錄生活與觀察世界的方式。這裡收錄了一些日常隨拍與旅行紀錄。
                </p>
              </div>
              <div className="photoGalleryWrapper">
                <div className="photoGallery">
                  <div className="photoSlide">
                    <div className="photoPlaceholder">
                      <span className="photoPlaceholderText">01</span>
                    </div>
                  </div>
                  <div className="photoSlide">
                    <div className="photoPlaceholder">
                      <span className="photoPlaceholderText">02</span>
                    </div>
                  </div>
                  <div className="photoSlide">
                    <div className="photoPlaceholder">
                      <span className="photoPlaceholderText">03</span>
                    </div>
                  </div>
                  <div className="photoSlide">
                    <div className="photoPlaceholder">
                      <span className="photoPlaceholderText">04</span>
                    </div>
                  </div>
                  <div className="photoSlide">
                    <div className="photoPlaceholder">
                      <span className="photoPlaceholderText">05</span>
                    </div>
                  </div>
                  <div className="photoSlide">
                    <div className="photoPlaceholder">
                      <span className="photoPlaceholderText">06</span>
                    </div>
                  </div>
                  <div className="photoSlide">
                    <div className="photoPlaceholder">
                      <span className="photoPlaceholderText">07</span>
                    </div>
                  </div>
                  <div className="photoSlide">
                    <div className="photoPlaceholder">
                      <span className="photoPlaceholderText">08</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {s.id === 'contact' && (
            <div className="content">
              <div className="contactLinks">
                <a className="contactLink" href={`mailto:${profile.email}`}>
                  <svg className="contactIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="contactLinkText">{profile.email}</span>
                </a>
                {profile.links.behance ? (
                  <a className="contactLink" href={profile.links.behance} target="_blank" rel="noreferrer">
                    <svg className="contactIcon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.211.994 1.738 2.041 1.738.79 0 1.474-.362 1.797-.908h3.918zM15.97 13.553h5.096c-.09-1.146-.808-1.74-1.997-1.74-1.052 0-1.895.544-2.099 1.74zM9.089 5.073H2V19h7.089c4.174 0 5.282-2.766 5.282-4.446 0-2.291-1.453-3.282-2.47-3.645 1.017-.362 2.045-1.348 2.045-3.089 0-1.68-1.109-2.747-4.857-2.747zm.524 5.747H5v-2.82h4.416c.994 0 1.652.358 1.652 1.31 0 .95-.495 1.51-1.455 1.51zm-.29 5.68H5v-3.18h4.324c1.168 0 1.652.695 1.652 1.59 0 .943-.525 1.59-1.652 1.59z"/>
                    </svg>
                    <span className="contactLinkText">Behance</span>
                  </a>
                ) : null}
              </div>
            </div>
          )}
        </Section>
      ))}
    </main>
  );
}

export default App
