import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Same uniform-in-sphere sampling maath's random.inSphere uses, inlined
// with Math.random() (maath's RNG resolves broken/NaN under CRA's webpack).
function randomInSphere(buffer, radius) {
  for (let i = 0; i < buffer.length; i += 3) {
    const u = Math.pow(Math.random(), 1 / 3);
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let z = Math.random() * 2 - 1;
    const mag = Math.sqrt(x * x + y * y + z * z);
    x = (u * x) / mag;
    y = (u * y) / mag;
    z = (u * z) / mag;
    buffer[i] = x * radius;
    buffer[i + 1] = y * radius;
    buffer[i + 2] = z * radius;
  }
  return buffer;
}

// Ported from space-portfolio's components/main/star-background.tsx
// (react-three-fiber rotating star sphere), rebuilt in plain three.js
// so it runs on this app's React 17 / CRA setup.
//
// Also listens for a "warp-jump" window event (dispatched by
// RouteWarpTrigger.js on every route change) and plays a brief
// hyperspace-style burst: stars stretch into radial streaks and the
// camera punches forward, then it all eases back to the normal drift.
function StarBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const baseFov = 75;
    const baseCameraZ = 1;
    camera.position.set(0, 0, baseCameraZ);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.z = Math.PI / 4;
    scene.add(group);

    const STAR_COUNT = 5000;
    const sphere = randomInSphere(new Float32Array(STAR_COUNT), 1.2);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(sphere, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.002,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    // Precompute each star's outward direction once so the warp loop
    // only has to do cheap multiply-adds per frame.
    const directions = new Float32Array(sphere.length);
    for (let i = 0; i < sphere.length; i += 3) {
      const x = sphere[i];
      const y = sphere[i + 1];
      const z = sphere[i + 2];
      const mag = Math.sqrt(x * x + y * y + z * z) || 1;
      directions[i] = x / mag;
      directions[i + 1] = y / mag;
      directions[i + 2] = z / mag;
    }

    // Streak overlay: a line per star from its resting position out to
    // resting + direction * streakLength. Idle at zero length/opacity,
    // so it's invisible until a warp is triggered.
    const streakPositions = new Float32Array(sphere.length * 2);
    for (let i = 0; i < sphere.length; i += 3) {
      const idx = i * 2;
      streakPositions[idx] = sphere[i];
      streakPositions[idx + 1] = sphere[i + 1];
      streakPositions[idx + 2] = sphere[i + 2];
      streakPositions[idx + 3] = sphere[i];
      streakPositions[idx + 4] = sphere[i + 1];
      streakPositions[idx + 5] = sphere[i + 2];
    }
    const streakGeometry = new THREE.BufferGeometry();
    const streakAttribute = new THREE.BufferAttribute(streakPositions, 3);
    streakGeometry.setAttribute("position", streakAttribute);
    const streakMaterial = new THREE.LineBasicMaterial({
      color: 0xffddaa,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const streaks = new THREE.LineSegments(streakGeometry, streakMaterial);
    group.add(streaks);

    const clock = new THREE.Clock();
    let frameId;

    // Warp state: 0 = idle. When triggered, ramps 0 -> 1 quickly then
    // eases back down to 0 over WARP_DURATION.
    const WARP_RAMP_MS = 160;
    const WARP_DURATION_MS = 3000;
    let warpStart = null;

    const triggerWarp = () => {
      warpStart = performance.now();
    };
    window.addEventListener("warp-jump", triggerWarp);

    const animate = () => {
      const delta = clock.getDelta();

      let warpIntensity = 0;
      if (warpStart !== null) {
        const elapsed = performance.now() - warpStart;
        if (elapsed >= WARP_DURATION_MS) {
          warpStart = null;
        } else if (elapsed <= WARP_RAMP_MS) {
          warpIntensity = elapsed / WARP_RAMP_MS;
        } else {
          warpIntensity =
            1 - (elapsed - WARP_RAMP_MS) / (WARP_DURATION_MS - WARP_RAMP_MS);
        }
      }

      // Base drift, sped up while warping for extra motion.
      const spinMultiplier = 1 + warpIntensity * 6;
      points.rotation.x -= (delta / 10) * spinMultiplier;
      points.rotation.y -= (delta / 15) * spinMultiplier;
      streaks.rotation.x = points.rotation.x;
      streaks.rotation.y = points.rotation.y;

      if (warpIntensity > 0) {
        const streakLength = warpIntensity * 1.6;
        const pos = streakGeometry.attributes.position.array;
        for (let i = 0; i < sphere.length; i += 3) {
          const idx = i * 2;
          pos[idx + 3] = sphere[i] + directions[i] * streakLength;
          pos[idx + 4] = sphere[i + 1] + directions[i + 1] * streakLength;
          pos[idx + 5] = sphere[i + 2] + directions[i + 2] * streakLength;
        }
        streakGeometry.attributes.position.needsUpdate = true;
        streakMaterial.opacity = warpIntensity * 0.85;

        // Punch the FOV and dolly the camera in for a forward-thrust feel.
        camera.fov = baseFov + warpIntensity * 35;
        camera.position.z = baseCameraZ - warpIntensity * 0.4;
        camera.updateProjectionMatrix();
      } else if (streakMaterial.opacity !== 0) {
        streakMaterial.opacity = 0;
        camera.fov = baseFov;
        camera.position.z = baseCameraZ;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("warp-jump", triggerWarp);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      streakGeometry.dispose();
      streakMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -10,
      }}
    />
  );
}

export default StarBackground;
