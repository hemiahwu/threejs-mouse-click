// 导入样式文件
import "./style.css";

// 导入Three.js库和OrbitControls控制器
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 创建一个WebGL渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的大小为窗口的大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染器的DOM元素添加到文档中
document.body.appendChild(renderer.domElement);

// 创建一个新的3D场景
const scene = new THREE.Scene();

// 创建一个透视相机
const camera = new THREE.PerspectiveCamera(
  45, // 视野角度
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近裁剪面
  1000 // 远裁剪面
);

// 创建OrbitControls来控制相机的旋转
const orbit = new OrbitControls(camera, renderer.domElement);
// 设置相机的初始位置
camera.position.set(0, 6, 6);
// 更新控制器
orbit.update();

// 创建并添加环境光到场景
const ambientLight = new THREE.AmbientLight(0x333333, 1.0);
scene.add(ambientLight);

// 创建并添加定向光到场景
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
// 设置定向光的位置
directionalLight.position.set(0, 50, 0);

// 创建并添加坐标轴助手到场景
const helper = new THREE.AxesHelper(20);
scene.add(helper);

// 创建鼠标和射线投射所需的变量
const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

// 监听鼠标移动事件，更新鼠标位置和射线投射
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

// 监听鼠标点击事件，创建并添加一个球体到场景的点击位置
window.addEventListener("click", (e) => {
  const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xffea00,
    metalness: 0,
    roughness: 0,
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphereMesh);
  sphereMesh.position.copy(intersectionPoint);
});

// 动画函数，渲染场景和相机
function animate() {
  renderer.render(scene, camera);
}

// 设置渲染循环
renderer.setAnimationLoop(animate);

// 监听窗口大小变化事件，更新相机和渲染器的大小
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
