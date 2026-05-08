import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const sceneElement = document.querySelector("[data-scene]");
const statusElement = document.querySelector("#status");
const movementSelect = document.querySelector("#movementSelect");
const movementStatus = document.querySelector("#movementStatus");
const weaponSelect = document.querySelector("#weaponSelect");
const weaponStatus = document.querySelector("#weaponStatus");
const offsetXInput = document.querySelector("#offsetX");
const offsetYInput = document.querySelector("#offsetY");
const offsetZInput = document.querySelector("#offsetZ");
const weaponScaleInput = document.querySelector("#weaponScale");
const offsetXValue = document.querySelector("#offsetXValue");
const offsetYValue = document.querySelector("#offsetYValue");
const offsetZValue = document.querySelector("#offsetZValue");
const weaponScaleValue = document.querySelector("#weaponScaleValue");
const copyInfoButton = document.querySelector("#copyInfoButton");
const modelUrl = new URL("../assets/HUNK.glb", import.meta.url).href;
const gunPackPath = "../assets/Styloo Guns Asset Pack GLTF FBX V1.1/Normal version Color and NormalMap/GLB/";
const weaponOptions = [
  weapon("mac10", "MAC-10", "mac10.glb", { position: [0.01, 0.02, 0.005], scale: 3 }),
  weapon("ak47", "AK-47", "ak47.glb", { position: [0.01, 0.02, 0.005], scale: 0.92 }),
  weapon("ak47variant", "AK-47 Variant", "ak47variant.glb", { position: [0.01, 0.02, 0.005], scale: 0.92 }),
  weapon("awp", "AWP", "awp.glb", { position: [0.01, 0.02, 0.005], scale: 0.62 }),
  weapon("shotgun", "Shotgun", "shotgun.glb", { position: [0.01, 0.02, 0.005], scale: 1.05 }),
  weapon("pew", "Pew pistol", "pew.glb", { position: [0.01, 0.02, 0.005], scale: 3.5 }),
  weapon("nade", "Grenade", "nade_low.glb", { position: [0.01, 0.02, 0.005], scale: 3 }),
  weapon("nadevariant", "Grenade variant", "nadevariant_low.glb", { position: [0.01, 0.02, 0.005], scale: 2.6 }),
  weapon("flashbang", "Flashbang", "flashbang_low.glb", { position: [0.01, 0.02, 0.005], scale: 3 }),
  weapon("smoke", "Smoke grenade", "smoke_low.glb", { position: [0.01, 0.02, 0.005], scale: 2.7 }),
  weapon("incendiary", "Incendiary grenade", "incendiary_low.glb", { position: [0.01, 0.02, 0.005], scale: 2.7 }),
];
const weaponById = new Map(weaponOptions.map((option) => [option.id, option]));
const animationFiles = [
  "general.glb",
  "movement-basic.glb",
  "movement-advanced.glb",
  "combat-melee.glb",
  "combat-ranged.glb",
  "simulation.glb",
  "special.glb",
  "tools.glb",
];

