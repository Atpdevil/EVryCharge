"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import GoogleAuthButton from "./GoogleAuthButton";

export default function HologramCard({ role = "user" /* "user" or "host" */ }) {
  // form state
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const shellRef = useRef(null);
  const wrapRef = useRef(null);

  // tilt engine (simple smoothing)
  const posRef = useRef({ curX: 0, curY: 0, tx: 0, ty: 0, raf: 0 });

  const setVarsFromXY = useCallback((x, y) => {
    const shell = shellRef.current;
    const wrap = wrapRef.current;
    if (!shell || !wrap) return;
    const width = shell.clientWidth || 1;
    const height = shell.clientHeight || 1;

    const percentX = Math.min(100, Math.max(0, (100 / width) * x));
    const percentY = Math.min(100, Math.max(0, (100 / height) * y));
    const centerX = percentX - 50;
    const centerY = percentY - 50;

    wrap.style.setProperty("--pointer-x", `${percentX}%`);
    wrap.style.setProperty("--pointer-y", `${percentY}%`);
    wrap.style.setProperty("--background-x", `${Math.round(35 + (percentX / 100) * 30)}%`);
    wrap.style.setProperty("--background-y", `${Math.round(35 + (percentY / 100) * 30)}%`);
    wrap.style.setProperty("--pointer-from-center", `${Math.min(1, Math.hypot(centerX, centerY) / 50)}`);
    wrap.style.setProperty("--pointer-from-top", `${percentY / 100}`);
    wrap.style.setProperty("--pointer-from-left", `${percentX / 100}`);
    wrap.style.setProperty("--rotate-x", `${(-centerY / 3).toFixed(2)}deg`);
    wrap.style.setProperty("--rotate-y", `${(centerX / 4).toFixed(2)}deg`);
  }, []);

  const step = useCallback((ts) => {
    const p = posRef.current;
    // simple lerp
    p.curX += (p.tx - p.curX) * 0.12;
    p.curY += (p.ty - p.curY) * 0.12;
    setVarsFromXY(p.curX, p.curY);

    // stop if close
    if (Math.abs(p.tx - p.curX) > 0.01 || Math.abs(p.ty - p.curY) > 0.01) {
      p.raf = requestAnimationFrame(step);
    } else {
      p.raf = 0;
    }
  }, [setVarsFromXY]);

  const pokeTarget = useCallback((x, y) => {
    const p = posRef.current;
    p.tx = x;
    p.ty = y;
    if (!p.raf) p.raf = requestAnimationFrame(step);
  }, [step]);

useEffect(() => {
  const card = shellRef.current;
  if (!card) return;

  const handleMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / 20) * -1; 
    const rotateY = (x - centerX) / 20;

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(20px)
    `;
  };

  const handleLeave = () => {
    card.style.transform = `
      perspective(900px)
      rotateX(0deg)
      rotateY(0deg)
      translateZ(0px)
    `;
  };

  card.addEventListener("pointermove", handleMove);
  card.addEventListener("pointerleave", handleLeave);

  return () => {
    card.removeEventListener("pointermove", handleMove);
    card.removeEventListener("pointerleave", handleLeave);
  };
}, []);

  // Signup handlers
  const handleSignup = () => {
    const user = { role, ...form };
    try {
      localStorage.setItem("ev_user", JSON.stringify(user));
    } catch (e) {
      console.warn("localStorage failed", e);
    }
    // redirect
    window.location.href = role === "host" ? "/host/select-vehicle" : "/user/select-vehicle";
  };

  const handleGoogle = (data) => {
    const user = {
      role,
      name: data.name,
      email: data.email,
      picture: data.picture
    };
    try {
      localStorage.setItem("ev_user", JSON.stringify(user));
    } catch {}
    window.location.href = role === "host" ? "/host/select-vehicle" : "/user/select-vehicle";
  };

  return (
    <div ref={wrapRef} className="holo-wrap">
      <div ref={shellRef} className="holo-shell" role="region" aria-label="Signup card">
        <div className="holo-behind" aria-hidden="true" />
        <div className="holo-card">
          <div className="holo-inner">
            <h1 className="holo-title">Sign up as {role === "host" ? "Host" : "User"}</h1>

            <div className="form">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                className="field"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                className="field"
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                className="field"
              />

              <button className="cta" onClick={handleSignup}>
                Signup
              </button>

              <div className="or">OR</div>

              <div className="google-wrap">
                <GoogleAuthButton onSuccess={handleGoogle} />
              </div>
            </div>
          </div>

          <div className="holo-shine" aria-hidden="true" />
          <div className="holo-glare" aria-hidden="true" />
        </div>
      </div>

      {/* scoped styles so you can paste without editing global CSS */}
      <style jsx>{`
        .holo-wrap {
          --pointer-x: 50%;
          --pointer-y: 50%;
          --pointer-from-center: 0;
          --pointer-from-top: 0.5;
          --pointer-from-left: 0.5;
          --rotate-x: 0deg;
          --rotate-y: 0deg;
          --background-x: 50%;
          --background-y: 50%;
          --behind-glow: rgba(0, 255, 150, 0.12);
        }

        .holo-shell {
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          perspective: 900px;
          transform-style: preserve-3d;
          pointer-events: auto;
        }

        .holo-card {
          position: relative;
          border-radius: 16px;
          overflow: visible;
          transform: translateZ(0);
          transition: transform 400ms cubic-bezier(.2,.9,.2,1), box-shadow 300ms;
          transform-origin: center;
        }

        .holo-card:hover {
          /* subtle pop */
          transform: translateZ(12px) rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
        }

        .holo-behind {
          position: absolute;
          inset: -40px -40px auto -40px;
          height: 220px;
          background: radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(0, 255, 150, 0.16), transparent 40%);
          filter: blur(30px) saturate(1.2);
          z-index: 0;
          pointer-events: none;
        }

        .holo-inner {
          position: relative;
          z-index: 2;
          padding: 28px;
          border-radius: 32px;
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,245,255,0.8));
          box-shadow:
            0 18px 40px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.6),
            inset 0 -8px 24px rgba(0,0,0,0.06);
          transform: translateZ(16px);
        }

        .holo-title {
          margin: 0 0 12px 0;
          font-size: 22px;
          color: #04211a;
          font-weight: 700;
          text-align: center;
          text-shadow: 0 1px 0 rgba(255,255,255,0.6);
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 6px;
        }

        .field {
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid rgba(16,24,32,0.15);
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9));
          outline: none;
          font-size: 15px;
          color: #0b1720;
          transition: box-shadow 160ms, transform 160ms;
        }

        .field:focus {
          box-shadow: 0 4px 18px rgba(0, 255, 150, 0.10);
          transform: translateY(-1px);
          border-color: rgba(0, 200, 120, 0.65);
        }

        .cta {
          margin-top: 6px;
          padding: 12px 16px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #1f6cff, #2aa7ff);
          color: white;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(45, 120, 255, 0.24);
          transition: transform 140ms, box-shadow 140ms;
        }

        .cta:active {
          transform: translateY(1px);
          box-shadow: 0 6px 16px rgba(45, 120, 255, 0.18);
        }

        .or {
          text-align: center;
          font-size: 13px;
          color: rgba(20,20,20,0.55);
          margin-top: 6px;
        }

        .google-wrap {
          margin-top: 4px;
          display: flex;
          justify-content: center;
        }

        /* holographic shine and glare */
        .holo-shine {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image:
            radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(255,255,255,0.25), transparent 15%),
            linear-gradient(120deg, rgba(0,255,150,0.04), rgba(0,120,255,0.03) 35%, rgba(255,255,255,0.02));
          mix-blend-mode: screen;
          filter: blur(10px);
          transform: translateZ(4px);
          opacity: 0.9;
          transition: opacity 400ms;
        }

        .holo-glare {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 60%;
          background: linear-gradient(120deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          transform: translateZ(20px) rotate(-6deg);
          mix-blend-mode: overlay;
          filter: blur(24px);
          z-index: 3;
          pointer-events: none;
        }

        /* responsive */
        @media (max-width: 640px) {
          .holo-shell { max-width: 360px; }
          .holo-inner { padding: 18px; }
          .holo-title { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}
