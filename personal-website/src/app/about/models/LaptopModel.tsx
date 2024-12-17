import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Helper function to convert degrees to radians for THREE.js rotations
 */
const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

// Define possible values for random rotation speed
type RandomRange = 0.0075 | 0.0075 | 0.0075 | 0.1 | 0.15 | 0.2;

/**
 * Generates a random decimal in 0.1 increments between 0 and 1
 * Uses type assertion since we know our math will only produce valid values
 */
const getRandomDecimal = (): RandomRange => {
  const random = Math.round(Math.random() * 10) / 10;
  return random as RandomRange;
};

export const LaptopModel = () => {
  // Reference to the container div for our THREE.js canvas
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Store our random rotation speed - persists during component lifetime
  const rotationSpeedRef = useRef<number>(getRandomDecimal());

  useEffect(() => {
    // Early return if mount point doesn't exist
    if (!mountRef.current) return;

    // Store mount element reference for cleanup
    const mountElement = mountRef.current;

    // Set up THREE.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(320, 320);
    mountElement.appendChild(renderer.domElement);

    // Set up three-point lighting system
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(2, 4, 2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-2, 2, 2);
    scene.add(fillLight);

    /**
     * Creates a detailed laptop model with base, keyboard, screen, and details
     */
    const createLaptop = () => {
      const laptopGroup = new THREE.Group();

      // Create laptop base with metallic finish
      const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2);
      const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x303030,
        shininess: 100,
        specular: 0x666666
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);

      // Add keyboard with matte finish
      const keyboardGeometry = new THREE.BoxGeometry(2.8, 0.05, 1.8);
      const keyboardMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a,
        shininess: 30
      });
      const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
      keyboard.position.y = 0.1;

      // Add touchpad with subtle shine
      const touchpadGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.5);
      const touchpadMaterial = new THREE.MeshPhongMaterial({
        color: 0x2a2a2a,
        shininess: 50
      });
      const touchpad = new THREE.Mesh(touchpadGeometry, touchpadMaterial);
      touchpad.position.y = 0.12;
      touchpad.position.z = 0.5;

      // Create screen housing with matching finish to base
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

      // Add glowing display screen
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

      // Add metallic logo
      const logoGeometry = new THREE.CircleGeometry(0.15, 32);
      const logoMaterial = new THREE.MeshPhongMaterial({
        color: 0x666666,
        shininess: 80
      });
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.z = 0.051;
      screenBase.add(logo);

      // Combine all elements
      laptopGroup.add(base);
      laptopGroup.add(keyboard);
      laptopGroup.add(touchpad);
      laptopGroup.add(screenBase);

      return laptopGroup;
    };

    // Create and position the laptop
    const laptop = createLaptop();
    laptop.rotation.x = 0.2;
    scene.add(laptop);

    // State for handling mouse interactions
    let isRotating = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };

    /**
     * Mouse event handlers for interactive rotation
     */
    const startRotation = (event: MouseEvent) => {
      isRotating = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const stopRotation = () => {
      isRotating = false;
    };

    const rotate = (event: MouseEvent) => {
      if (!isRotating) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // Calculate rotation based on mouse movement
      const deltaRotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
          toRadians(deltaMove.y * 0.5),
          toRadians(deltaMove.x * 0.5),
          0,
          'XYZ'
        ));

      laptop.quaternion.multiplyQuaternions(deltaRotationQuaternion, laptop.quaternion);
      
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    // Add mouse event listeners
    mountElement.addEventListener('mousedown', startRotation);
    mountElement.addEventListener('mousemove', rotate);
    mountElement.addEventListener('mouseup', stopRotation);
    mountElement.addEventListener('mouseout', stopRotation);

    // Position camera
    camera.position.z = 6;
    camera.position.y = 1;

    /**
     * Animation loop with consistent rotation speed
     */
    const animate = () => {
      requestAnimationFrame(animate);
      laptop.rotation.y += rotationSpeedRef.current;
      renderer.render(scene, camera);
    };

    animate();

    /**
     * Handle window resize events
     */
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      // Ensure mount element exists before cleanup
      if (mountElement) {
        // Remove event listeners
        mountElement.removeEventListener('mousedown', startRotation);
        mountElement.removeEventListener('mousemove', rotate);
        mountElement.removeEventListener('mouseup', stopRotation);
        mountElement.removeEventListener('mouseout', stopRotation);
      }

      // Remove window resize listener
      window.removeEventListener('resize', handleResize);

      // Dispose of THREE.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();

      // Safely remove renderer element
      if (mountElement && renderer.domElement.parentElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array since we don't need to re-run the effect

  return <div ref={mountRef} className="w-80 h-80" />;
};