const animationUrls = animationFiles.map(
  (fileName) => new URL(`../assets/animations/rig-medium/${fileName}`, import.meta.url).href,
);
const animationGroups = [
  {
    label: "Geral",
    options: [
      clip("Idle_A", true, { label: "Parado A" }),
      clip("Idle_B", true, { label: "Parado B" }),
      clip("Interact"),
      clip("PickUp"),
      clip("Use_Item"),
      clip("Throw"),
      clip("Hit_A"),
      clip("Hit_B"),
      clip("Death_A"),
      clip("Death_A_Pose", true),
      clip("Death_B"),
      clip("Death_B_Pose", true),
      clip("Spawn_Air"),
      clip("Spawn_Ground"),
      clip("T-Pose", true, { label: "T-Pose" }),
    ],
  },
  {
    label: "Movimento basico",
    options: [
      clip("Walking_A", true, { label: "Caminhada A" }),
      clip("Walking_B", true, { label: "Caminhada B" }),
      clip("Walking_C", true, { label: "Caminhada C" }),
      clip("Running_A", true, { label: "Corrida A", timeScale: 1.12 }),
      clip("Running_B", true, { label: "Corrida B", timeScale: 1.12 }),
      clip("Jump_Idle", true, { label: "Pulo parado" }),
      clip("Jump_Start", false, { label: "Comecar pulo" }),
      clip("Jump_Land", false, { label: "Pousar" }),
      clip("Jump_Full_Short", false, { label: "Pulo curto" }),
      clip("Jump_Full_Long", false, { label: "Pulo longo" }),
    ],
  },
  {
    label: "Movimento avancado",
    options: [
      clip("Walking_Backwards", true),
      clip("Running_Strafe_Left", true),
      clip("Running_Strafe_Right", true),
      clip("Running_HoldingBow", true),
      clip("Running_HoldingRifle", true),
      clip("Sneaking", true),
      clip("Crouching", true),
      clip("Crawling", true),
      clip("Dodge_Backward"),
      clip("Dodge_Forward"),
      clip("Dodge_Left"),
      clip("Dodge_Right"),
    ],
  },
  {
    label: "Combate melee",
    options: [
      clip("Melee_1H_Attack_Chop"),
      clip("Melee_1H_Attack_Jump_Chop"),
      clip("Melee_1H_Attack_Slice_Diagonal"),
      clip("Melee_1H_Attack_Slice_Horizontal"),
      clip("Melee_1H_Attack_Stab"),
      clip("Melee_2H_Attack_Chop"),
      clip("Melee_2H_Attack_Slice"),
      clip("Melee_2H_Attack_Spin"),
      clip("Melee_2H_Attack_Spinning"),
      clip("Melee_2H_Attack_Stab"),
      clip("Melee_2H_Idle", true),
      clip("Melee_Block"),
      clip("Melee_Block_Attack"),
      clip("Melee_Block_Hit"),
      clip("Melee_Blocking", true),
      clip("Melee_Dualwield_Attack_Chop"),
      clip("Melee_Dualwield_Attack_Slice"),
      clip("Melee_Dualwield_Attack_Stab"),
      clip("Melee_Unarmed_Attack_Kick"),
      clip("Melee_Unarmed_Attack_Punch_A"),
      clip("Melee_Unarmed_Idle", true),
    ],
  },
  {
    label: "Combate ranged",
    options: [
      clip("Ranged_1H_Aiming", true),
      clip("Ranged_1H_Reload"),
      clip("Ranged_1H_Shoot"),
      clip("Ranged_1H_Shooting", true),
      clip("Ranged_2H_Aiming", true),
      clip("Ranged_2H_Reload"),
      clip("Ranged_2H_Shoot"),
      clip("Ranged_2H_Shooting", true),
      clip("Ranged_Bow_Aiming_Idle", true),
      clip("Ranged_Bow_Draw"),
      clip("Ranged_Bow_Draw_Up"),
      clip("Ranged_Bow_Idle", true),
      clip("Ranged_Bow_Release"),
      clip("Ranged_Bow_Release_Up"),
      clip("Ranged_Magic_Raise"),
      clip("Ranged_Magic_Shoot"),
      clip("Ranged_Magic_Spellcasting", true),
      clip("Ranged_Magic_Spellcasting_Long"),
      clip("Ranged_Magic_Summon"),
    ],
  },
  {
    label: "Simulacao",
    options: [
      clip("Cheering"),
      clip("Lie_Down"),
      clip("Lie_Idle", true),
      clip("Lie_StandUp"),
      clip("Push_Ups", true),
      clip("Sit_Chair_Down"),
      clip("Sit_Chair_Idle", true),
      clip("Sit_Chair_StandUp"),
      clip("Sit_Floor_Down"),
      clip("Sit_Floor_Idle", true),
      clip("Sit_Floor_StandUp"),
      clip("Sit_Ups", true),
      clip("Waving"),
    ],
  },
  {
    label: "Ferramentas",
    options: [
      clip("Chop"),
      clip("Chopping", true),
      clip("Dig"),
      clip("Digging", true),
      clip("Fishing_Bite"),
      clip("Fishing_Cast"),
      clip("Fishing_Catch"),
      clip("Fishing_Idle", true),
      clip("Fishing_Reeling", true),
      clip("Fishing_Struggling", true),
      clip("Fishing_Tug"),
      clip("Hammer"),
      clip("Hammering", true),
      clip("Holding_A", true),
      clip("Holding_B", true),
      clip("Holding_C", true),
      clip("Lockpick"),
      clip("Lockpicking", true),
      clip("Pickaxe"),
      clip("Pickaxing", true),
      clip("Saw"),
      clip("Sawing", true),
      clip("Work_A"),
      clip("Work_B"),
      clip("Work_C"),
      clip("Working_A", true),
      clip("Working_B", true),
      clip("Working_C", true),
    ],
  },
  {
    label: "Especial",
    options: [
      clip("EXPERIMENTAL_Medium_Transform"),
      clip("Skeletons_Awaken_Floor"),
      clip("Skeletons_Awaken_Floor_Long"),
      clip("Skeletons_Awaken_Standing"),
      clip("Skeletons_Death"),
      clip("Skeletons_Death_Pose", true),
      clip("Skeletons_Death_Resurrect"),
      clip("Skeletons_Idle", true),
      clip("Skeletons_Inactive_Floor_Pose", true),
      clip("Skeletons_Inactive_Standing_Pose", true),
      clip("Skeletons_Spawn_Ground"),
      clip("Skeletons_Taunt"),
      clip("Skeletons_Taunt_Longer"),
      clip("Skeletons_Walking", true),
    ],
  },
  {
    label: "Combinacao",
    options: [
      clip("Combo_Walking_A_Ranged_1H_Shooting", true, {
        label: "Andar + tiro 1H",
        combo: {
          lower: "Walking_A",
          upper: "Ranged_1H_Shooting",
        },
      }),
      clip("Combo_Running_A_Ranged_1H_Shooting", true, {
        label: "Correr + tiro 1H",
        combo: {
          lower: "Running_A",
          upper: "Ranged_1H_Shooting",
        },
      }),
    ],
  },
];
const movementOptions = animationGroups.flatMap((group) =>
  group.options.map((option) => ({ ...option, group: group.label })),
);
const movementById = new Map(movementOptions.map((option) => [option.id, option]));
const animationActions = new Map();
const sourceAnimationClips = new Map();
const weaponCache = new Map();

