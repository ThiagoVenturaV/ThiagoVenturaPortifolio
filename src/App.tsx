import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import KatanaModel from './components/KatanaModel';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import { useLenis } from './hooks/useLenis';

function App() {
  const [loading, setLoading] = useState(true);
  useLenis();

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <CustomCursor />
      <Navbar />

      {/* Three.js Canvas - fixed, rendered ABOVE the hero background but below hero text */}
      <Canvas
        className="three-canvas"
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 8,
          pointerEvents: 'none',
        }}
      >
        <Suspense fallback={null}>
          <KatanaModel />
        </Suspense>
      </Canvas>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />

        <footer className="footer">
          <div className="footer-content">
            <a href="#hero" className="footer-logo" aria-label="Voltar para o topo">
              <img
                src="/logozoroquadradaSemFundo.png"
                alt="Logo Thiago Ventura"
                className="footer-logo-img"
              />
            </a>
            <p>
              Desenvolvido por Thiago Ventura <br/>
              © {new Date().getFullYear()} — Todos os direitos reservados.
            </p>
            <p className="footer-back-to-top">
              <a href="#hero">Voltar ao topo ↑</a>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

export default App;
