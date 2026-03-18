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
const photographyImages = [
  '/images/photography/photo-01.jpg',
  '/images/photography/photo-02.jpg',
  '/images/photography/photo-03.jpg',
  '/images/photography/photo-04.jpg',
  '/images/photography/photo-05.jpg',
  '/images/photography/photo-06.jpg',
  '/images/photography/photo-07.jpg',
  '/images/photography/photo-08.jpg',
];

function App() {
  const container = useRef<HTMLDivElement>(null);
  const projectsMobileRef = useRef<HTMLDivElement>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [photographyBackdropImage] = useState(
    () => photographyImages[Math.floor(Math.random() * photographyImages.length)],
  );

  useEffect(() => {
    let refreshTimer: number | null = null;

    const onResize = () => {
      if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer);
      }

      // Recalculate scroll/pin values without hard reloading the whole page.
      refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 260);
    };

    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer);
      }
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const scroller = projectsMobileRef.current;
    if (!scroller) return;

    const updateActiveProject = () => {
      const cards = Array.from(scroller.children) as HTMLElement[];
      if (cards.length === 0) return;

      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let nearestIdx = 0;
      let nearestDist = Number.POSITIVE_INFINITY;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = idx;
        }
      });

      setActiveProjectIndex(nearestIdx);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveProject();
        ticking = false;
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (!window.matchMedia('(max-width: 1023px)').matches) return;
      const canScrollHorizontally = scroller.scrollWidth > scroller.clientWidth;
      if (!canScrollHorizontally) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      scroller.scrollLeft += event.deltaY;
      event.preventDefault();
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', updateActiveProject);
    updateActiveProject();

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      scroller.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', updateActiveProject);
    };
  }, []);

  const scrollToProjectCard = (idx: number) => {
    const scroller = projectsMobileRef.current;
    if (!scroller) return;
    const cards = Array.from(scroller.children) as HTMLElement[];
    const target = cards[idx];
    if (!target) return;
    scroller.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  };

  useGSAP(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.config({ limitCallbacks: true });

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    // Hero intro animation
    const hero = container.current?.querySelector<HTMLElement>('#hero');
    let rotatingIntervalId: number | null = null;
    let rotatingDelayCall: gsap.core.Tween | null = null;
    const heroPointerCleanups: Array<() => void> = [];
    if (hero) {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const heroKicker = hero.querySelector('.heroKickerAnimated');
      const heroChars = hero.querySelectorAll('.heroChar');
      const heroNameText = hero.querySelector('.heroNameText');
      const heroRoleStatic = hero.querySelector('.heroRoleStatic');
      const rotatingText = hero.querySelector<HTMLElement>('.heroRotatingText');
      const heroBody = hero.querySelector('.heroBodyAnimated');

      gsap.set(heroKicker, { opacity: 0, y: 20 });
      gsap.set(heroChars, { opacity: 0, y: 40, rotateY: -30 });
      gsap.set(heroNameText, { opacity: 0, y: 30 });
      gsap.set(heroRoleStatic, { opacity: 0 });
      gsap.set(rotatingText, { opacity: 0, x: -20 });
      gsap.set(heroBody, { opacity: 0, y: 20 });

      intro
        .to(heroKicker, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        .to(heroChars, {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power2.out',
        }, '-=0.2')
        .to(heroNameText, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.3')
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

        rotatingDelayCall = gsap.delayedCall(2.5, () => {
          rotatingIntervalId = window.setInterval(rotateWord, 2200);
        });
      }


      const decorItems = hero.querySelectorAll<HTMLElement>('.decorItem');
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

      const animConfigs: Record<string, { y?: number[]; x?: number[]; rotate?: number[]; scale?: number[]; duration: number }> = {
        decorBlob1: { scale: [0.9, 1.15], y: [-40, 40], duration: 6 },
        decorBlob2: { scale: [0.88, 1.12], y: [30, -30], duration: 8 },
        decorMain: { rotate: [0, 360], duration: 60 },
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
        decorCross1: { rotate: [0, 180], scale: [0.8, 1.2], y: [-20, 20], duration: 6 },
        decorCross2: { rotate: [0, -180], scale: [0.82, 1.18], y: [-18, 18], duration: 8 },
        decorCross3: { rotate: [0, 90], scale: [0.85, 1.15], y: [-15, 15], duration: 10 },
        decorRing1: { rotate: [0, -360], scale: [0.85, 1.15], y: [-25, 25], duration: 15 },
        decorRing2: { rotate: [0, 360], scale: [0.88, 1.12], y: [-20, 20], duration: 18 },
        decorRing3: { rotate: [0, -180], scale: [0.82, 1.18], y: [-22, 22], duration: 12 },
        decorDiamond1: { rotate: [-45, 45], scale: [0.75, 1.25], y: [-18, 18], duration: 4.5 },
        decorDiamond2: { rotate: [45, -45], scale: [0.8, 1.2], y: [-15, 15], duration: 5.5 },
        decorTriangle1: { rotate: [-20, 20], y: [-25, 25], x: [-15, 15], duration: 4 },
        decorTriangle2: { rotate: [20, -20], y: [-20, 20], x: [-12, 12], duration: 5 },
        decorCorner1: { scale: [0.85, 1.15], y: [-15, 15], duration: 4 },
        decorCorner2: { scale: [0.88, 1.12], y: [-12, 12], duration: 5 },
        decorArc1: { y: [-20, 20], x: [-15, 15], scale: [0.9, 1.1], duration: 3 },
        decorArc2: { y: [-18, 18], x: [-12, 12], scale: [0.92, 1.08], duration: 4 },
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

      if (!prefersReducedMotion) {
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
          const onLeave = () => {
            decorToX?.(0);
            decorToY?.(0);
            titleToX?.(0);
            titleToY?.(0);
          };
          hero.addEventListener('pointermove', onMove);
          hero.addEventListener('pointerleave', onLeave);
          heroPointerCleanups.push(() => {
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('pointerleave', onLeave);
          });
        }
      }

      // Scroll-linked hero fade
      const heroStack = hero.querySelector<HTMLElement>('.heroStack');
      if (heroStack) {
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

    // Section reveal
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

    // Horizontal gallery (desktop only, >=1024)
    const photoGallery = container.current?.querySelector<HTMLElement>('.photoGallery');
    const photoSection = container.current?.querySelector<HTMLElement>('#photography');
    
    if (photoGallery && photoSection) {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

      if (isDesktop) {
        const getScrollAmount = () => {
          const galleryWidth = photoGallery.scrollWidth;
          const viewportWidth = window.innerWidth;
          const galleryPadding = parseFloat(getComputedStyle(photoGallery).paddingLeft) || 0;
          return galleryWidth - viewportWidth + galleryPadding;
        };
        const travel = Math.max(getScrollAmount(), 0);
        if (travel > 0) {
          // Keep a brief head/tail hold for orientation, but avoid a sticky feel.
          const edgeHold = Math.round(Math.max(180, Math.min(320, window.innerHeight * 0.26)));
          const totalDistance = travel + edgeHold * 2;

          const horizontalTl = gsap.timeline({
            scrollTrigger: {
              trigger: photoSection,
              start: 'top top',
              end: `+=${totalDistance}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              fastScrollEnd: false,
              invalidateOnRefresh: true,
            },
          });

          horizontalTl
            .to(photoGallery, { x: 0, ease: 'none', duration: edgeHold })
            .to(photoGallery, { x: -travel, ease: 'none', duration: travel })
            .to(photoGallery, { x: -travel, ease: 'none', duration: edgeHold });
        }
      } else {
        // <=1023 uses native horizontal scroll; ensure no leftover desktop transform.
        gsap.set(photoGallery, { clearProps: 'transform' });
      }
    }
    // Section title accent line
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

    ScrollTrigger.refresh();

    // Cleanup
    return () => {
      if (rotatingIntervalId !== null) {
        window.clearInterval(rotatingIntervalId);
      }
      rotatingDelayCall?.kill();
      heroPointerCleanups.forEach((fn) => fn());
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.clearMatchMedia();
    };
  }, { scope: container, revertOnUpdate: true });

  return (
    <main ref={container}>
      {resumeSections.map((s) => (
        <Section
          key={s.id}
          id={s.id}
          title={s.title}
          bgColor={s.color}
          className={s.id === 'photography' ? 'sectionWithPhotoBackdrop' : ''}
          style={
            s.id === 'photography'
              ? ({ '--photo-backdrop-image': `url(${photographyBackdropImage})` } as React.CSSProperties)
              : undefined
          }
        >
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
                  專長 Web UI 與前端協作，能在設計階段納入元件化思維，讓設計到開發的轉換更順暢。
                </p>
                <div className="scrollHint" aria-hidden>
                  <span className="scrollDot" />
                </div>
              </div>
            </div>
          )}

          {s.id === 'about' && (
            <div className="aboutSection">
              <div className="content">
                <div className="aboutGrid">
                  <aside className="aboutPhotoSide">
                    <div className="aboutPhoto">
                      <img src="/samuel_pic.jpg" alt="Samuel Wang portrait" loading="lazy" />
                    </div>
                  </aside>
                  <div className="aboutMain">
                    <div className="aboutStoryGrid">
                      <div className="aboutBody">
                        <p className="body">
                          從事設計相關工作多年，職涯早期以網頁與平面設計為主，之後參與企業品牌、展覽視覺以及數位產品 UI 設計。過去曾任職於宏碁、正文科技、揚智科技等公司，接觸過不同規模的設計專案與產品開發流程。
                        </p>
                        <p className="body">
                          近幾年主要的工作重心放在 Web UI 設計與前端協作，實務上大量接觸 React 與 CSS 架構，建立與前端工程師更順暢的溝通方式，讓設計稿能更貼近實際開發流程並提升協作效率，同時累積更多產品開發相關經驗。目前希望能往資深產品設計或設計整合的角色發展，除了設計本身，也希望能參與更多產品規劃與跨部門合作的工作。
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
                            </div>
                          </li>
                          <li>
                            <span className="aboutTimelineYear">2015–2018</span>
                            <div className="aboutTimelineBody">
                              <p className="aboutTimelineCompany">揚智科技</p>
                              <p className="aboutTimelineRole">Senior Visual Designer</p>
                            </div>
                          </li>
                          <li>
                            <span className="aboutTimelineYear">2014–2015</span>
                            <div className="aboutTimelineBody">
                              <p className="aboutTimelineCompany">Acer 宏碁</p>
                              <p className="aboutTimelineRole">UI Designer</p>
                            </div>
                          </li>
                          <li>
                            <span className="aboutTimelineYear">2010–2014</span>
                            <div className="aboutTimelineBody">
                              <p className="aboutTimelineCompany">正文科技</p>
                              <p className="aboutTimelineRole">Visual Designer</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="skillsBlock">
                      <h3 className="skillsTitle">Skills</h3>
                      <div className="skillsGrid">
                        {profile.skillGroups.map((group) => (
                          <div key={group.title} className="skillsGroup">
                            <p className="skillsGroupTitle">{group.title}</p>
                            <ul className="skillsChips" aria-label={`${group.title} skills`}>
                              {group.items.map((item) => (
                                <li key={`${group.title}-${item}`} className="skillsChip">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {s.id === 'projects' && (
            <div className="projectsSection">
              <div className="content">
                <div className="projectsDesktop">
                  <div className="projectsGrid3">
                    {Array.from({ length: Math.ceil(profile.projects.length / 3) }).map((_, groupIdx) => {
                      const start = groupIdx * 3;
                      const group = profile.projects.slice(start, start + 3);
                      return (
                        <div key={`group-${start}`} className="projectsGroup">
                          <div className="projectsRow images">
                            {group.map((p, idx) => {
                              const isFirstProject = start + idx === 0;
                              const isSecondProject = start + idx === 1;
                              const isFifthProject = start + idx === 4;
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
                                      <img
                                        src={p.img}
                                        alt={p.title}
                                        className={`projectImg${isFirstProject ? ' projectImg--first' : ''}${isSecondProject ? ' projectImg--second' : ''}${isFifthProject ? ' projectImg--fifth' : ''}`}
                                      />
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
                                  <span className="projectType">{p.tags?.[0] ?? 'Case study'}</span>
                                </div>
                                <h4 className="projectTitle">{p.title}</h4>
                                <p className="projectDesc">
                                  {p.description ??
                                    '聚焦視覺系統與版面規範，建立一致的版面秩序與元件化規格，並能與前端協作落地。'}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="projectsMobileRail">
                  <div className="projectsMobile" aria-label="Project cards" ref={projectsMobileRef}>
                    {profile.projects.map((p, idx) => {
                      const isFirstProject = idx === 0;
                      const isSecondProject = idx === 1;
                      const isFifthProject = idx === 4;
                      return (
                        <a
                          key={`mobile-${p.title}-${idx}`}
                          className="projectCardLink"
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className="projectThumbWrap">
                            <div className="projectThumb" aria-hidden>
                              {p.img ? (
                                <img
                                  src={p.img}
                                  alt={p.title}
                                  className={`projectImg${isFirstProject ? ' projectImg--first' : ''}${isSecondProject ? ' projectImg--second' : ''}${isFifthProject ? ' projectImg--fifth' : ''}`}
                                />
                              ) : null}
                            </div>
                          </div>
                          <div className="projectCardText">
                            <div className="projectMeta">
                              <span className="projectType">{p.tags?.[0] ?? 'Case study'}</span>
                            </div>
                            <h4 className="projectTitle">{p.title}</h4>
                            <p className="projectDesc">
                              {p.description ??
                                '聚焦視覺系統與版面規範，建立一致的版面秩序與元件化規格，並能與前端協作落地。'}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
                <div className="projectsMobileDots" aria-label="Project slide indicators">
                  {profile.projects.map((dotProject, dotIdx) => (
                    <button
                      key={`dot-${dotProject.title}-${dotIdx}`}
                      type="button"
                      className={`projectsMobileDot${activeProjectIndex === dotIdx ? ' isActive' : ''}`}
                      onClick={() => scrollToProjectCard(dotIdx)}
                      aria-label={`查看第 ${dotIdx + 1} 個作品`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {s.id === 'photography' && (
            <div className="photographySection">
              <div className="photographyIntro content">
                <p className="body">
                  除了設計工作，攝影是我記錄生活與觀察世界的方式，這裡收錄了一些日常隨拍與旅行紀錄。
                </p>
              </div>
              <div className="photoGalleryWrapper">
                <div className="photoGallery">
                  <div className="photoSlide">
                    <img
                      src="/images/photography/photo-01.jpg"
                      alt="Photography cover 01"
                      loading="lazy"
                    />
                  </div>
                  <div className="photoSlide">
                    <img
                      src="/images/photography/photo-02.jpg"
                      alt="Photography cover 02"
                      loading="lazy"
                    />
                  </div>
                  <div className="photoSlide">
                    <img
                      src="/images/photography/photo-03.jpg"
                      alt="Photography cover 03"
                      loading="lazy"
                    />
                  </div>
                  <div className="photoSlide">
                    <img
                      src="/images/photography/photo-04.jpg"
                      alt="Photography cover 04"
                      loading="lazy"
                    />
                  </div>
                  <div className="photoSlide">
                    <img
                      src="/images/photography/photo-05.jpg"
                      alt="Photography cover 05"
                      loading="lazy"
                    />
                  </div>
                  <div className="photoSlide">
                    <img
                      src="/images/photography/photo-06.jpg"
                      alt="Photography cover 06"
                      loading="lazy"
                    />
                  </div>
                  <div className="photoSlide">
                    <img
                      src="/images/photography/photo-07.jpg"
                      alt="Photography cover 07"
                      loading="lazy"
                    />
                  </div>
                  <div className="photoSlide">
                    <img
                      src="/images/photography/photo-08.jpg"
                      alt="Photography cover 08"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {s.id === 'contact' && (
            <div className="contactSection">
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
                    <svg className="contactIcon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391s.497.426.641.747c.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922s.461.957.461 1.563c0 .496-.105.922-.285 1.278a2.3 2.3 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.3 5.3 0 0 1-1.278.176L0 12.803V3zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a1 1 0 0 0-.32-.355 1.8 1.8 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39c.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305zm6.858-.035q.428.427 1.278.426c.39 0 .746-.106 1.032-.286q.426-.32.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.1 4.1 0 0 1-1.527-.285 2.8 2.8 0 0 1-1.137-.782 2.85 2.85 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4 4 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.496.105.996.07 1.563h-5.15c0 .58.21 1.11.496 1.396m2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176s-.356.25-.496.39a.96.96 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978z"/>
                    </svg>
                    <span className="contactLinkText">Behance</span>
                  </a>
                ) : null}
                {profile.links.github ? (
                  <a className="contactLink" href={profile.links.github} target="_blank" rel="noreferrer">
                    <svg className="contactIcon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.595 2 12.262c0 4.533 2.865 8.379 6.839 9.736.5.095.682-.223.682-.496 0-.245-.009-.893-.014-1.752-2.782.618-3.369-1.37-3.369-1.37-.455-1.18-1.11-1.494-1.11-1.494-.908-.634.069-.621.069-.621 1.004.072 1.532 1.055 1.532 1.055.892 1.57 2.341 1.117 2.91.854.091-.664.349-1.118.635-1.375-2.22-.259-4.555-1.14-4.555-5.072 0-1.12.39-2.036 1.03-2.753-.103-.26-.446-1.302.098-2.714 0 0 .84-.276 2.75 1.051A9.35 9.35 0 0112 6.863c.85.004 1.707.116 2.507.34 1.909-1.327 2.748-1.051 2.748-1.051.545 1.412.202 2.454.1 2.714.64.717 1.028 1.633 1.028 2.753 0 3.943-2.338 4.81-4.566 5.064.359.317.679.942.679 1.9 0 1.371-.012 2.476-.012 2.813 0 .275.18.596.688.495C19.138 20.637 22 16.793 22 12.262 22 6.595 17.523 2 12 2z" />
                    </svg>
                    <span className="contactLinkText">GitHub</span>
                  </a>
                ) : null}
                {profile.links.linkedin ? (
                  <a className="contactLink" href={profile.links.linkedin} target="_blank" rel="noreferrer">
                    <svg className="contactIcon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.32V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.46v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                    </svg>
                    <span className="contactLinkText">LinkedIn</span>
                  </a>
                ) : null}
                {profile.links.cv ? (
                  <a className="contactLink" href={profile.links.cv} target="_blank" rel="noreferrer">
                    <svg className="contactIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 3v5h5M9 13h6M9 17h6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="contactLinkText">CV</span>
                  </a>
                ) : null}
                </div>
              </div>
            </div>
          )}
        </Section>
      ))}
    </main>
  );
}

export default App