const lowerBodyBones = new Set([
  "upperleg.l",
  "upperleg.r",
  "lowerleg.l",
  "lowerleg.r",
  "foot.l",
  "foot.r",
  "toes.l",
  "toes.r",
]);
const upperBodyBones = new Set([
  "root",
  "hips",
  "spine",
  "chest",
  "head",
  "upperarm.l",
  "upperarm.r",
  "lowerarm.l",
  "lowerarm.r",
  "wrist.l",
  "wrist.r",
  "hand.l",
  "hand.r",
  "handslot.l",
  "handslot.r",
]);

let mixer = null;
let activeActions = [];
let activeMovementId = null;
let characterModel = null;
let heldSlot = null;
let currentHeldItem = null;
let activeWeapon = weaponOptions[0];
let equipRequestId = 0;

function clip(id, loop = false, options = {}) {
  return { id, loop, ...options };
}

function weapon(id, label, file, options = {}) {
  return {
    id,
    label,
    file,
    slotName: "handslot.r",
    url: new URL(`${gunPackPath}${file}`, import.meta.url).href,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
    ...options,
  };
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151515);
scene.fog = new THREE.Fog(0x151515, 15, 34);

const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 80);
camera.position.set(7, 5.2, 9.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
sceneElement.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.45;
controls.minDistance = 4;
controls.maxDistance = 22;
controls.target.set(0, 2.1, 0);
controls.addEventListener("start", () => {
  controls.autoRotate = false;
});

const ambientLight = new THREE.HemisphereLight(0xf7efd8, 0x24231f, 1.65);
const keyLight = new THREE.DirectionalLight(0xffedbd, 2.4);
keyLight.position.set(4.5, 8, 5.5);
const rimLight = new THREE.DirectionalLight(0xd6e6ff, 0.85);
rimLight.position.set(-5, 4, -4);
scene.add(ambientLight, keyLight, rimLight);

scene.add(createPlatform());

const loader = new GLTFLoader();
populateMovementSelect();
populateWeaponSelect();
setupAttachmentControls();
loadScene();

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(sceneElement);
resize();

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  if (mixer) {
    mixer.update(delta);
  }
  controls.update(delta);
  renderer.render(scene, camera);
});

