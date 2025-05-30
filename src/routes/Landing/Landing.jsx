import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import GridLayout from "../../layouts/GridLayout/GridLayout";

import Work from "../../components/Work/Work";

import selfImg from "../../assets/media/0.jpg";
import works from "../../data/works.json";

export default function Landing() {
  const [milanTime, setMilanTime] = useState("");
  const [projects, setProjects] = useState([]);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Three.js refs
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setProjects(works);
  }, []);

  // Three.js Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;

    // Clear any existing content first
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Get container dimensions
    const containerWidth = mountRef.current.offsetWidth;
    const containerHeight = mountRef.current.offsetHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      containerWidth / containerHeight,
      0.1,
      1000
    );

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    mountRef.current.appendChild(renderer.domElement);

    // Load GLTFLoader dynamically - the correct way
    const loadGLTFLoader = async () => {
      try {
        // Import GLTFLoader dynamically
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const loader = new GLTFLoader();

        // Load the model
        loader.load(
          "/assets/models/baffo/moustache1.gltf",
          (gltf) => {
            const model = gltf.scene;

            // Scale the model appropriately
            model.scale.setScalar(0.007); // Your model is large, scale it down

            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.position.y += 50;

            // Adjust materials for better visibility
            model.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = 0.9;

                // Make the material red-ish
                if (child.material.color) {
                  // Set a red-ish color - you can adjust these RGB values
                  child.material.color.setRGB(0.7, 0.25, 0.1); // Deep red
                  // Alternative red options:
                  // child.material.color.setRGB(0.9, 0.3, 0.2); // Brighter red
                  // child.material.color.setRGB(0.7, 0.1, 0.1); // Dark red
                  // child.material.color.setRGB(1.0, 0.4, 0.3); // Light red-orange
                }

                // Enhance the material properties for better appearance
                if (child.material.emissive) {
                  child.material.emissive.setRGB(0.1, 0.02, 0.01); // Subtle red glow
                }
              }
            });

            scene.add(model);
            modelRef.current = model;
            setModelLoaded(true);
          },
          (progress) => {},
          (error) => {
            console.error("Error loading glTF model:", error);
          }
        );
      } catch (error) {
        console.error("Error importing GLTFLoader:", error);
      }
    };

    loadGLTFLoader();

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight2.position.set(-5, -5, 5);
    scene.add(directionalLight2);

    // Position camera
    camera.position.z = 5;

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Mouse move handler
    const handleMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();

      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y =
          -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    // Replace the animation loop section in your useEffect with this enhanced version:

    const animate = () => {
      if (
        !modelRef.current ||
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current
      ) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const model = modelRef.current;

      // Calculate target rotation based on mouse position (increased rotation)
      const targetRotationX = -mouseRef.current.y * Math.PI * 0.25; // Increased from 0.1 to 0.25
      const targetRotationY = mouseRef.current.x * Math.PI * 0.25; // Increased from 0.1 to 0.25

      // Calculate target position based on mouse position with boundaries
      // Limit horizontal movement to prevent touching viewport sides
      const maxHorizontalMovement = 2.0; // Adjust this value to control how far left/right the model can move
      const maxVerticalMovement = 1.0; // Adjust this value to control vertical movement range

      const targetPositionX = mouseRef.current.x * maxHorizontalMovement;
      const targetPositionY = mouseRef.current.y * maxVerticalMovement;

      // Smooth interpolation with slightly faster response
      model.rotation.x += (targetRotationX - model.rotation.x) * 0.08; // Increased from 0.05
      model.rotation.y += (targetRotationY - model.rotation.y) * 0.08; // Increased from 0.05

      model.position.x += (targetPositionX - model.position.x) * 0.05; // Increased from 0.03
      model.position.y += (targetPositionY - model.position.y) * 0.05; // Increased from 0.03

      // Subtle continuous rotation (optional - you can adjust or remove this)
      model.rotation.y += 0.002;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !mountRef.current)
        return;

      const containerWidth = mountRef.current.offsetWidth;
      const containerHeight = mountRef.current.offsetHeight;

      cameraRef.current.aspect = containerWidth / containerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerWidth, containerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      if (mountRef.current) {
        while (mountRef.current.firstChild) {
          mountRef.current.removeChild(mountRef.current.firstChild);
        }
      }

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Rome",
        hour12: false,
      });
      setMilanTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BaseLayout>
      {/* Hero Section with Three.js Model */}
      <div className="relative">
        {/* Three.js Canvas Container - Higher z-index */}
        <div
          ref={mountRef}
          className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none z-20 mix-blend-difference"
        />

        <GridLayout className="relative z-10 mix-blend-difference">
          <div className="col-span-3 flex items-center h-[90vh] font-serif text-7xl">
            Creative
          </div>
          <div className="col-span-6 flex items-center justify-center h-[90vh] font-serif text-7xl text-center">
            Web
          </div>
          <div className="col-span-3 flex items-center justify-end h-[90vh] font-serif text-7xl">
            Developer
          </div>
        </GridLayout>
      </div>

      <GridLayout>
        <div className="col-span-3 flex items-end pb-4">Milan, {milanTime}</div>
        <div className="col-span-6 h-[10vh] flex items-end justify-center text-lg pb-4">
          <a className="ps-1" href="https://www.quantum-studio.it/">
            QUANTUM STUDIO
          </a>
        </div>
        <div className="col-span-3 h-[10vh] flex items-end justify-end text-lg pb-4 animate-blink">
          Scroll
        </div>
      </GridLayout>

      <GridLayout className="pt-8">
        <hr className="col-span-full border-t-2 border-black pb-8" />
        <div className="col-span-3 uppercase text-2xl">About</div>
        <div className="col-span-3 w-56 h-64 rounded overflow-hidden">
          <img src={selfImg} alt="Me" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-3 col-start-10 flex justify-end uppercase text-2xl underline">
          <Link to="/about">Read all</Link>
        </div>
        <div className="col-span-full text-7xl font-serif indent-[calc(100%/4)] mt-32 tracking-tight text-gray-900">
          I'm Giacomo, a creative developer based near Milan. My work spans
          between websites, UI/UX, branding, graphic design, prototyping,
          audiovisual and interactive installations. <br />
          <br />
          Moving between design and code, concept and execution. Design and code
          are only tools of expression — shaping digital experiences that are
          thoughtful, expressive, and alive.
        </div>
      </GridLayout>

      <GridLayout className="pt-64 pb-4">
        <div className="col-span-3 uppercase text-2xl">Works</div>
        <div className="col-span-3 col-start-10 flex justify-end uppercase text-2xl underline">
          <Link to="/about">See all</Link>
        </div>
      </GridLayout>

      <GridLayout className="gap-y-32">
        {projects.slice(0, 6).map((project, index) => (
          <Work key={index} project={project} index={index} />
        ))}
      </GridLayout>
    </BaseLayout>
  );
}
