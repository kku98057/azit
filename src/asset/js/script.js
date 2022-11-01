import * as THREE from "three";
import fragment from "../shaders/fragment.glsl";
import vertex from "../shaders/vertex.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import benech from "../3DTexture/bench.glb";
import texture from "../img/bg2.jpg";
import * as dat from "dat.gui";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
// import fragment from "./fragment.glsl"
export default class App {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.container = document.querySelector(".webgl");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio >= 2 ? 2 : 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0x000000, 0); // the default
    this.scene = new THREE.Scene();
    gsap.registerPlugin(ScrollTrigger);
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);

    this.time = 0;
    this.scene.add(this.camera);
    new OrbitControls(this.camera, this.renderer.domElement);
    this.addMesh();
    this.settings();
    this.setLight();
    this.setResize();
    this.render();
  }
  settings() {
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
    this.gui.add(this.camera.rotation, "x", -100, 100, 0.01);
    this.gui.add(this.camera.rotation, "y", -100, 100, 0.01);
    this.gui.add(this.camera.rotation, "z", -100, 100, 0.01);
  }
  setLight() {
    this.color = 0xffffff;
    this.intensity = 2;
    this.light = new THREE.DirectionalLight(this.color, this.intensity);
    this.scene.add(this.light);
  }
  addBg() {
    this.bg = new THREE.TextureLoader().load(texture);
  }
  addMesh() {
    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
    );
    this.loader.setDRACOLoader(this.dracoLoader);
    this.loader.load(benech, (gltf) => {
      const scaleSize = 1;
      gltf.scene.scale.set(scaleSize, scaleSize, scaleSize);
      gltf.scene.rotation.set(0, -1.6, 0);
      this.scene.add(gltf.scene);
      // gsap.from(this.camera.position, {
      //   x: 0,
      //   y: 0,
      //   z: 0,
      //   duration: 5,
      // });
    });

    // this.geo = new THREE.PlaneGeometry(3, 3, 10, 10);
    // this.material = new THREE.ShaderMaterial({
    //   uniforms: {
    //     time: { type: "f", value: 1.0 },
    //     resolution: { type: "v2", value: new THREE.Vector2() },
    //     progress: { type: "f", value: 0 },
    //   },
    //   fragmentShader: fragment,
    //   vertexShader: vertex,
    //   side: THREE.DoubleSide,
    // });

    // this.mesh = new THREE.Mesh(this.geo, this.material);
    // this.scene.add(this.mesh);
  }
  setResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  update() {
    this.time += 0.01;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
    this.update();
    requestAnimationFrame(this.render.bind(this));
  }
}
