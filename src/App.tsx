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
          const sectionTheme = el.getAttribute('data-theme');
          setNavTheme(sectionTheme === 'dark' ? 'dark' : 'light');
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

    // Horizontal gallery (desktop only)
    const photoGallery = container.current?.querySelector<HTMLElement>('.photoGallery');
    const photoSection = container.current?.querySelector<HTMLElement>('#photography');
    const isMobile = window.innerWidth <= 768;
    
    if (photoGallery && photoSection && !isMobile) {
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
    // Nav dots
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

    // Project thumbnail hover
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
                  我把複雜需求轉成可實作、可驗證的介面系統。
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
                  <div className="aboutPhoto" aria-hidden />
                </aside>
                <div className="aboutMain">
                  <div className="aboutStoryGrid">
                    <div className="aboutBody">
                      <p className="body">
                        我把設計視為「讓決策更清楚」的工具，而不只是視覺包裝。我的核心工作是把模糊需求轉成可被使用、可被實作、可被迭代的介面系統。
                      </p>
                      <p className="body">
                        職涯橫跨企業品牌、展覽視覺與數位產品，近年聚焦 Web UI 與前端協作，透過元件化與清楚交付規格，讓團隊更快把設計轉成可驗證的產品成果。
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
                          <p className="skillsLine">{group.items.join(' · ')}</p>
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
          )}
        </Section>
      ))}
    </main>
  );
}

export default App
