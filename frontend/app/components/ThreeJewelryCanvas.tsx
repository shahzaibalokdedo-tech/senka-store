"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RefreshCw, Eye, ShieldCheck } from "lucide-react";

export type MetalType = "gold" | "rosegold" | "platinum" | "blackgold";
export type GemType = "diamond" | "emerald" | "ruby" | "sapphire";

interface ThreeJewelryCanvasProps {
  initialMetal?: MetalType;
  initialGem?: GemType;
  height?: string;
  showControls?: boolean;
}

const metalColors: Record<MetalType, { color: number; roughness: number; metalness: number; label: string }> = {
  gold: { color: 0xE2C074, roughness: 0.15, metalness: 0.95, label: "18K Gold" },
  rosegold: { color: 0xE8A598, roughness: 0.2, metalness: 0.9, label: "Rose Gold" },
  platinum: { color: 0xE5E7EB, roughness: 0.1, metalness: 0.98, label: "Platinum" },
  blackgold: { color: 0x333338, roughness: 0.25, metalness: 0.85, label: "Obsidian Gold" },
};

const gemColors: Record<GemType, { color: number; emissive: number; label: string }> = {
  diamond: { color: 0xFFFFFF, emissive: 0x222222, label: "Brilliant Diamond" },
  emerald: { color: 0x10B981, emissive: 0x054F35, label: "Colombian Emerald" },
  ruby: { color: 0xEF4444, emissive: 0x6B1111, label: "Burmese Ruby" },
  sapphire: { color: 0x2563EB, emissive: 0x0A2540, label: "Royal Sapphire" },
};

export default function ThreeJewelryCanvas({
  initialMetal = "gold",
  initialGem = "diamond",
  height = "420px",
  showControls = true,
}: ThreeJewelryCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [metal, setMetal] = useState<MetalType>(initialMetal);
  const [gem, setGem] = useState<GemType>(initialGem);
  const [isRotating, setIsRotating] = useState(true);

  const ringMeshRef = useRef<THREE.Mesh | null>(null);
  const gemMeshRef = useRef<THREE.Mesh | null>(null);
  const metalMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const gemMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const heightPx = currentMount.clientHeight || 420;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Clear element before appending
    currentMount.innerHTML = "";
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff5e6, 3.5);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const goldFillLight = new THREE.PointLight(0xe2c074, 4, 20);
    goldFillLight.position.set(-5, -2, -3);
    scene.add(goldFillLight);

    const gemHighlightLight = new THREE.PointLight(0xffffff, 5, 10);
    gemHighlightLight.position.set(0, 3, 4);
    scene.add(gemHighlightLight);

    // 5. Jewelry Geometry Construction
    // Ring Band
    const ringGeo = new THREE.TorusGeometry(2, 0.28, 32, 100);
    const metalMat = new THREE.MeshStandardMaterial({
      color: metalColors[metal].color,
      roughness: metalColors[metal].roughness,
      metalness: metalColors[metal].metalness,
    });
    metalMatRef.current = metalMat;

    const ringMesh = new THREE.Mesh(ringGeo, metalMat);
    ringMesh.rotation.x = Math.PI / 3;
    ringMeshRef.current = ringMesh;
    scene.add(ringMesh);

    // Gemstone (Facet Octahedron)
    const gemGeo = new THREE.OctahedronGeometry(0.85, 2);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: gemColors[gem].color,
      emissive: gemColors[gem].emissive,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 1.2,
      ior: 2.4, // Diamond refractive index
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
    gemMatRef.current = gemMat;

    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.set(0, 2.1, 0.4);
    gemMeshRef.current = gemMesh;
    ringMesh.add(gemMesh);

    // Gem Crown Prongs
    const prongMat = metalMat;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const prongGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 16);
      const prong = new THREE.Mesh(prongGeo, prongMat);
      prong.position.set(Math.cos(angle) * 0.7, 1.9, Math.sin(angle) * 0.7);
      ringMesh.add(prong);
    }

    // 6. Particle Dust
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xe2c074,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Mouse Drag Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !ringMesh) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      ringMesh.rotation.y += deltaX * 0.01;
      ringMesh.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElem = currentMount;
    domElem.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (ringMesh && isRotating && !isDragging) {
        ringMesh.rotation.y += 0.008;
      }

      if (particleSystem) {
        particleSystem.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [isRotating]);

  // Update materials when state changes
  useEffect(() => {
    if (metalMatRef.current) {
      metalMatRef.current.color.setHex(metalColors[metal].color);
      metalMatRef.current.roughness = metalColors[metal].roughness;
      metalMatRef.current.metalness = metalColors[metal].metalness;
    }
  }, [metal]);

  useEffect(() => {
    if (gemMatRef.current) {
      gemMatRef.current.color.setHex(gemColors[gem].color);
      gemMatRef.current.emissive.setHex(gemColors[gem].emissive);
    }
  }, [gem]);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          borderRadius: "var(--radius-lg)",
        }}
      />

      {/* Floating 3D Badge Overlay */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          background: "rgba(7, 7, 9, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--gold-line)",
          borderRadius: "var(--radius-full)",
          fontSize: "0.75rem",
          color: "var(--gold-light)",
          letterSpacing: "0.08em",
          pointerEvents: "none",
        }}
      >
        <Sparkles size={14} color="var(--gold-primary)" className="animate-spin-slow" />
        <span>REAL-TIME 3D CANVAS</span>
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            width: "90%",
            maxWidth: "480px",
            background: "rgba(14, 14, 19, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--gold-line)",
            borderRadius: "var(--radius-md)",
            padding: "12px 18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--gold-primary)" }}>
              Customize Metal
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {(Object.keys(metalColors) as MetalType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMetal(m)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.72rem",
                    border: metal === m ? "1px solid var(--gold-primary)" : "1px solid rgba(255,255,255,0.1)",
                    background: metal === m ? "var(--gold-glow)" : "transparent",
                    color: metal === m ? "var(--gold-light)" : "var(--text-muted)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {metalColors[m].label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--gold-primary)" }}>
              Gemstone
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {(Object.keys(gemColors) as GemType[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGem(g)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.72rem",
                    border: gem === g ? "1px solid var(--gold-primary)" : "1px solid rgba(255,255,255,0.1)",
                    background: gem === g ? "var(--gold-glow)" : "transparent",
                    color: gem === g ? "var(--gold-light)" : "var(--text-muted)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {gemColors[g].label.split(" ")[1] || gemColors[g].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
