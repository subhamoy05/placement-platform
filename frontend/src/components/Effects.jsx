import React, { useEffect, useRef, useState } from "react";

/**
 * Checks whether user prefers reduced motion
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Particle network connecting nearby nodes
 */
export function ParticleNetwork() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate particles
    const particleCount = Math.min(50, Math.floor((width * height) / 25000));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? "#D4FF24" : i % 3 === 1 ? "#1558C9" : "#60a5fa",
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(21, 88, 201, ${0.25 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="particle-network-canvas"
      aria-hidden="true"
    />
  );
}

/**
 * Global subtle cursor spotlight following mouse
 */
export function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", handleMouseMove);
    return () => window.removeEventListener("pointermove", handleMouseMove);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="cursor-spotlight"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * 3D Tilt Card with cursor-following shine effect
 */
export function TiltCard({ children, className = "", style = {}, ...props }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, px: 50, py: 50, isHovered: false });
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setCoords({ x: rotateX, y: rotateY, px, py, isHovered: true });
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, x: 0, y: 0, isHovered: false }));
  };

  const transform =
    coords.isHovered && !reducedMotion
      ? `perspective(1000px) rotateX(${coords.x.toFixed(2)}deg) rotateY(${coords.y.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";

  return (
    <div
      ref={cardRef}
      className={`tilt-card-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform,
        transition: coords.isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        "--mouse-x": `${coords.px}%`,
        "--mouse-y": `${coords.py}%`,
      }}
      {...props}
    >
      <div
        className="tilt-card-shine"
        style={{
          opacity: coords.isHovered && !reducedMotion ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
}

/**
 * Magnetic button that subtly pulls toward the cursor
 */
export function MagneticButton({ children, className = "", style = {}, onClick, ...props }) {
  const btnRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (reducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * 0.28;
    const dy = (e.clientY - centerY) * 0.28;
    setOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      className={`magnetic-button ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...style,
        transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`,
        transition: offset.x === 0 ? "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" : "transform 0.08s ease-out",
      }}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Letter by letter blur-in animated text
 */
export function LetterBlurIn({ text, className = "", delay = 0 }) {
  const letters = Array.from(text);
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`letter-blur-in-container ${className}`}>
      {letters.map((char, index) => (
        <span
          key={index}
          className="letter-blur-in-char"
          style={{
            animationDelay: `${delay + index * 0.045}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/**
 * Looping typewriter effect for rotating roles
 */
export function TypewriterText({ roles = [], typingSpeed = 70, deleteSpeed = 40, pauseTime = 1800 }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedText(roles[0] || "");
      return;
    }

    const currentRole = roles[roleIndex] || "";
    let timer;

    if (!isDeleting && displayedText === currentRole) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      const delta = isDeleting ? deleteSpeed : typingSpeed;
      timer = setTimeout(() => {
        setDisplayedText(
          currentRole.substring(0, displayedText.length + (isDeleting ? -1 : 1))
        );
      }, delta);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex, roles, typingSpeed, deleteSpeed, pauseTime, reducedMotion]);

  return (
    <span className="typewriter-wrapper">
      <span className="typewriter-text">{displayedText}</span>
      <span className="typewriter-cursor">|</span>
    </span>
  );
}

/**
 * Scroll reveal component with fade from blur
 */
export function ScrollReveal({ children, className = "", delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const el = domRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={domRef}
      className={`scroll-blur-reveal ${isVisible ? "revealed" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/**
 * Animated numerical count-up when scrolled into view
 */
export function AnimatedCountUp({ value, prefix = "", suffix = "", duration = 1200 }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (elRef.current) observer.observe(elRef.current);
    return () => observer.disconnect();
  }, [hasStarted, reducedMotion, value]);

  useEffect(() => {
    if (!hasStarted || reducedMotion) return;

    let start = 0;
    const startTime = performance.now();
    let frameId;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * value);

      setCount(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [hasStarted, value, duration, reducedMotion]);

  return (
    <span ref={elRef} className="animated-counter-value">
      {prefix}
      {reducedMotion ? value.toLocaleString() : count.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * Animated skill bar filling smoothly when scrolled into view
 */
export function AnimatedSkillBar({ label, percentage, color = "#D4FF24" }) {
  const [filled, setFilled] = useState(false);
  const barRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setFilled(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setFilled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div ref={barRef} className="skill-bar-wrapper">
      <div className="skill-bar-header">
        <span className="skill-name">{label}</span>
        <span className="skill-pct">{percentage}%</span>
      </div>
      <div className="skill-track">
        <div
          className="skill-fill"
          style={{
            width: filled || reducedMotion ? `${percentage}%` : "0%",
            background: color,
            boxShadow: `0 0 12px ${color}88`,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Tech stack marquee running continuously and pausing on hover
 */
export function TechMarquee() {
  const techStack = [
    { name: "React 19", icon: "⚛️" },
    { name: "TypeScript", icon: "📘" },
    { name: "Python", icon: "🐍" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Docker", icon: "🐳" },
    { name: "Tailwind CSS", icon: "🌊" },
    { name: "Node.js", icon: "🟢" },
    { name: "Redis", icon: "⚡" },
    { name: "System Design", icon: "🏛️" },
    { name: "Algorithms", icon: "🧮" },
    { name: "GraphQL", icon: "◈" },
    { name: "AWS Cloud", icon: "☁️" },
  ];

  const items = [...techStack, ...techStack];

  return (
    <div className="tech-marquee-wrapper" aria-label="Technology Stack">
      <div className="tech-marquee-track">
        {items.map((tech, index) => (
          <div key={index} className="tech-chip">
            <span className="tech-chip-icon">{tech.icon}</span>
            <span className="tech-chip-name">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
