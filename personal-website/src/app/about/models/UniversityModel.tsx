import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const UniversityModel = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(320, 320);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const createUniversity = () => {
      const building = new THREE.Group();

      // Main building body
      const mainGeometry = new THREE.BoxGeometry(4, 3, 2);
      const brickMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc4622d, // Brick red
        shininess: 10
      });
      const main = new THREE.Mesh(mainGeometry, brickMaterial);

      // Central tower
      const towerGeometry = new THREE.BoxGeometry(1.2, 4, 1);
      const tower = new THREE.Mesh(towerGeometry, brickMaterial);
      tower.position.y = 0.5;

      // Tower spires
      const spireGeometry = new THREE.ConeGeometry(0.3, 1, 4);
      const spireMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666,
        shininess: 50
      });

      const spire1 = new THREE.Mesh(spireGeometry, spireMaterial);
      spire1.position.set(-0.3, 2.5, 0);
      tower.add(spire1);

      const spire2 = new THREE.Mesh(spireGeometry, spireMaterial);
      spire2.position.set(0.3, 2.5, 0);
      tower.add(spire2);

      // Windows
      const windowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xaaaaff,
        shininess: 100,
        emissive: 0x223366,
        emissiveIntensity: 0.2
      });

      // Create Gothic windows
      for (let i = -1.5; i <= 1.5; i += 0.75) {
        const windowGeometry = new THREE.BoxGeometry(0.3, 1, 0.1);
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(i, 0, 1.1);
        main.add(window);

        // Add Gothic arch
        const archGeometry = new THREE.ConeGeometry(0.15, 0.3, 32, 1, true);
        const arch = new THREE.Mesh(archGeometry, windowMaterial);
        arch.rotation.x = Math.PI;
        arch.position.set(i, 0.65, 1.1);
        main.add(arch);
      }

      // Entrance arch
      const entranceGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.5);
      const entrance = new THREE.Mesh(entranceGeometry, brickMaterial);
      entrance.position.set(0, -0.75, 1);

      // Decorative elements
      const crenellationGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.2);
      for (let i = -2; i <= 2; i += 0.4) {
        const crenellation = new THREE.Mesh(crenellationGeometry, brickMaterial);
        crenellation.position.set(i, 1.6, 1);
        main.add(crenellation);
      }

      building.add(main);
      building.add(tower);
      building.add(entrance);

      return building;
    };

    const university = createUniversity();
    scene.add(university);

    camera.position.z = 8;
    camera.position.y = 1;

    const animate = () => {
      requestAnimationFrame(animate);
      university.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-80 h-80" />;
};