async function loadScene() {
  try {
    setStatus("Carregando modelo e movimentos...");
    setMovementStatus("Carregando");
    setWeaponStatus("Arma: carregando");
    movementSelect.disabled = true;
    weaponSelect.disabled = true;
    setAttachmentControlsEnabled(false);

    const [modelGltf, ...animationGltfs] = await Promise.all([
      loadGltf(modelUrl),
      ...animationUrls.map((url) => loadGltf(url)),
    ]);

    characterModel = modelGltf.scene;
    prepareModel(characterModel);
    scene.add(characterModel);

    const modelBox = fitModelToPlatform(characterModel);
    heldSlot = findObjectByName(characterModel, activeWeapon.slotName);
    await equipWeapon(activeWeapon.id);
    frameModel(new THREE.Box3().setFromObject(characterModel).union(modelBox));
    setupAnimationMixer(characterModel, animationGltfs);
    movementSelect.disabled = false;
    weaponSelect.disabled = false;
    setAttachmentControlsEnabled(true);
    movementSelect.value = "Ranged_1H_Shooting";
    playMovement("Ranged_1H_Shooting", { restart: true });

    setStatus("Carregado", "done");
    window.setTimeout(() => hideStatus(), 550);
  } catch (error) {
    console.error(error);
    setStatus("Nao foi possivel carregar o modelo", "error");
    setMovementStatus("Erro ao carregar");
  }
}

function loadGltf(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

async function equipWeapon(weaponId) {
  const nextWeapon = weaponById.get(weaponId) || weaponOptions[0];
  const requestId = ++equipRequestId;
  activeWeapon = nextWeapon;
  weaponSelect.value = nextWeapon.id;
  updateAttachmentControls();

  if (!heldSlot) {
    setWeaponStatus(`Slot ${nextWeapon.slotName} nao encontrado`);
    return null;
  }

  setWeaponStatus(`Carregando ${nextWeapon.label}`);

  try {
    const source = await loadWeapon(nextWeapon);
    if (requestId !== equipRequestId) {
      return null;
    }

    detachCurrentWeapon();
    currentHeldItem = source.clone(true);
    currentHeldItem.name = nextWeapon.label;
    prepareHeldItem(currentHeldItem);
    applyWeaponTransform();
    heldSlot.add(currentHeldItem);
    setWeaponStatus(`Arma: ${nextWeapon.label}`);
    return currentHeldItem;
  } catch (error) {
    console.error(error);
    setWeaponStatus(`Erro: ${nextWeapon.label}`);
    return null;
  }
}

async function loadWeapon(weaponOption) {
  if (!weaponCache.has(weaponOption.id)) {
    weaponCache.set(weaponOption.id, loadGltf(weaponOption.url).then((gltf) => gltf.scene));
  }

  return weaponCache.get(weaponOption.id);
}

function detachCurrentWeapon() {
  if (!currentHeldItem) {
    return;
  }

  currentHeldItem.removeFromParent();
  currentHeldItem = null;
}

function applyWeaponTransform() {
  if (!currentHeldItem || !activeWeapon) {
    return;
  }

  currentHeldItem.position.fromArray(activeWeapon.position);
  currentHeldItem.rotation.fromArray(activeWeapon.rotation);
  currentHeldItem.scale.setScalar(activeWeapon.scale);
}

function findObjectByName(root, objectName) {
  const names = new Set([
    objectName,
    objectName.replace(/\./g, "_"),
    objectName.replace(/\./g, ""),
  ]);
  let match = null;

  root.traverse((node) => {
    if (match || !node.name) {
      return;
    }

    if (names.has(node.name)) {
      match = node;
    }
  });

  return match;
}

function prepareHeldItem(item) {
  item.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    node.castShadow = false;
    node.receiveShadow = false;
    node.frustumCulled = true;

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (!material) {
        continue;
      }

      if ("metalness" in material) {
        material.metalness = 0;
      }

      if ("roughness" in material) {
        material.roughness = 1;
      }

      material.needsUpdate = true;
    }
  });
}

