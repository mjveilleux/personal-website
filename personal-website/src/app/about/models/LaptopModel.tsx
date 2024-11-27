import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const LaptopModel = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(320, 320);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(2, 4, 2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-2, 2, 2);
    scene.add(fillLight);

    const createLaptop = () => {
      const laptopGroup = new THREE.Group();

      // Base
      const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2);
      const baseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x303030,
        shininess: 100,
        specular: 0x666666
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);

      // Keyboard area
      const keyboardGeometry = new THREE.BoxGeometry(2.8, 0.05, 1.8);
      const keyboardMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a1a1a,
        shininess: 30
      });
      const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
      keyboard.position.y = 0.1;

      // Touchpad
      const touchpadGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.5);
      const touchpadMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2a2a2a,
        shininess: 50
      });
      const touchpad = new THREE.Mesh(touchpadGeometry, touchpadMaterial);
      touchpad.position.y = 0.12;
      touchpad.position.z = 0.5;

      // Screen
      const screenBaseGeometry = new THREE.BoxGeometry(3, 2, 0.1);
      const screenBaseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x303030,
        shininess: 100,
        specular: 0x666666
      });
      const screenBase = new THREE.Mesh(screenBaseGeometry, screenBaseMaterial);
      screenBase.position.y = 1;
      screenBase.position.z = -1;
      screenBase.rotation.x = -0.2;

      // Screen display
      const displayGeometry = new THREE.BoxGeometry(2.8, 1.8, 0.02);
      const displayMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x000000,
        emissive: 0x114477,
        emissiveIntensity: 0.2,
        shininess: 20
      });
      const display = new THREE.Mesh(displayGeometry, displayMaterial);
      display.position.z = 0.06;
      screenBase.add(display);

      // Logo
      const logoGeometry = new THREE.CircleGeometry(0.15, 32);
      const logoMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666,
        shininess: 80
      });
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.z = 0.051;
      screenBase.add(logo);

      laptopGroup.add(base);
      laptopGroup.add(keyboard);
      laptopGroup.add(touchpad);
      laptopGroup.add(screenBase);

      return laptopGroup;
    };

    const laptop = createLaptop();
    laptop.rotation.x = 0.2;
    scene.add(laptop);

    camera.position.z = 6;
    camera.position.y = 1;

    const animate = () => {
      requestAnimationFrame(animate);
      laptop.rotation.y += 0.005;
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