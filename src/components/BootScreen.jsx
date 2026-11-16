import { useEffect, useRef, useState } from "react";
import BootModule from "./BootModule";
import { audioEngine } from "../audio/AudioEngine";
import { BOOT_MODULES, BOOT_TIMING } from "../data/bootData";
import { SYSTEM_IDENTITY } from "../data/systemIdentity";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const BOOT_MODE_KEY = "hasnainos-boot-mode";

export default function BootScreen({ onEnter }) {
  const readyMessageRef = useRef(null);
  const cancelledRef = useRef(false);
  const startedRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [moduleProgress, setModuleProgress] = useState(BOOT_MODULES.map(() => 0));
  const [completedModules, setCompletedModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(-1);
  const [systemReady, setSystemReady] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [bootMode, setBootMode] = useState(() => {
    try {
      return localStorage.getItem(BOOT_MODE_KEY) === "classic" ? "classic" : "jarvis";
    } catch {
      return "jarvis";
    }
  });

  const switchBootMode = () => {
    setBootMode((current) => {
      const next = current === "jarvis" ? "classic" : "jarvis";
      try {
        localStorage.setItem(BOOT_MODE_KEY, next);
      } catch {
        // The mode switch still works for this visit if storage is unavailable.
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      audioEngine.stop();
    };
  }, []);

  const startSystem = () => {
    if (startedRef.current) return;

    // This click is the explicit browser gesture that unlocks audio.
    startedRef.current = true;
    audioEngine.unlock();
    setStarted(true);

    const boot = async () => {
      await audioEngine.playAndWait("/sounds/voice/initializing-system.mp3");
      await wait(350);
      if (cancelledRef.current) return;

      for (let index = 0; index < BOOT_MODULES.length; index++) {
        if (cancelledRef.current) return;

        setCurrentModule(index);
        const startTime = performance.now();

        await new Promise((resolve) => {
          const animate = (now) => {
            if (cancelledRef.current) return resolve();

            const progress = Math.min(
              100,
              Math.round(((now - startTime) / BOOT_TIMING.moduleLoad) * 100)
            );

            setModuleProgress((previous) => {
              const next = [...previous];
              next[index] = progress;
              return next;
            });

            if (progress < 100) {
              requestAnimationFrame(animate);
            } else {
              resolve();
            }
          };

          requestAnimationFrame(animate);
        });

        if (cancelledRef.current) return;

        setCompletedModules((previous) => [...previous, index]);
        await audioEngine.playAndWait(BOOT_MODULES[index].voice);
        await wait(BOOT_TIMING.moduleGap);
      }

      setCurrentModule(-1);
      if (cancelledRef.current) return;

      readyMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      await wait(700);
      if (cancelledRef.current) return;

      setSystemReady(true);
      await audioEngine.playAndWait("/sounds/voice/system-ready.mp3");
      await wait(700);
      if (cancelledRef.current) return;

      setShowIdentity(true);
      await audioEngine.playAndWait(
        "/sounds/voice/welcome-to-hasnain's portfolio.mp3"
      );
    };

    boot();
  };

  const renderModules = () => (
    <section className="boot-modules">
      {BOOT_MODULES.map((module, index) => (
        <BootModule
          key={module.name}
          module={module}
          progress={moduleProgress[index]}
          completed={completedModules.includes(index)}
          active={currentModule === index}
        />
      ))}
    </section>
  );

  const renderReady = () => (
    <section
      ref={readyMessageRef}
      className={`ready-message ${systemReady ? "visible" : ""}`}
    >
      <div className="system-status">
        <span className="status-dot" />
        SYSTEM READY
      </div>
      {showIdentity && (
        <div className="boot-identity">
          <h1>{SYSTEM_IDENTITY.owner}</h1>
          <p>{SYSTEM_IDENTITY.role}</p>
          <button type="button" className="enter-button" onClick={onEnter}>
            ENTER SYSTEM
          </button>
        </div>
      )}
    </section>
  );

  if (bootMode === "classic") {
    return (
      <main className="boot-screen">
        <button type="button" className="boot-mode-switch classic-mode-switch" onClick={switchBootMode}>
          SWITCH TO J.A.R.V.I.S. MODE
        </button>
        <section className="boot-panel">
          <div className="welcome-banner">WELCOME</div>
          <header className="boot-header">
            <div className="boot-title">{SYSTEM_IDENTITY.name}</div>
            <div className="boot-subtitle">
              {started ? "SYSTEM INITIALIZATION" : "SYSTEM STANDBY"}
            </div>
          </header>
          {!started ? (
            <section className="system-start">
              <div className="start-scan">
                <span className="start-scan-line" />
                <span className="start-core" />
              </div>
              <p className="start-description">
                System is standing by. Initialize to begin the portfolio experience.
              </p>
              <button type="button" className="start-button" onClick={startSystem}>
                <span>START SYSTEM</span>
                <span className="start-button-arrow">→</span>
              </button>
              <div className="start-hint">TAP / CLICK TO INITIALIZE</div>
            </section>
          ) : (
            <>
              {renderModules()}
              {renderReady()}
            </>
          )}
          <footer className="system-version">
            {SYSTEM_IDENTITY.name} {SYSTEM_IDENTITY.version}
          </footer>
        </section>
      </main>
    );
  }

  return (
    <main className="boot-screen jarvis-boot-screen">
      <div className="jarvis-ambient jarvis-ambient-one" />
      <div className="jarvis-ambient jarvis-ambient-two" />
      <div className="jarvis-scanlines" />
      <button type="button" className="boot-mode-switch jarvis-mode-switch" onClick={switchBootMode}>
        CLASSIC BOOT
      </button>

      <section className="jarvis-shell">
        <div className="jarvis-topline">
          <span>STARK INDUSTRIES // PERSONAL INTERFACE</span>
          <span>J.A.R.V.I.S. OS <i className="jarvis-live-dot" /> ONLINE</span>
        </div>

        <header className="jarvis-heading">
          <div className="jarvis-eyebrow">JUST A RATHER VERY INTELLIGENT SYSTEM</div>
          <h1 className="jarvis-title">J.A.R.V.I.S.</h1>
          <div className="jarvis-title-rule"><span /></div>
          <p className="jarvis-subtitle">{SYSTEM_IDENTITY.name.toUpperCase()}</p>
        </header>

        {!started ? (
          <section className="jarvis-start">
            <div className="jarvis-reactor" aria-hidden="true">
              <div className="reactor-ring reactor-ring-outer" />
              <div className="reactor-ring reactor-ring-middle" />
              <div className="reactor-ring reactor-ring-inner" />
              <div className="reactor-spokes" />
              <div className="reactor-core"><span /></div>
              <div className="reactor-orbit reactor-orbit-one" />
              <div className="reactor-orbit reactor-orbit-two" />
            </div>
            <div className="jarvis-system-state">
              <span className="jarvis-live-dot" />
              ALL SYSTEMS STANDING BY
            </div>
            <p className="jarvis-intro">
              Good evening. All systems are ready when you are.
            </p>
            <button type="button" className="jarvis-init-button" onClick={startSystem}>
              <span className="init-bracket">[</span>
              INITIALIZE SYSTEM
              <span className="init-arrow">↗</span>
              <span className="init-bracket">]</span>
            </button>
            <div className="jarvis-hint">AUDIO INTERFACE WILL ACTIVATE ON INITIALIZATION</div>
          </section>
        ) : (
          <section className="jarvis-boot-progress">
            <div className="jarvis-progress-heading">
              <span>INITIALIZATION SEQUENCE</span>
              <span>{completedModules.length} / {BOOT_MODULES.length} MODULES ONLINE</span>
            </div>
            {renderModules()}
            {renderReady()}
          </section>
        )}

        <footer className="jarvis-footer">
          <span>INTERFACE DESIGNED FOR {SYSTEM_IDENTITY.owner.toUpperCase()}</span>
          <span>{SYSTEM_IDENTITY.version} // SECURE CONNECTION</span>
        </footer>
      </section>
    </main>
  );
}