function populateMovementSelect() {
  let currentGroup = null;
  let currentGroupElement = movementSelect;

  for (const option of movementOptions) {
    if (option.group !== currentGroup) {
      currentGroup = option.group;
      currentGroupElement = document.createElement("optgroup");
      currentGroupElement.label = currentGroup;
      movementSelect.append(currentGroupElement);
    }

    const element = document.createElement("option");
    element.value = option.id;
    element.textContent = labelForMovement(option.id);
    currentGroupElement.append(element);
  }

  movementSelect.value = "Idle_A";
  movementSelect.addEventListener("change", () => {
    playMovement(movementSelect.value, { restart: true });
  });
}

function populateWeaponSelect() {
  for (const option of weaponOptions) {
    const element = document.createElement("option");
    element.value = option.id;
    element.textContent = option.label;
    weaponSelect.append(element);
  }

  weaponSelect.value = activeWeapon.id;
  weaponSelect.addEventListener("change", () => {
    equipWeapon(weaponSelect.value);
  });
  updateAttachmentControls();
}

function setupAttachmentControls() {
  offsetXInput.addEventListener("input", () => {
    setWeaponOffset(0, offsetXInput.value);
  });

  offsetYInput.addEventListener("input", () => {
    setWeaponOffset(1, offsetYInput.value);
  });

  offsetZInput.addEventListener("input", () => {
    setWeaponOffset(2, offsetZInput.value);
  });

  weaponScaleInput.addEventListener("input", () => {
    setWeaponScale(weaponScaleInput.value);
  });

  copyInfoButton.addEventListener("click", () => {
    copyAttachmentInfo();
  });
}

function setWeaponOffset(axis, value) {
  activeWeapon.position[axis] = Number(value);
  updateAttachmentControls();
  applyWeaponTransform();
  setWeaponStatus(`Arma: ${activeWeapon.label}`);
}

function setWeaponScale(value) {
  activeWeapon.scale = Number(value);
  updateAttachmentControls();
  applyWeaponTransform();
  setWeaponStatus(`Arma: ${activeWeapon.label}`);
}

function updateAttachmentControls() {
  offsetXInput.value = String(activeWeapon.position[0]);
  offsetYInput.value = String(activeWeapon.position[1]);
  offsetZInput.value = String(activeWeapon.position[2]);
  weaponScaleInput.value = String(activeWeapon.scale);
  offsetXValue.value = formatOffset(activeWeapon.position[0]);
  offsetYValue.value = formatOffset(activeWeapon.position[1]);
  offsetZValue.value = formatOffset(activeWeapon.position[2]);
  weaponScaleValue.value = formatScale(activeWeapon.scale);
  offsetXValue.textContent = formatOffset(activeWeapon.position[0]);
  offsetYValue.textContent = formatOffset(activeWeapon.position[1]);
  offsetZValue.textContent = formatOffset(activeWeapon.position[2]);
  weaponScaleValue.textContent = formatScale(activeWeapon.scale);
}

function setAttachmentControlsEnabled(enabled) {
  offsetXInput.disabled = !enabled;
  offsetYInput.disabled = !enabled;
  offsetZInput.disabled = !enabled;
  weaponScaleInput.disabled = !enabled;
  copyInfoButton.disabled = !enabled;
}

