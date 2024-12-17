import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Converts degrees to radians for THREE.js rotations
 */
const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

// Define possible values for random rotation speed
type RandomRange =  0.0075 | 0.015 | 0.03;
/**
 * Generates a random decimal in 0.1 increments between 0 and 1
 * Uses type assertion since we know our math will only produce valid values
 */
const getRandomDecimal = (): RandomRange => {
  const random = Math.round(Math.random() * 10) / 10;
  return random as RandomRange;
};

export const BookModel = () => {
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

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    /**
     * Creates a detailed book model with cover, pages, spine details, and title
     */
    const createBook = () => {
      const book = new THREE.Group();

      // Create book cover
      const coverGeometry = new THREE.BoxGeometry(2, 3, 0.2);
      const coverMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a0f0f,
        shininess: 30
      });
      const cover = new THREE.Mesh(coverGeometry, coverMaterial);

      // Create book pages
      const pagesGeometry = new THREE.BoxGeometry(1.9, 2.9, 0.8);
      const pagesMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf1f1f1,
        shininess: 10
      });
      const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
      pages.position.z = 0.4;

      // Create spine details
      const spineDetailGeometry = new THREE.BoxGeometry(0.1, 2.8, 0.1);
      const spineDetailMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc0c0c0,
        shininess: 50
      });

      // Add decorative details to the spine
      for (let i = -0.4; i <= 0.4; i += 0.2) {
        const spineDetail = new THREE.Mesh(spineDetailGeometry, spineDetailMaterial);
        spineDetail.position.set(-0.9, i, 0.4);
        book.add(spineDetail);
      }

      // Add simplified title plate
      const titleGeometry = new THREE.PlaneGeometry(1.5, 0.3);
      const titleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc0c0c0,
        shininess: 100
      });
      const title = new THREE.Mesh(titleGeometry, titleMaterial);
      title.position.set(0, 0.5, 0.11);

      // Combine all elements
      book.add(cover);
      book.add(pages);
      book.add(title);

      return book;
    };

    // Create and position the book
    const book = createBook();
    book.rotation.x = 0.2;
    scene.add(book);

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

      book.quaternion.multiplyQuaternions(deltaRotationQuaternion, book.quaternion);
      
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
    camera.position.y = 0.5;

    /**
     * Animation loop with consistent rotation speed
     */
    const animate = () => {
      requestAnimationFrame(animate);
      book.rotation.y += rotationSpeedRef.current;
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