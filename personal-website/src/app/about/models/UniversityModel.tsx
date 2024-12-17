import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Helper function to convert degrees to radians for THREE.js rotations
 * THREE.js uses radians internally, but degrees are more intuitive for
 * architectural angles and rotations
 */
const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

/**
 * Define possible values for random rotation speed
 * Using a union type ensures type safety while allowing for
 * varied but controlled animation speeds
 */
 type RandomRange =  0.0075 | 0.015 | 0.03;

/**
 * Generates a random decimal in 0.1 increments between 0 and 1
 * This creates a consistent but random rotation speed that
 * persists until page refresh, giving each viewing session
 * its own unique character
 */
const getRandomDecimal = (): RandomRange => {
  const random = Math.round(Math.random() * 10) / 10;
  return random as RandomRange;
};

export const UniversityModel = () => {
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

    // Set up lighting to enhance architectural details
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    /**
     * Creates a detailed Gothic-style university building
     * The architecture includes:
     * 1. Main building body with brick texture
     * 2. Central tower with twin spires
     * 3. Gothic-arched windows with glowing effect
     * 4. Decorated crenellations along the roofline
     * 5. Grand entrance arch
     */
    const createUniversity = () => {
      const building = new THREE.Group();

      // Create main building body with authentic brick coloring
      const mainGeometry = new THREE.BoxGeometry(4, 3, 2);
      const brickMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc4622d, // Warm brick red color
        shininess: 10 // Low shininess for matte brick appearance
      });
      const main = new THREE.Mesh(mainGeometry, brickMaterial);

      // Add central tower with Gothic proportions
      const towerGeometry = new THREE.BoxGeometry(1.2, 4, 1);
      const tower = new THREE.Mesh(towerGeometry, brickMaterial);
      tower.position.y = 0.5;

      // Create decorative spires for Gothic character
      const spireGeometry = new THREE.ConeGeometry(0.3, 1, 4);
      const spireMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666, // Weathered stone color
        shininess: 50 // Higher shininess for stone-like appearance
      });

      // Position twin spires symmetrically
      const spire1 = new THREE.Mesh(spireGeometry, spireMaterial);
      spire1.position.set(-0.3, 2.5, 0);
      tower.add(spire1);

      const spire2 = new THREE.Mesh(spireGeometry, spireMaterial);
      spire2.position.set(0.3, 2.5, 0);
      tower.add(spire2);

      // Create glowing Gothic windows
      const windowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xaaaaff, // Blue-tinted glass
        shininess: 100,
        emissive: 0x223366, // Subtle interior glow
        emissiveIntensity: 0.2
      });

      // Add series of Gothic windows with arches
      for (let i = -1.5; i <= 1.5; i += 0.75) {
        // Window base
        const windowGeometry = new THREE.BoxGeometry(0.3, 1, 0.1);
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(i, 0, 1.1);
        main.add(window);

        // Gothic pointed arch
        const archGeometry = new THREE.ConeGeometry(0.15, 0.3, 32, 1, true);
        const arch = new THREE.Mesh(archGeometry, windowMaterial);
        arch.rotation.x = Math.PI;
        arch.position.set(i, 0.65, 1.1);
        main.add(arch);
      }

      // Add grand entrance
      const entranceGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.5);
      const entrance = new THREE.Mesh(entranceGeometry, brickMaterial);
      entrance.position.set(0, -0.75, 1);

      // Add decorative crenellations along roofline
      const crenellationGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.2);
      for (let i = -2; i <= 2; i += 0.4) {
        const crenellation = new THREE.Mesh(crenellationGeometry, brickMaterial);
        crenellation.position.set(i, 1.6, 1);
        main.add(crenellation);
      }

      // Combine all architectural elements
      building.add(main);
      building.add(tower);
      building.add(entrance);

      return building;
    };

    // Create and add university to scene
    const university = createUniversity();
    scene.add(university);

    // State for handling mouse interactions
    let isRotating = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };

    /**
     * Mouse event handlers for interactive rotation
     * These allow viewers to examine architectural details
     * from different angles
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

      university.quaternion.multiplyQuaternions(deltaRotationQuaternion, university.quaternion);
      
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

    // Position camera to showcase architectural features
    camera.position.z = 8;
    camera.position.y = 1;

    /**
     * Animation loop with consistent rotation speed
     * The negative rotation creates a clockwise movement,
     * which feels more natural for architectural visualization
     */
    const animate = () => {
      requestAnimationFrame(animate);
      university.rotation.y -= rotationSpeedRef.current;
      renderer.render(scene, camera);
    };

    animate();

    /**
     * Handle window resize events
     * Ensures the building maintains proper proportions
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