async function copyAttachmentInfo() {
  const movementId = activeMovementId || movementSelect.value;
  const info = {
    movement: {
      id: movementId,
      label: labelForMovement(movementId),
    },
    weapon: {
      id: activeWeapon.id,
      label: activeWeapon.label,
      file: activeWeapon.file,
    },
    slot: activeWeapon.slotName,
    position: {
      x: roundValue(activeWeapon.position[0]),
      y: roundValue(activeWeapon.position[1]),
      z: roundValue(activeWeapon.position[2]),
    },
    rotation: {
      x: roundValue(activeWeapon.rotation[0]),
      y: roundValue(activeWeapon.rotation[1]),
      z: roundValue(activeWeapon.rotation[2]),
    },
    scale: roundValue(activeWeapon.scale),
  };
  const text = JSON.stringify(info, null, 2);

  try {
    await navigator.clipboard.writeText(text);
    setWeaponStatus("Informacoes copiadas");
  } catch {
    copyTextFallback(text);
    setWeaponStatus("Informacoes copiadas");
  }
}

function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function formatOffset(value) {
  return Number(value).toFixed(3);
}

function formatScale(value) {
  return Number(value).toFixed(2);
}

function roundValue(value) {
  return Number(Number(value).toFixed(4));
}

function setupAnimationMixer(model, animationGltfs) {
  mixer = new THREE.AnimationMixer(model);

  for (const gltf of animationGltfs) {
    for (const clip of gltf.animations || []) {
      sourceAnimationClips.set(clip.name, clip);
      const option = movementById.get(clip.name);
      if (!option) {
        continue;
      }

      const action = mixer.clipAction(clip);
      configureAction(action, option);
      animationActions.set(clip.name, { actions: [action] });
    }
  }

  setupCombinationActions();

  mixer.addEventListener("finished", (event) => {
    const clipName = event.action?._clip?.name || null;
    if (clipName === activeMovementId) {
      setMovementStatus(`Finalizado: ${labelForMovement(clipName)}`);
    }
  });
}

function setupCombinationActions() {
  for (const option of movementOptions) {
    if (!option.combo) {
      continue;
    }

    const lowerSource = sourceAnimationClips.get(option.combo.lower);
    const upperSource = sourceAnimationClips.get(option.combo.upper);
    if (!lowerSource || !upperSource) {
      console.warn(`Combinacao incompleta: ${option.id}`);
      continue;
    }

    const lowerClip = createMaskedClip(lowerSource, lowerBodyBones, `${option.id}_lower`);
    const upperClip = createMaskedClip(upperSource, upperBodyBones, `${option.id}_upper`);
    if (!lowerClip.tracks.length || !upperClip.tracks.length) {
      console.warn(`Combinacao sem tracks suficientes: ${option.id}`);
      continue;
    }

    const lowerAction = mixer.clipAction(lowerClip);
    const upperAction = mixer.clipAction(upperClip);
    configureAction(lowerAction, option);
    configureAction(upperAction, option);
    animationActions.set(option.id, { actions: [lowerAction, upperAction] });
  }
}

function configureAction(action, option) {
  action.enabled = true;

  if (option.loop) {
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
  } else {
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
  }

  action.timeScale = option.timeScale || 1;
}

function createMaskedClip(sourceClip, allowedBones, clipName) {
  const tracks = sourceClip.tracks
    .filter((track) => allowedBones.has(normalizeTrackNodeName(track.name)))
    .map((track) => track.clone());

  return new THREE.AnimationClip(clipName, sourceClip.duration, tracks);
}

function normalizeTrackNodeName(trackName) {
  const nodeName = trackName.replace(/\.(position|quaternion|scale|morphTargetInfluences)$/u, "");
  return nodeName
    .replace(/_/g, ".")
    .toLowerCase()
    .replace(/^(upperleg|lowerleg|foot|toes|upperarm|lowerarm|wrist|hand|handslot)([lr])$/u, "$1.$2");
}

function playMovement(clipName, { restart = false } = {}) {
  const nextEntry = animationActions.get(clipName);
  if (!nextEntry) {
    setMovementStatus(`Sem clipe: ${clipName}`);
    return false;
  }

  if (!restart && activeMovementId === clipName) {
    return true;
  }

  const nextActions = nextEntry.actions;

  for (const action of nextActions) {
    action.enabled = true;
    action.paused = false;
    action.setEffectiveWeight(1);
    action.reset().fadeIn(0.12).play();
  }

  for (const previousAction of activeActions) {
    if (!nextActions.includes(previousAction)) {
      previousAction.fadeOut(0.12);
    }
  }

  activeActions = nextActions;
  activeMovementId = clipName;
  setMovementStatus(`Ativo: ${labelForMovement(clipName)}`);
  return true;
}

function labelForMovement(clipName) {
  return movementById.get(clipName)?.label || formatClipLabel(clipName);
}

function formatClipLabel(clipName) {
  return clipName.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
}

function createPlatform() {
  const platform = new THREE.Group();
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.18, 10),
    new THREE.MeshStandardMaterial({
      color: 0x5d5a46,
      roughness: 0.86,
      metalness: 0.02,
    }),
  );
  deck.position.y = -0.09;

  const grid = new THREE.GridHelper(10, 10, 0xdfcc78, 0x3e3b30);
  grid.position.y = 0.006;

  const border = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-5, 0.012, -5),
      new THREE.Vector3(5, 0.012, -5),
      new THREE.Vector3(5, 0.012, 5),
      new THREE.Vector3(-5, 0.012, 5),
    ]),
    new THREE.LineBasicMaterial({ color: 0xe6d078 }),
  );

  platform.add(deck, grid, border);
  return platform;
}

function prepareModel(model) {
  model.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    node.castShadow = false;
    node.receiveShadow = false;
    node.frustumCulled = true;

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (material) {
        material.needsUpdate = true;
      }
    }
  });
}

function fitModelToPlatform(model) {
  const sourceBox = new THREE.Box3().setFromObject(model);
  const sourceSize = sourceBox.getSize(new THREE.Vector3());
  const maxDimension = Math.max(sourceSize.x, sourceSize.y, sourceSize.z);

  if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
    return sourceBox;
  }

  const targetHeight = 5.2;
  const maxFootprint = Math.max(sourceSize.x, sourceSize.z);
  let scale = targetHeight / Math.max(sourceSize.y, 0.001);

  if (maxFootprint * scale > 8.2) {
    scale = 8.2 / maxFootprint;
  }

  model.scale.setScalar(THREE.MathUtils.clamp(scale, 0.001, 1000));

  const fittedBox = new THREE.Box3().setFromObject(model);
  const fittedCenter = fittedBox.getCenter(new THREE.Vector3());
  model.position.x -= fittedCenter.x;
  model.position.z -= fittedCenter.z;
  model.position.y -= fittedBox.min.y;

  return new THREE.Box3().setFromObject(model);
}

function frameModel(modelBox) {
  const size = modelBox.getSize(new THREE.Vector3());
  const target = new THREE.Vector3(0, Math.max(1.45, Math.min(size.y * 0.45, 2.7)), 0);
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const viewHeight = Math.max(size.y * 1.22, 7.2);
  const viewWidth = Math.min(Math.max(Math.max(size.x, size.z) * 1.45, 5.6), 8.2);
  const distanceForHeight = viewHeight / (2 * Math.tan(verticalFov / 2));
  const distanceForWidth = viewWidth / (2 * Math.tan(verticalFov / 2) * Math.max(camera.aspect, 0.32));
  const distance = Math.max(distanceForHeight, distanceForWidth);
  const direction = new THREE.Vector3(0.56, 0.42, 0.9).normalize();

  controls.target.copy(target);
  camera.position.copy(target).addScaledVector(direction, distance);
  camera.lookAt(target);
  camera.updateProjectionMatrix();

  controls.minDistance = Math.max(3.5, distance * 0.35);
  controls.maxDistance = Math.max(18, distance * 1.7);
  controls.update();
}

function resize() {
  const width = Math.max(sceneElement.clientWidth, 1);
  const height = Math.max(sceneElement.clientHeight, 1);

  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function setStatus(message, state = "loading") {
  statusElement.textContent = message;
  statusElement.classList.toggle("is-error", state === "error");
  statusElement.classList.remove("is-hidden");
}

function setMovementStatus(message) {
  movementStatus.textContent = message;
}

function setWeaponStatus(message) {
  weaponStatus.textContent = message;
}

function hideStatus() {
  statusElement.classList.add("is-hidden");
}
