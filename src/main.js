import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { clone as cloneSkeleton } from "three/addons/utils/SkeletonUtils.js";
import { defaultMapConfig } from "./map-config.js";

const sceneElement = document.querySelector("[data-scene]");
const statusElement = document.querySelector("#status");
const statusTextElement = document.querySelector("#statusText");
const crosshairElement = document.querySelector("[data-crosshair]");
const phoneShellElement = document.querySelector(".phone-shell");
const healthHudElement = document.querySelector("[data-health-hud]");
const healthBarFillElement = document.querySelector("[data-health-bar-fill]");
const ammoHudElement = document.querySelector("[data-ammo-hud]");
const ammoCountElement = document.querySelector("[data-ammo-count]");
const ammoPickupToastElement = document.querySelector("[data-ammo-pickup-toast]");
const weaponSlotHudElement = document.querySelector("[data-weapon-slot-hud]");
const weaponSlotElements = document.querySelectorAll("[data-combat-weapon-slot]");
const damageFlashElement = document.querySelector("[data-damage-flash]");
const stageBannerElement = document.querySelector("[data-stage-banner]");
const runTimerElement = document.querySelector("[data-run-timer]");
const runSummaryModalElement = document.querySelector("[data-run-summary-modal]");
const runSummaryTitleElement = document.querySelector("[data-run-summary-title]");
const runSummaryBodyElement = document.querySelector("[data-run-summary-body]");
const startRecordsOpenButton = document.querySelector("[data-start-records-open]");
const startRecordsModalElement = document.querySelector("[data-start-records-modal]");
const startRecordsBodyElement = document.querySelector("[data-start-records-body]");
const startRecordsCloseButton = document.querySelector("[data-start-records-close]");
const restartRunButton = document.querySelector("[data-restart-run-button]");
const exitRunButton = document.querySelector("[data-exit-run-button]");
const optionsModalElement = document.querySelector("[data-options-modal]");
const optionsOpenButtons = document.querySelectorAll("[data-options-open]");
const optionsCloseButton = document.querySelector("[data-options-close]");
const optionsRestartButton = document.querySelector("[data-options-restart]");
const optionsExitButton = document.querySelector("[data-options-exit]");
const optionsGameActionsElement = document.querySelector("[data-options-game-actions]");
const musicVolumeInput = document.querySelector("[data-music-volume]");
const musicVolumeValue = document.querySelector("[data-music-volume-value]");
const sfxVolumeInput = document.querySelector("[data-sfx-volume]");
const sfxVolumeValue = document.querySelector("[data-sfx-volume-value]");
const mobileJoystickElement = document.querySelector("[data-mobile-joystick]");
const mobileJoystickStickElement = document.querySelector("[data-mobile-joystick-stick]");
const mobileFireButton = document.querySelector("[data-mobile-fire-button]");
const corpseSearchButton = document.querySelector("[data-corpse-search-button]");
const startScreen = document.querySelector("#startScreen");
const startButton = document.querySelector("#startButton");
const mapCanvas = document.querySelector("#mapCanvas");
const mapViewport = document.querySelector("#mapViewport");
const mapStatus = document.querySelector("#mapStatus");
const mapFeedback = document.querySelector("#mapFeedback");
const mapHudElement = document.querySelector("[data-map-hud]");
const mapZoomOutButton = document.querySelector("#mapZoomOut");
const mapZoomResetButton = document.querySelector("#mapZoomReset");
const mapZoomInButton = document.querySelector("#mapZoomIn");
const applyMapButton = document.querySelector("#applyMapButton");
const clearMapButton = document.querySelector("#clearMapButton");
const generateMapButton = document.querySelector("#generateMapButton");
const saveFloorButton = document.querySelector("#saveFloorButton");
const floorStackElement = document.querySelector("#floorStack");
const showTileEdgesInput = document.querySelector("#showTileEdges");
const showTileEdgesValue = document.querySelector("#showTileEdgesValue");
const mapCoveredInput = document.querySelector("#mapCovered");
const mapCoveredValue = document.querySelector("#mapCoveredValue");
const mapToolButtons = document.querySelectorAll("[data-map-tool]");
const floorMaterialSelect = document.querySelector("#floorMaterialSelect");
const wallMaterialSelect = document.querySelector("#wallMaterialSelect");
const ceilingMaterialSelect = document.querySelector("#ceilingMaterialSelect");
const floorMaterialPreview = document.querySelector("#floorMaterialPreview");
const wallMaterialPreview = document.querySelector("#wallMaterialPreview");
const ceilingMaterialPreview = document.querySelector("#ceilingMaterialPreview");
const materialPreviewPopover = document.querySelector("#materialPreviewPopover");
const materialPreviewPopoverImage = document.querySelector("#materialPreviewPopoverImage");
const materialPreviewPopoverLabel = document.querySelector("#materialPreviewPopoverLabel");
const devLayoutElement = document.querySelector(".dev-layout");
const devTabButtons = document.querySelectorAll("[data-dev-tab]");
const devTabPanels = document.querySelectorAll("[data-dev-panel]");
const cameraStatus = document.querySelector("#cameraStatus");
const freeCameraInput = document.querySelector("#freeCamera");
const freeCameraValue = document.querySelector("#freeCameraValue");
const cameraSideLeftInput = document.querySelector("#cameraSideLeft");
const cameraSideLeftValue = document.querySelector("#cameraSideLeftValue");
const cameraOrbitInput = document.querySelector("#cameraOrbit");
const cameraOffsetXInput = document.querySelector("#cameraOffsetX");
const cameraOffsetYInput = document.querySelector("#cameraOffsetY");
const cameraOffsetZInput = document.querySelector("#cameraOffsetZ");
const cameraOrbitValue = document.querySelector("#cameraOrbitValue");
const cameraOffsetXValue = document.querySelector("#cameraOffsetXValue");
const cameraOffsetYValue = document.querySelector("#cameraOffsetYValue");
const cameraOffsetZValue = document.querySelector("#cameraOffsetZValue");
const copyCameraButton = document.querySelector("#copyCameraButton");
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
const colorPanel = document.querySelector("#colorPanel");
const colorStatus = document.querySelector("#colorStatus");
const resetColorsButton = document.querySelector("#resetColorsButton");
const copyColorsButton = document.querySelector("#copyColorsButton");
const visualExposureInput = document.querySelector("#visualExposure");
const visualAmbientLightInput = document.querySelector("#visualAmbientLight");
const visualDirectLightInput = document.querySelector("#visualDirectLight");
const visualLightDirectionInput = document.querySelector("#visualLightDirection");
const visualFogInput = document.querySelector("#visualFog");
const collisionDebugInput = document.querySelector("#collisionDebug");
const visualExposureValue = document.querySelector("#visualExposureValue");
const visualAmbientLightValue = document.querySelector("#visualAmbientLightValue");
const visualDirectLightValue = document.querySelector("#visualDirectLightValue");
const visualLightDirectionValue = document.querySelector("#visualLightDirectionValue");
const visualFogValue = document.querySelector("#visualFogValue");
const collisionDebugValue = document.querySelector("#collisionDebugValue");
const visualTuningStatus = document.querySelector("#visualTuningStatus");
const copyVisualTuningButton = document.querySelector("#copyVisualTuningButton");
const modelUrl = new URL("../assets/HUNK.glb", import.meta.url).href;
const minionUrl = new URL("../assets/minion.glb", import.meta.url).href;
const enemyMovementSoundUrls = [
  new URL("../assets/audio/zombie-walk-groan-a.mp3", import.meta.url).href,
  new URL("../assets/audio/zombie-walk-groan-b.mp3", import.meta.url).href,
];
const pistolShotSoundUrl = new URL("../assets/audio/pistol-shot-9mm.mp3", import.meta.url).href;
const shotgunShotSoundUrl = new URL("../assets/audio/shotgun-shot.mp3", import.meta.url).href;
const ammoReloadSoundUrl = new URL("../assets/audio/ammo-reload-1911.mp3", import.meta.url).href;
const floorMusicUrls = [
  new URL("../assets/audio/floor-music-1.mp3", import.meta.url).href,
  new URL("../assets/audio/floor-music-2.mp3", import.meta.url).href,
  new URL("../assets/audio/floor-music-3.mp3", import.meta.url).href,
  new URL("../assets/audio/floor-music-4.mp3", import.meta.url).href,
];
const runtimeHost = window.location.hostname;
const runtimeSearchParams = new URLSearchParams(window.location.search);
const runtimeMobileOverride = runtimeSearchParams.has("mobile");
const runtimePerfOverlayEnabled = runtimeSearchParams.has("perf");
const runtimeHasCoarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
const runtimeIsTouchDevice = navigator.maxTouchPoints > 0 || runtimeHasCoarsePointer;
const runtimeIsMobile = runtimeMobileOverride
  || (runtimeIsTouchDevice && window.matchMedia?.("(max-width: 1024px)")?.matches);
const runtimeIsLocal = window.location.protocol === "file:"
  || runtimeHost === "localhost"
  || runtimeHost === "127.0.0.1"
  || runtimeHost === "::1";
const runtimeIsGithubPages = runtimeHost.endsWith("github.io");
const runtimeIsStaticHosted = !runtimeIsLocal && runtimeIsGithubPages;
const gunPackPath = "../assets/Styloo Guns Asset Pack GLTF FBX V1.1/Normal version Color and NormalMap/GLB/";
const sewerTextureUrls = {
  floor: [
    { id: "concrete-base", label: "Concreto base", url: new URL("../assets/Sewer/Textures/concrete_base.png", import.meta.url).href, repeatX: 1.5, repeatY: 1.5, color: 0x8f8974 },
    { id: "concrete-base-02", label: "Concreto claro", url: new URL("../assets/Sewer/Textures/concrete_base_02.jpg", import.meta.url).href, repeatX: 1.45, repeatY: 1.45, color: 0x86836f },
    { id: "debris-02", label: "Entulho", url: new URL("../assets/Sewer/Textures/debris_02.jpg", import.meta.url).href, repeatX: 1.35, repeatY: 1.35, color: 0x7d7966 },
    { id: "soil-mud", label: "Lama", url: new URL("../assets/Sewer/Textures/soil_mud.jpg", import.meta.url).href, repeatX: 1.75, repeatY: 1.75, color: 0x716b58 },
    { id: "concrete-dirty-2", label: "Concreto sujo", url: new URL("../assets/Sewer/Textures/concrete_dirty_2.jpg", import.meta.url).href, repeatX: 1.65, repeatY: 1.65, color: 0x8a8368 },
    ...createTexturePackVariants({ idPrefix: "grass", folder: "Grass", filePrefix: "Grass", labelPrefix: "Grama", color: 0x6f8a49 }),
    ...createTexturePackVariants({ idPrefix: "tile", folder: "Tile", filePrefix: "Tile", labelPrefix: "Tile", color: 0x8c8b78 }),
    ...createTexturePackVariants({ idPrefix: "wood", folder: "Wood", filePrefix: "Wood", labelPrefix: "Madeira", color: 0x8b6a46 }),
  ],
  wall: [
    { id: "brick-modern-01", label: "Tijolo moderno", url: new URL("../assets/Sewer/Textures/brick_modern_01.jpg", import.meta.url).href, repeatX: 2.4, repeatY: 3.6, color: 0x7d7a68 },
    { id: "concrete-dirty", label: "Concreto manchado", url: new URL("../assets/Sewer/Textures/concrete_dirty.jpg", import.meta.url).href, repeatX: 1.7, repeatY: 2.6, color: 0x79776b },
    { id: "concrete-dirty-2", label: "Concreto escuro", url: new URL("../assets/Sewer/Textures/concrete_dirty_2.jpg", import.meta.url).href, repeatX: 1.35, repeatY: 2.2, color: 0x747164 },
    { id: "metal", label: "Metal", url: new URL("../assets/Sewer/Textures/Metal.jpg", import.meta.url).href, repeatX: 1.6, repeatY: 2.2, color: 0x8b8a82, metalness: 0.18, roughness: 0.82 },
    { id: "bricks", label: "Tijolos", url: new URL("../assets/Sewer/Textures/bricks.jpg", import.meta.url).href, repeatX: 2.1, repeatY: 2.1, color: 0x777465 },
    ...createTexturePackVariants({ idPrefix: "bricks", folder: "Bricks", filePrefix: "Bricks", labelPrefix: "Tijolo", color: 0x877565 }),
    ...createTexturePackVariants({ idPrefix: "wood", folder: "Wood", filePrefix: "Wood", labelPrefix: "Madeira", color: 0x8b6a46 }),
  ],
  ceiling: [
    { id: "bricks", label: "Tijolos", url: new URL("../assets/Sewer/Textures/bricks.jpg", import.meta.url).href, repeatX: 2.1, repeatY: 2.1, color: 0x777465 },
    { id: "concrete-dirty-2", label: "Concreto escuro", url: new URL("../assets/Sewer/Textures/concrete_dirty_2.jpg", import.meta.url).href, repeatX: 1.45, repeatY: 1.45, color: 0x777263 },
    ...createTexturePackVariants({ idPrefix: "wood", folder: "Wood", filePrefix: "Wood", labelPrefix: "Madeira", color: 0x8b6a46 }),
  ],
};
const sewerMaterialOptions = createSewerMaterialOptions(sewerTextureUrls);
const sewerMaterialIdsBySurface = Object.fromEntries(
  Object.entries(sewerTextureUrls).map(([surface, variants]) => [
    surface,
    new Set(variants.map((material) => material.id)),
  ]),
);
const defaultMapMaterials = {
  floor: sewerTextureUrls.floor[0].id,
  wall: sewerTextureUrls.wall[0].id,
  ceiling: sewerTextureUrls.ceiling[0].id,
};
const materialControls = {
  floor: { select: floorMaterialSelect, preview: floorMaterialPreview },
  wall: { select: wallMaterialSelect, preview: wallMaterialPreview },
  ceiling: { select: ceilingMaterialSelect, preview: ceilingMaterialPreview },
};
const mapTools = new Set(["tile", "enemy", "boss"]);
const mapDirectionOptions = [
  { id: "east", x: 1, z: 0 },
  { id: "southeast", x: 1, z: 1 },
  { id: "south", x: 0, z: 1 },
  { id: "southwest", x: -1, z: 1 },
  { id: "west", x: -1, z: 0 },
  { id: "northwest", x: -1, z: -1 },
  { id: "north", x: 0, z: -1 },
  { id: "northeast", x: 1, z: -1 },
];
const defaultMapDirection = "south";
const mapSize = 16;
const mapCenter = mapSize / 2;
const platformTileSize = 5;
const platformThickness = 0.18;
const platformTileGap = 0.04;
const platformWallTilesHigh = 2;
const platformWallHeight = platformTileSize * platformWallTilesHigh;
const platformWallThickness = 0.32;
const platformCeilingThickness = 0.2;
const wallOcclusionOpacity = 0.16;
const cameraCollisionRadius = 1.05;
const cameraCollisionWallPadding = 0.42;
const cameraCollisionReturnDamping = 12;
const cameraCollisionSearchSteps = 14;
const cameraCollisionSearchIterations = 8;
const cameraCloseViewRatioStart = 0.42;
const cameraCloseViewRatioEnd = 0.18;
const gameplayCameraIntroDuration = 5;
const gameplayCameraIntroGoBannerDuration = 0.65;
const gameplayCameraIntroDollyRatio = 0.72;
const gameplayCameraIntroStartDistance = 12.5;
const gameplayCameraIntroMidDistance = 2.25;
const gameplayCameraIntroStartHeight = 3.9;
const gameplayCameraIntroFaceHeight = 4.15;
const gameplayCameraIntroTargetHeight = 3.55;
const gameplayCameraOutroDuration = 4.2;
const gameplayCameraOutroPivotRatio = 0.42;
const gameplayCameraOutroNearDistance = 2.35;
const gameplayCameraOutroFarDistance = 12.5;
const gameplayCameraOutroFaceHeight = 4.1;
const gameplayCameraOutroTargetHeight = 3.55;
const playerCameraFadeStartDistance = 1.7;
const playerCameraFadeStartCollisionRatio = 0.68;
const cameraCollisionProbeOffsets = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0.7071, 0.7071],
  [-0.7071, 0.7071],
  [0.7071, -0.7071],
  [-0.7071, -0.7071],
];
const mapZoomMin = 1;
const mapZoomMax = 3.5;
const mapZoomStep = 0.25;
const mapPlayerMagnetRadius = 0.16;
const anchoredCameraPreset = {
  baseOrbitDegrees: 178,
  cameraOffset: new THREE.Vector3(-4.445, 3.165, -9.843),
  targetOffset: new THREE.Vector3(-2.05, 2.843, 2.373),
};
const defaultCameraOffset = {
  x: 0.2,
  y: 1.2,
  z: 0.2,
};
const defaultToneMappingExposure = 1.45;
const defaultAmbientLightIntensity = 2.65;
const defaultDirectLightIntensity = 0.25;
const defaultLightDirectionDegrees = 0;
const defaultFogDensity = 0.014;
const visualFogColor = 0x0b140f;
const defaultPlayerAimPitchRadians = THREE.MathUtils.degToRad(7.63);
const freeCameraMoveSpeed = 12;
const freeCameraWheelSpeed = 0.018;
const playerWalkSpeed = 5.4;
const playerRunSpeed = 9.4;
const playerAimMoveSpeedMultiplier = 0.62;
const playerCollisionRadius = 0.72;
const playerWallCollisionPadding = platformWallThickness / 2 + 0.18;
const playerMouseYawSensitivity = 0.0028;
const playerMousePitchSensitivity = 0.0022;
const playerAimMouseSensitivityMultiplier = 0.68;
const playerMousePitchLimit = THREE.MathUtils.degToRad(22);
const mobileLookYawSensitivity = 0.0052;
const mobileLookPitchSensitivity = 0.0042;
const mobileJoystickRadius = 58;
const mobileJoystickDeadZone = 0.08;
const mobileJoystickRunThreshold = 0.92;
const playerMaxHealth = 50;
const playerMaxAmmo = 20;
const playerStartingAmmo = 20;
const shotgunStartingAmmo = 10;
const playerFireInterval = 1;
const projectileMaxDistance = 80;
const projectileBodyDamage = 2;
const projectileHeadDamage = 10;
const shotgunMaxDistance = platformTileSize * 5;
const shotgunConeBaseRadius = 0.26;
const shotgunConeRadiusPerTile = 0.34;
const shotgunTrailParticleCount = 28;
const shotgunTrailParticleDuration = 0.16;
const shotgunTrailParticleBaseScale = 0.11;
const shotgunDamageSteps = [
  { maxTiles: 1, multiplier: 4 },
  { maxTiles: 2, multiplier: 3 },
  { maxTiles: 4, multiplier: 1 },
  { maxTiles: 5, multiplier: 0.5 },
];
const ammoPickupAmount = 10;
const ammoDropChance = 0.25;
const ammoPickupCollectRadius = 1.35;
const ammoPickupMagnetRadius = 2.15;
const ammoPickupMagnetSpeed = 9;
const ammoPickupBoxHeight = 0.22;
const ammoPickupToastDuration = 0.9;
const corpseSearchDuration = 6;
const corpseSearchRadius = platformTileSize;
const corpseSearchAmmoAmount = 5;
const corpseSearchFindChance = 0.5;
const corpseSearchAnimationRestartSeconds = 0.9;
const shotgunChestFloorIndex = 1;
const shotgunChestTriggerRadius = 1.45;
const shotgunPickupRadius = 1.15;
const shotgunDropDuration = 0.72;
const shotgunDropArcHeight = 0.9;
const runRecordsStorageKey = "theRank.records.v1";
const optionsStorageKey = "theRank.options.v1";
const damageNumberCanvasWidth = 128;
const damageNumberCanvasHeight = 80;
const damageNumberDuration = 0.78;
const damageNumberRise = 1.15;
const impactEffectDuration = 0.22;
const impactLightIntensity = 5.6;
const muzzleFlashDuration = 0.12;
const muzzleFlashLightIntensity = 15;
const playerShotAnimationDuration = 0.32;
const playerShotWindupDuration = 0.14;
const enemyHitReactDuration = 0.18;
const enemyMaxHealth = 20;
const bossHealthMultiplier = 4;
const bossScaleMultiplier = 2;
const bossSpeedMultiplier = 3;
const bossAttackDamageMultiplier = 3;
const bossSpawnCountdownSeconds = 10;
const enemyVisionDistance = platformTileSize * 7.2;
const enemyWalkSpeed = 1.35;
const enemyPathRepathInterval = 0.45;
const enemyPathWaypointRadius = 0.32;
const enemyInitialInactiveFloorChance = 0.5;
const enemyCollisionRadius = 0.75;
const enemyMovementSoundVolume = 0.52;
const enemyMovementSoundBossVolume = 0.64;
const enemyMovementSoundRefDistance = platformTileSize * 0.85;
const enemyMovementSoundMaxDistance = enemyVisionDistance * 1.08;
const enemyMovementSoundRolloff = 1.7;
const pistolShotSoundVolume = 0.82;
const shotgunShotSoundVolume = 0.86;
const ammoReloadSoundVolume = 0.72;
const enemyAttackRange = 1.65;
const enemyAttackDamage = 6;
const enemyAttackCooldown = 1.25;
const enemyAttackHitTime = 0.42;
const collisionDebugFillOpacity = 0.18;
const collisionDebugEdgeOpacity = 0.78;
const collisionDebugPlayerColor = 0x3ccfff;
const collisionDebugEnemyColor = 0xff5d4e;
const enemyHalfHealthFallChance = 0.3;
const enemyDownedSecondsMin = 1.8;
const enemyDownedSecondsMax = 3.2;
const performanceProfile = createPerformanceProfile();
const defaultMovementId = "Idle_A";
const bossClearCelebrationAnimationIds = [
  "EXPERIMENTAL_Medium_Transform",
  "Push_Ups",
  "Cheering",
  "Sit_Ups",
];
const defaultWeaponId = "pew";
const rogueTextureAtlas = {
  size: 1024,
  rows: 8,
  columns: 8,
  cellSize: 128,
};
const roguePaletteControls = [
  { label: "Pele", slots: ["r6c0", "r7c0"] },
  { label: "Cabelo", slots: ["r6c1", "r7c1", "r7c2"] },
  { label: "Roupas 1", slots: ["r4c1", "r5c1"] },
  { label: "Roupas 2", slots: ["r4c0", "r4c7", "r5c0"] },
  { label: "Roupas 3", slots: ["r2c3", "r2c7", "r3c3", "r3c7", "r6c5", "r6c6", "r7c5", "r7c6"] },
  { label: "Roupas 4", slots: ["r5c7", "r6c3", "r7c3"] },
];
const rogueDefaultSlots = {
  r2c3: "#212121",
  r2c7: "#212121",
  r3c3: "#212121",
  r3c7: "#212121",
  r4c0: "#343A4B",
  r4c1: "#212121",
  r4c7: "#343A4B",
  r5c0: "#343A4B",
  r5c1: "#212121",
  r5c7: "#343A4B",
  r6c0: "#212121",
  r6c1: "#343A4B",
  r6c3: "#343A4B",
  r6c5: "#212121",
  r6c6: "#212121",
  r7c0: "#212121",
  r7c1: "#343A4B",
  r7c2: "#343A4B",
  r7c3: "#343A4B",
  r7c5: "#212121",
  r7c6: "#212121",
};
const weaponOptions = [
  weapon("mac10", "MAC-10", "mac10.glb", { position: [0.01, 0.02, 0.005], scale: 3 }),
  weapon("ak47", "AK-47", "ak47.glb", { position: [0.01, 0.02, 0.005], scale: 0.92, holdStyle: "twoHand" }),
  weapon("ak47variant", "AK-47 Variant", "ak47variant.glb", { position: [0.01, 0.02, 0.005], scale: 0.92, holdStyle: "twoHand" }),
  weapon("awp", "AWP", "awp.glb", { position: [0.01, 0.02, 0.005], scale: 0.62, holdStyle: "twoHand" }),
  weapon("shotgun", "Shotgun", "shotgun.glb", { position: [0.015, 0.03, 0.008], scale: 3.5, holdStyle: "twoHand" }),
  weapon("pew", "Pew pistol", "pew.glb", { position: [0.095, 0.07, 0.04], scale: 4 }),
  weapon("nade", "Grenade", "nade_low.glb", { position: [0.01, 0.02, 0.005], scale: 3 }),
  weapon("nadevariant", "Grenade variant", "nadevariant_low.glb", { position: [0.01, 0.02, 0.005], scale: 2.6 }),
  weapon("flashbang", "Flashbang", "flashbang_low.glb", { position: [0.01, 0.02, 0.005], scale: 3 }),
  weapon("smoke", "Smoke grenade", "smoke_low.glb", { position: [0.01, 0.02, 0.005], scale: 2.7 }),
  weapon("incendiary", "Incendiary grenade", "incendiary_low.glb", { position: [0.01, 0.02, 0.005], scale: 2.7 }),
];
const weaponById = new Map(weaponOptions.map((option) => [option.id, option]));
const defaultCombatWeaponId = "pew";
const shotgunCombatWeaponId = "shotgun";
const combatWeaponConfigs = [
  {
    id: defaultCombatWeaponId,
    slot: "1",
    label: "Pistol",
    maxAmmo: playerMaxAmmo,
    startingAmmo: playerStartingAmmo,
    ammoClass: "is-weapon-pistol",
  },
  {
    id: shotgunCombatWeaponId,
    slot: "2",
    label: "Shotgun",
    maxAmmo: playerMaxAmmo,
    startingAmmo: 0,
    grantAmmo: shotgunStartingAmmo,
    ammoClass: "is-weapon-shotgun",
  },
];
const combatWeaponConfigById = new Map(combatWeaponConfigs.map((config) => [config.id, config]));
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
      clip("Ranged_1H_Aiming", false),
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
      clip("Combo_Walking_A_Ranged_1H_Aiming", true, {
        label: "Andar + mirar 1H",
        combo: {
          lower: "Walking_A",
          upper: "Ranged_1H_Aiming",
          upperLoop: false,
        },
      }),
      clip("Combo_Running_B_Ranged_1H_Aiming", true, {
        label: "Correr B + mirar 1H",
        combo: {
          lower: "Running_B",
          upper: "Ranged_1H_Aiming",
          upperLoop: false,
        },
      }),
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
      clip("Combo_Running_B_Ranged_1H_Shooting", true, {
        label: "Correr B + tiro 1H",
        combo: {
          lower: "Running_B",
          upper: "Ranged_1H_Shooting",
        },
      }),
      clip("Combo_Walking_A_Ranged_2H_Aiming", true, {
        label: "Andar + mirar 2H",
        combo: {
          lower: "Walking_A",
          upper: "Ranged_2H_Aiming",
        },
      }),
      clip("Combo_Running_B_Ranged_2H_Aiming", true, {
        label: "Correr B + mirar 2H",
        combo: {
          lower: "Running_B",
          upper: "Ranged_2H_Aiming",
        },
      }),
      clip("Combo_Walking_A_Ranged_2H_Shooting", true, {
        label: "Andar + tiro 2H",
        combo: {
          lower: "Walking_A",
          upper: "Ranged_2H_Shooting",
        },
      }),
      clip("Combo_Running_A_Ranged_2H_Shooting", true, {
        label: "Correr + tiro 2H",
        combo: {
          lower: "Running_A",
          upper: "Ranged_2H_Shooting",
        },
      }),
      clip("Combo_Running_B_Ranged_2H_Shooting", true, {
        label: "Correr B + tiro 2H",
        combo: {
          lower: "Running_B",
          upper: "Ranged_2H_Shooting",
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
const paletteMaterials = new Set();
const maskAtlasMaterials = new Set();
const enemyAnimationIds = [
  "Skeletons_Idle",
  "Skeletons_Walking",
  "Skeletons_Awaken_Floor",
  "Skeletons_Awaken_Floor_Long",
  "Skeletons_Inactive_Floor_Pose",
  "Skeletons_Spawn_Ground",
  "Skeletons_Death",
  "Skeletons_Death_Pose",
  "Skeletons_Death_Resurrect",
  "Melee_Unarmed_Attack_Punch_A",
  "Melee_1H_Attack_Chop",
];
const enemyLoopingAnimations = new Set([
  "Skeletons_Idle",
  "Skeletons_Walking",
  "Skeletons_Inactive_Floor_Pose",
  "Skeletons_Death_Pose",
]);
const enemyPrimaryAttackAnimation = "Melee_Unarmed_Attack_Punch_A";
const enemyFallbackAttackAnimation = "Melee_1H_Attack_Chop";

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
let activeWeapon = weaponById.get(defaultWeaponId) || weaponOptions[0];
let equipRequestId = 0;
let sourceCharacterTextureImage = null;
let sourceCharacterTextureSettings = null;
let activePaletteTexture = null;
let activeMaskPaletteTexture = null;
let paletteDraft = createRoguePaletteDraft();
let visualTuningState = createVisualTuningState();
let mapEditorState = createInitialMapEditorState();
let cameraControlState = createCameraControlState();
let playerControlState = createPlayerControlState();
let gameplayCameraIntroState = createGameplayCameraIntroState();
let gameplayCameraOutroState = createGameplayCameraOutroState();
let collisionDebugState = createCollisionDebugState();
let optionsMenuState = createOptionsMenuState();
let platformGroup = null;
let enemySourceModel = null;
let enemyGroup = null;
let enemyMovementSoundBuffers = [];
let pistolShotSoundBuffer = null;
let pistolShotSound = null;
let shotgunShotSoundBuffer = null;
let shotgunShotSound = null;
let ammoReloadSoundBuffer = null;
let ammoReloadSound = null;
let floorMusicBuffers = [];
let floorMusicSound = null;
let activeFloorMusicIndex = null;
let floorMusicPausedForOptions = false;
let activeEnemies = [];
let activeImpactEffects = [];
let activeMuzzleFlashes = [];
let activeShotgunTrailParticles = [];
let activeDamageNumbers = [];
let activeAmmoPickups = [];
let activeLootChest = null;
let activeWeaponDrop = null;
let ammoPickupToastTimer = 0;
let corpseSearchState = createCorpseSearchState();
let manualMovementPreviewId = null;
let playerCameraOpacity = 1;
const wallOcclusionRaycaster = new THREE.Raycaster();
const wallOcclusionTarget = new THREE.Vector3();
const wallOcclusionDirection = new THREE.Vector3();
const wallOccluders = new Set();
let wallOccluderList = [];
const transparentWallOccluders = new Set();
const enemyLineOfSightRaycaster = new THREE.Raycaster();
const enemyBoundsBox = new THREE.Box3();
const enemyBoundsSize = new THREE.Vector3();
const enemyEyePosition = new THREE.Vector3();
const enemyMoveDirection = new THREE.Vector3();
const enemyNextPosition = new THREE.Vector3();
const enemyPlayerTarget = new THREE.Vector3();
const enemyProjectileRaycaster = new THREE.Raycaster();
const projectileDirection = new THREE.Vector3();
const shotImpactPoint = new THREE.Vector3();
const shotImpactNormal = new THREE.Vector3();
const projectileEnemyHit = {
  enemy: null,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3(),
  distance: Infinity,
  headshot: false,
};
const projectileHitPoint = new THREE.Vector3();
const projectileBodyBox = new THREE.Box3();
const projectileHeadBox = new THREE.Box3();
const shotgunConeCenter = new THREE.Vector3();
const shotgunConeOffset = new THREE.Vector3();
const shotgunConeClosestPoint = new THREE.Vector3();
const shotgunConeImpactPoint = new THREE.Vector3();
const shotgunConeNormal = new THREE.Vector3();
const shotgunConeBoxSize = new THREE.Vector3();
const shotgunEnemyHits = [];
const shotgunTrailOrigin = new THREE.Vector3();
const shotgunTrailRight = new THREE.Vector3();
const shotgunTrailUp = new THREE.Vector3();
const shotgunTrailRadial = new THREE.Vector3();
const shotgunTrailVelocity = new THREE.Vector3();
const damageNumberPosition = new THREE.Vector3();
const damageNumberCameraOffset = new THREE.Vector3();
const ammoPickupPosition = new THREE.Vector3();
const lootChestPosition = new THREE.Vector3();
const weaponDropStartPosition = new THREE.Vector3();
const weaponDropEndPosition = new THREE.Vector3();
const muzzleFlashPosition = new THREE.Vector3();
const muzzleFlashWeaponCenter = new THREE.Vector3();
const muzzleFlashWeaponSize = new THREE.Vector3();
const muzzleFlashWeaponBox = new THREE.Box3();
const cameraCollisionRaycaster = new THREE.Raycaster();
const cameraCollisionDirection = new THREE.Vector3();
const cameraCollisionRayDirection = new THREE.Vector3();
const cameraCollisionResolvedPosition = new THREE.Vector3();
const cameraCollisionProbePosition = new THREE.Vector3();
const cameraCloseLookDirection = new THREE.Vector3();
const cameraCloseLookTarget = new THREE.Vector3();
const cameraBlendedLookTarget = new THREE.Vector3();
const anchoredCameraOffsetVector = new THREE.Vector3();
const anchoredCameraCameraOffset = new THREE.Vector3();
const anchoredCameraLookOffset = new THREE.Vector3();
const anchoredCameraManualOffset = new THREE.Vector3();
const anchoredCameraTargetPosition = new THREE.Vector3();
const anchoredCameraDesiredPosition = new THREE.Vector3();
const anchoredCameraYawAxis = new THREE.Vector3(0, 1, 0);
const anchoredCameraPitchAxis = new THREE.Vector3();
const gameplayCameraIntroForward = new THREE.Vector3();
const gameplayCameraIntroPosition = new THREE.Vector3();
const gameplayCameraIntroTarget = new THREE.Vector3();
const gameplayCameraOutroForward = new THREE.Vector3();
const gameplayCameraOutroPosition = new THREE.Vector3();
const gameplayCameraOutroTarget = new THREE.Vector3();
const playerMoveVector = new THREE.Vector3();
const playerForwardVector = new THREE.Vector3();
const playerRightVector = new THREE.Vector3();
const playerFadeMaterialState = new WeakMap();
const collisionDebugBoundsBox = new THREE.Box3();
const collisionDebugBoundsSize = new THREE.Vector3();
const wallOcclusionHitSet = new Set();
const impactEffectPool = [];
const muzzleFlashPool = [];
const shotgunTrailParticlePool = [];
let mapEditorSyncTimer = 0;
let mapEditorSyncPending = false;
let perfOverlayState = null;
let sceneLoadStarted = false;
let sceneReady = false;
let stageFlowState = createStageFlowState();
let runTimingState = createRunTimingState();

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

const impactGeometry = new THREE.SphereGeometry(0.075, 10, 6);
const impactMaterial = new THREE.MeshBasicMaterial({
  color: 0xfff1c1,
  transparent: true,
  opacity: 0.92,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const muzzleFlashGeometry = new THREE.SphereGeometry(0.18, 12, 8);
const muzzleFlashMaterial = new THREE.MeshBasicMaterial({
  color: 0xfff1c1,
  transparent: true,
  opacity: 0.96,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const shotgunTrailParticleGeometry = new THREE.SphereGeometry(0.055, 6, 4);
const shotgunTrailParticleMaterial = new THREE.MeshBasicMaterial({
  color: 0xffdf8e,
  transparent: true,
  opacity: 0.82,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const ammoPickupGeometry = new THREE.BoxGeometry(0.84, ammoPickupBoxHeight, 0.48);
const ammoPickupPistolMaterial = new THREE.MeshBasicMaterial({
  color: 0xb92828,
});
const ammoPickupShotgunMaterial = new THREE.MeshBasicMaterial({
  color: 0x2f8f4e,
});
const ammoPickupTopGeometry = new THREE.BoxGeometry(0.56, 0.025, 0.12);
const ammoPickupTopMaterial = new THREE.MeshBasicMaterial({
  color: 0xc8c8c8,
});
const chestBaseGeometry = new THREE.BoxGeometry(1.9, 0.68, 1.06);
const chestPanelGeometry = new THREE.BoxGeometry(1.72, 0.48, 0.07);
const chestSidePanelGeometry = new THREE.BoxGeometry(0.07, 0.48, 0.86);
const chestFootGeometry = new THREE.BoxGeometry(0.24, 0.12, 0.22);
const chestLidCoreGeometry = new THREE.BoxGeometry(1.96, 0.24, 1.08);
const chestLidTopGeometry = new THREE.BoxGeometry(1.9, 0.24, 0.52);
const chestLidSlopeGeometry = new THREE.BoxGeometry(1.9, 0.18, 0.36);
const chestTrimFrontGeometry = new THREE.BoxGeometry(2.02, 0.1, 0.1);
const chestBandBodyGeometry = new THREE.BoxGeometry(0.16, 0.78, 1.12);
const chestBandLidGeometry = new THREE.BoxGeometry(0.16, 0.34, 1.14);
const chestLockGeometry = new THREE.BoxGeometry(0.32, 0.34, 0.1);
const chestLockInsetGeometry = new THREE.BoxGeometry(0.13, 0.13, 0.115);
const chestBaseMaterial = new THREE.MeshBasicMaterial({ color: 0x4f2a16 });
const chestPanelMaterial = new THREE.MeshBasicMaterial({ color: 0x7b4725 });
const chestLidMaterial = new THREE.MeshBasicMaterial({ color: 0x8c552c });
const chestTrimMaterial = new THREE.MeshBasicMaterial({ color: 0xb88944 });
const chestDarkMetalMaterial = new THREE.MeshBasicMaterial({ color: 0x28231c });
const chestLockMaterial = new THREE.MeshBasicMaterial({ color: 0xe0b65b });
const collisionDebugBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const collisionDebugEdgesGeometry = new THREE.EdgesGeometry(collisionDebugBoxGeometry);

const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 120);
camera.position.set(7, 5.2, 9.5);
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

const renderer = new THREE.WebGLRenderer({
  antialias: performanceProfile.antialias,
  alpha: false,
  powerPreference: "high-performance",
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = defaultToneMappingExposure;
renderer.shadowMap.enabled = performanceProfile.shadowsEnabled;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setPixelRatio(getRuntimePixelRatio());
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

const baseAmbientLight = new THREE.HemisphereLight(0xf7efd8, 0x24231f, defaultAmbientLightIntensity);
scene.add(baseAmbientLight);

const baseDirectLight = new THREE.DirectionalLight(0xfff2cf, defaultDirectLightIntensity);
baseDirectLight.name = "RuntimeDirectLight";
baseDirectLight.target.name = "RuntimeDirectLightTarget";
scene.add(baseDirectLight, baseDirectLight.target);

const textureLoader = new THREE.TextureLoader();
const audioLoader = new THREE.AudioLoader();
const sewerSurfaceVariants = {
  floor: sewerTextureUrls.floor.map(loadSewerSurfaceVariant),
  wall: sewerTextureUrls.wall.map(loadSewerSurfaceVariant),
  ceiling: sewerTextureUrls.ceiling.map(loadSewerSurfaceVariant),
};
const sewerMaterialVariants = sewerMaterialOptions.map(loadSewerSurfaceVariant);

document.body.classList.toggle("is-runtime-local", runtimeIsLocal);
document.body.classList.toggle("is-runtime-static", runtimeIsStaticHosted);
document.body.classList.toggle("is-runtime-mobile", runtimeIsMobile);
document.body.classList.toggle("has-perf-overlay", performanceProfile.perfOverlayEnabled);

platformGroup = createPlatform(createAppliedMapSnapshot());
scene.add(platformGroup);
collectWallOccluders(platformGroup);
prewarmProjectileEffectPools();
perfOverlayState = createPerfOverlayState();

const loader = new GLTFLoader();
populateMovementSelect();
populateWeaponSelect();
setupMapEditor();
setupDevPanelTabs();
setupCameraControls();
setupMobileControls();
setupWeaponSlotHud();
setupCorpseSearchControls();
setupRunSummaryControls();
setupOptionsControls();
setupAttachmentControls();
renderColorPanel();
setupColorControls();
setupVisualTuningControls();
applyVisualTuning();
setupStartScreen();
syncPlayerHealthHud();

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(sceneElement);
resize();

function loadSewerSurfaceVariant(config) {
  return {
    ...config,
    texture: loadSewerTexture(config.url, config.repeatX, config.repeatY),
  };
}

function loadSewerTexture(url, repeatX = 1, repeatY = 1) {
  const texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = performanceProfile.textureAnisotropy;
  return texture;
}

function createTexturePackVariants({
  idPrefix,
  folder,
  filePrefix,
  labelPrefix,
  count = 25,
  repeatX = 1,
  repeatY = 1,
  color = 0xffffff,
}) {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: `${idPrefix}-${number}`,
      label: `${labelPrefix} ${number}`,
      url: new URL(`../assets/128x128/${folder}/${filePrefix}_${number}-128x128.png`, import.meta.url).href,
      repeatX,
      repeatY,
      color,
    };
  });
}

function loadEnemyMovementSounds() {
  return Promise.all(enemyMovementSoundUrls.map(loadAudioBuffer)).then((buffers) => {
    enemyMovementSoundBuffers = buffers.filter(Boolean);
    if (!enemyMovementSoundBuffers.length) {
      console.warn("Nenhum som de movimento de inimigo foi carregado.");
    }
    return enemyMovementSoundBuffers;
  });
}

function loadPistolShotSound() {
  return loadAudioBuffer(pistolShotSoundUrl).then((buffer) => {
    pistolShotSoundBuffer = buffer;
    if (!pistolShotSoundBuffer) {
      console.warn("Som de tiro da pistola nao foi carregado.");
    }
    return pistolShotSoundBuffer;
  });
}

function loadShotgunShotSound() {
  return loadAudioBuffer(shotgunShotSoundUrl).then((buffer) => {
    shotgunShotSoundBuffer = buffer;
    if (!shotgunShotSoundBuffer) {
      console.warn("Som de tiro da shotgun nao foi carregado.");
    }
    return shotgunShotSoundBuffer;
  });
}

function loadAmmoReloadSound() {
  return loadAudioBuffer(ammoReloadSoundUrl).then((buffer) => {
    ammoReloadSoundBuffer = buffer;
    if (!ammoReloadSoundBuffer) {
      console.warn("Som de recarga de municao nao foi carregado.");
    }
    return ammoReloadSoundBuffer;
  });
}

function loadFloorMusic() {
  return Promise.all(floorMusicUrls.map(loadAudioBuffer)).then((buffers) => {
    floorMusicBuffers = buffers.filter(Boolean);
    if (!floorMusicBuffers.length) {
      console.warn("Nenhuma musica de andar foi carregada.");
    }
    return floorMusicBuffers;
  });
}

function loadAudioBuffer(url) {
  return new Promise((resolve) => {
    audioLoader.load(
      url,
      resolve,
      undefined,
      (error) => {
        console.warn("Nao foi possivel carregar audio.", url, error);
        resolve(null);
      },
    );
  });
}

function playPistolShotSound() {
  const sound = ensurePistolShotSound();
  if (!sound) {
    return;
  }

  unlockGameAudio();
  if (sound.isPlaying) {
    sound.stop();
  }
  sound.play();
}

function ensurePistolShotSound() {
  if (pistolShotSound) {
    return pistolShotSound;
  }

  if (!pistolShotSoundBuffer) {
    return null;
  }

  pistolShotSound = new THREE.Audio(audioListener);
  pistolShotSound.name = "PistolShot9mm";
  pistolShotSound.setBuffer(pistolShotSoundBuffer);
  pistolShotSound.setLoop(false);
  pistolShotSound.setVolume(getSfxVolume(pistolShotSoundVolume));
  return pistolShotSound;
}

function playShotgunShotSound() {
  const sound = ensureShotgunShotSound();
  if (!sound) {
    return;
  }

  unlockGameAudio();
  if (sound.isPlaying) {
    sound.stop();
  }
  sound.play();
}

function ensureShotgunShotSound() {
  if (shotgunShotSound) {
    return shotgunShotSound;
  }

  if (!shotgunShotSoundBuffer) {
    return null;
  }

  shotgunShotSound = new THREE.Audio(audioListener);
  shotgunShotSound.name = "ShotgunShot";
  shotgunShotSound.setBuffer(shotgunShotSoundBuffer);
  shotgunShotSound.setLoop(false);
  shotgunShotSound.setVolume(getSfxVolume(shotgunShotSoundVolume));
  return shotgunShotSound;
}

function playAmmoReloadSound() {
  const sound = ensureAmmoReloadSound();
  if (!sound) {
    return;
  }

  unlockGameAudio();
  if (sound.isPlaying) {
    sound.stop();
  }
  sound.play();
}

function ensureAmmoReloadSound() {
  if (ammoReloadSound) {
    return ammoReloadSound;
  }

  if (!ammoReloadSoundBuffer) {
    return null;
  }

  ammoReloadSound = new THREE.Audio(audioListener);
  ammoReloadSound.name = "AmmoReload";
  ammoReloadSound.setBuffer(ammoReloadSoundBuffer);
  ammoReloadSound.setLoop(false);
  ammoReloadSound.setVolume(getSfxVolume(ammoReloadSoundVolume));
  return ammoReloadSound;
}

function getSfxVolume(baseVolume = 1) {
  return THREE.MathUtils.clamp(baseVolume, 0, 1) * (optionsMenuState.sfxVolume / 100);
}

function getMusicVolume() {
  return optionsMenuState.musicVolume / 100;
}

function applyAudioOptionVolumes() {
  applyMusicOptionVolume();
  pistolShotSound?.setVolume(getSfxVolume(pistolShotSoundVolume));
  shotgunShotSound?.setVolume(getSfxVolume(shotgunShotSoundVolume));
  ammoReloadSound?.setVolume(getSfxVolume(ammoReloadSoundVolume));

  for (const enemy of activeEnemies) {
    if (!enemy.movementSound) {
      continue;
    }

    enemy.movementSound.setVolume(getEnemyMovementSoundVolume(enemy));
  }
}

function getEnemyMovementSoundVolume(enemy) {
  return getSfxVolume(enemy?.type === "boss" ? enemyMovementSoundBossVolume : enemyMovementSoundVolume);
}

function applyMusicOptionVolume() {
  const volume = getMusicVolume();
  if (volume <= 0) {
    stopFloorMusic();
    return;
  }

  if (isRunMusicAllowed() && !isGameplayOptionsMenuOpen()) {
    playFloorMusicForCurrentFloor();
    return;
  }

  if (floorMusicSound) {
    floorMusicSound.setVolume(volume);
  }
}

function playFloorMusicForCurrentFloor() {
  playFloorMusic(mapEditorState.activeFloorIndex);
}

function playFloorMusic(floorIndex = 0) {
  if (!floorMusicBuffers.length || !isRunMusicAllowed() || getMusicVolume() <= 0) {
    stopFloorMusic();
    return;
  }

  const musicIndex = getFloorMusicIndex(floorIndex);
  const buffer = floorMusicBuffers[musicIndex];
  if (!buffer) {
    stopFloorMusic();
    return;
  }

  const music = ensureFloorMusicSound();
  if (!music) {
    return;
  }

  unlockGameAudio();
  if (activeFloorMusicIndex !== musicIndex) {
    if (music.isPlaying) {
      music.stop();
    }
    music.setBuffer(buffer);
    music.setLoop(true);
    activeFloorMusicIndex = musicIndex;
  }

  music.setVolume(getMusicVolume());
  if (!music.isPlaying) {
    music.play();
  }
}

function ensureFloorMusicSound() {
  if (floorMusicSound) {
    return floorMusicSound;
  }

  floorMusicSound = new THREE.Audio(audioListener);
  floorMusicSound.name = "FloorMusic";
  floorMusicSound.setLoop(true);
  floorMusicSound.setVolume(getMusicVolume());
  return floorMusicSound;
}

function stopFloorMusic() {
  if (floorMusicSound?.isPlaying) {
    floorMusicSound.stop();
  }
  floorMusicPausedForOptions = false;
}

function pauseFloorMusicForOptions() {
  if (!floorMusicSound?.isPlaying) {
    floorMusicPausedForOptions = false;
    return;
  }

  if (typeof floorMusicSound.pause === "function") {
    floorMusicSound.pause();
  } else {
    floorMusicSound.stop();
  }
  floorMusicPausedForOptions = true;
}

function resumeFloorMusicAfterOptions() {
  const shouldResume = floorMusicPausedForOptions;
  floorMusicPausedForOptions = false;
  if (!isRunMusicAllowed() || getMusicVolume() <= 0) {
    return;
  }

  if (shouldResume && floorMusicSound && !floorMusicSound.isPlaying) {
    floorMusicSound.setVolume(getMusicVolume());
    floorMusicSound.play();
    return;
  }

  if (!floorMusicSound?.isPlaying) {
    playFloorMusicForCurrentFloor();
  }
}

function getFloorMusicIndex(floorIndex) {
  if (!floorMusicBuffers.length) {
    return 0;
  }

  const index = Math.floor(Number(floorIndex) || 0);
  return ((index % floorMusicBuffers.length) + floorMusicBuffers.length) % floorMusicBuffers.length;
}

function isRunMusicAllowed() {
  return Boolean(sceneReady && runTimingState.started && !runTimingState.resultShown);
}

function isGameplayOptionsMenuOpen() {
  return Boolean(optionsMenuState.isOpen && optionsMenuState.context === "game");
}

function createSewerMaterialOptions(textureGroups) {
  const materialsById = new Map();

  for (const group of Object.values(textureGroups)) {
    for (const material of group) {
      if (!materialsById.has(material.id)) {
        materialsById.set(material.id, material);
      }
    }
  }

  return [...materialsById.values()];
}

function getSewerSurfaceOptions(surface) {
  return sewerSurfaceVariants[surface] || sewerSurfaceVariants.floor;
}

function createPerformanceProfile() {
  const isMobile = runtimeIsMobile;

  return {
    antialias: false,
    maxPixelRatio: 1,
    shadowsEnabled: false,
    effectLightsEnabled: false,
    textureAnisotropy: 1,
    enemyNearUpdateDistance: enemyVisionDistance * (isMobile ? 1.05 : 1.35),
    enemyFarMixerInterval: isMobile ? 0.12 : 0.08,
    enemyLosInterval: isMobile ? 0.22 : 0.12,
    enemyFarLosInterval: isMobile ? 0.48 : 0.24,
    mapEditorSyncInterval: isMobile ? 0.18 : 0.08,
    prewarmImpactEffects: isMobile ? 5 : 8,
    prewarmMuzzleFlashes: isMobile ? 3 : 5,
    perfOverlayEnabled: runtimePerfOverlayEnabled,
  };
}

function getRuntimePixelRatio() {
  return Math.min(window.devicePixelRatio || 1, performanceProfile.maxPixelRatio);
}

const timer = new THREE.Timer();
timer.connect(document);
renderer.setAnimationLoop((timestamp) => {
  timer.update(timestamp);
  const delta = timer.getDelta();
  const gameplayIntroActive = isGameplayCameraIntroActive();
  const gameplayOutroActive = isGameplayCameraOutroActive();
  const gameplayPaused = optionsMenuState.isOpen;

  if (gameplayIntroActive) {
    updateGameplayCameraIntro(delta);
  } else if (gameplayOutroActive) {
    updateGameplayCameraOutro(delta);
  } else if (!gameplayPaused && !cameraControlState.freeCamera) {
    updatePlayerControls(delta);
  }

  if (mixer && !gameplayPaused) {
    mixer.update(delta);
  }

  if (!gameplayPaused) {
    updateImpactEffects(delta);
  }
  if (!gameplayIntroActive && !gameplayPaused) {
    updateEnemies(delta);
    updateEnemyCombatIndicators(delta);
    updateAmmoPickups(delta);
    updateAmmoPickupToast(delta);
    updateCorpseSearch(delta);
    updateCorpseSearchPrompt();
    updateFloorLoot(delta);
    updateStageFlow(delta);
    updateRunTimer();
  }
  updateDeferredMapEditorSync(delta);

  if (cameraControlState.freeCamera) {
    updateFreeCamera(delta);
  } else if (!gameplayIntroActive && !gameplayOutroActive && !gameplayPaused) {
    controls.update(delta);
  }

  updatePlayerCameraFade(delta);
  updateCollisionDebug();
  updateWallOcclusion();
  renderer.render(scene, camera);
  updatePerfOverlay(delta, timestamp);
});

function setupStartScreen() {
  enterStartScreenLandscape();

  if (!startScreen || !startButton) {
    void startGame();
    return;
  }

  startButton.addEventListener("click", () => {
    void startGame();
  });
}

function unlockGameAudio() {
  const context = THREE.AudioContext.getContext();
  if (context?.state === "suspended") {
    context.resume().catch((error) => {
      console.warn("Nao foi possivel liberar audio.", error);
    });
  }
}

function enterStartScreenLandscape() {
  if (!runtimeIsMobile) {
    return;
  }

  try {
    screen.orientation?.lock?.("landscape")?.catch?.(() => {});
  } catch {
    // Orientation lock before fullscreen is browser-dependent; CSS keeps the start screen landscape-shaped.
  }
}

async function startGame() {
  if (sceneLoadStarted && !sceneReady) {
    return;
  }

  enterPreferredFullscreenAndOrientation();
  unlockGameAudio();

  if (startButton) {
    startButton.disabled = true;
  }

  hideStartScreenOverlay();
  clearPlayerMouseButtons();
  syncPlayerHealthHud();
  syncPlayerAmmoHud();
  syncWeaponSlotHud();

  if (sceneReady) {
    await startGameplayRun();
    return;
  }

  sceneLoadStarted = true;
  await loadScene();
}

function hideStartScreenOverlay() {
  document.body.classList.add("has-started");

  if (!startScreen) {
    return;
  }

  startScreen.hidden = false;
  startScreen.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    if (document.body.classList.contains("has-started")) {
      startScreen.hidden = true;
    }
  }, 320);
}

function showStartScreenOverlay() {
  document.body.classList.remove("has-started");
  enterStartScreenLandscape();

  if (startScreen) {
    startScreen.hidden = false;
    startScreen.setAttribute("aria-hidden", "false");
  }

  if (startButton) {
    startButton.disabled = false;
  }
}

async function loadScene() {
  try {
    showSceneLoadingOverlay();
    setStatus("Carregando modelo e movimentos...");
    setMovementStatus("Carregando");
    setWeaponStatus("Arma: carregando");
    movementSelect.disabled = true;
    weaponSelect.disabled = true;
    setAttachmentControlsEnabled(false);

    const [modelGltf, minionGltf, animationGltfs] = await Promise.all([
      loadGltf(modelUrl),
      loadGltf(minionUrl),
      Promise.all(animationUrls.map((url) => loadGltf(url))),
      loadEnemyMovementSounds(),
      loadPistolShotSound(),
      loadShotgunShotSound(),
      loadAmmoReloadSound(),
      loadFloorMusic(),
    ]);

    characterModel = modelGltf.scene;
    prepareModel(characterModel);
    applyCharacterPalette();
    scene.add(characterModel);

    fitModelToPlatform(characterModel);
    positionCharacterOnMap(mapEditorState.appliedPlayerPosition, mapEditorState.appliedPlayerDirection);
    heldSlot = findObjectByName(characterModel, activeWeapon.slotName);
    await equipWeapon(activeWeapon.id);
    enemySourceModel = minionGltf.scene;
    prepareStaticModel(enemySourceModel);
    fitEnemyModelToTile(enemySourceModel);
    frameScene();
    setupAnimationMixer(characterModel, animationGltfs);
    renderAppliedEnemies();
    setupFloorLootChest();
    movementSelect.disabled = false;
    weaponSelect.disabled = false;
    setAttachmentControlsEnabled(true);
    movementSelect.value = defaultMovementId;
    playMovement(defaultMovementId, { restart: true });
    sceneReady = true;
    await startGameplayRun();

    hideSceneLoadingOverlay();
    setStatus("Carregado", "done");
    syncWeaponSlotHud();
    syncPlayerAmmoHud();
    syncCrosshair();
    window.setTimeout(() => hideStatus(), 550);
  } catch (error) {
    console.error(error);
    hideSceneLoadingOverlay();
    setStatus("Nao foi possivel carregar o modelo", "error");
    setMovementStatus("Erro ao carregar");
    sceneLoadStarted = false;
    if (startButton) {
      startButton.disabled = false;
    }
    syncCrosshair();
  }
}

function showSceneLoadingOverlay() {
  document.body.classList.add("is-scene-loading");
}

function hideSceneLoadingOverlay() {
  document.body.classList.remove("is-scene-loading");
}

function loadGltf(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

async function equipWeapon(weaponId) {
  const nextWeapon = weaponById.get(weaponId) || weaponOptions[0];
  const requestId = ++equipRequestId;
  if (combatWeaponConfigById.has(nextWeapon.id)) {
    unlockCombatWeapon(nextWeapon.id);
  }
  activeWeapon = nextWeapon;
  weaponSelect.value = nextWeapon.id;
  updateAttachmentControls();
  syncWeaponSlotHud();
  syncPlayerAmmoHud();
  syncCrosshair();

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
    syncWeaponSlotHud();
    syncPlayerAmmoHud();
    syncCrosshair();
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
  updateHeldItemMuzzleMetrics();
}

function updateHeldItemMuzzleMetrics() {
  if (!currentHeldItem) {
    return;
  }

  currentHeldItem.updateWorldMatrix(true, true);
  muzzleFlashWeaponBox.setFromObject(currentHeldItem);
  if (muzzleFlashWeaponBox.isEmpty()) {
    currentHeldItem.userData.muzzleForwardOffset = 0.42;
    currentHeldItem.userData.muzzleLocalCenter = null;
    return;
  }

  muzzleFlashWeaponBox.getCenter(muzzleFlashWeaponCenter);
  muzzleFlashWeaponBox.getSize(muzzleFlashWeaponSize);
  currentHeldItem.worldToLocal(muzzleFlashWeaponCenter);
  currentHeldItem.userData.muzzleLocalCenter = muzzleFlashWeaponCenter.clone();
  currentHeldItem.userData.muzzleForwardOffset = Math.max(
    muzzleFlashWeaponSize.x,
    muzzleFlashWeaponSize.y,
    muzzleFlashWeaponSize.z,
    0.28,
  ) * 0.48;
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
    node.material = cloneMaterialCollection(node.material);

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

  movementSelect.value = defaultMovementId;
  movementSelect.addEventListener("change", () => {
    setManualMovementPreview(movementSelect.value);
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

function setupDevPanelTabs() {
  if (!devTabButtons.length || !devTabPanels.length) {
    return;
  }

  for (const button of devTabButtons) {
    button.addEventListener("click", () => {
      const nextTabId = button.getAttribute("aria-selected") === "true" ? null : button.dataset.devTab;
      setActiveDevPanel(nextTabId, { focusTab: false });
    });
    button.addEventListener("keydown", handleDevTabKeydown);
  }

  const selectedTab = [...devTabButtons].find((button) => button.getAttribute("aria-selected") === "true");
  setActiveDevPanel(selectedTab?.dataset.devTab || null, { focusTab: false });
}

function handleDevTabKeydown(event) {
  const tabs = [...devTabButtons];
  const currentIndex = tabs.indexOf(event.currentTarget);
  if (currentIndex < 0) {
    return;
  }

  const keyOffsets = {
    ArrowLeft: -1,
    ArrowUp: -1,
    ArrowRight: 1,
    ArrowDown: 1,
  };
  let nextIndex = currentIndex;

  if (event.key in keyOffsets) {
    event.preventDefault();
    nextIndex = (currentIndex + keyOffsets[event.key] + tabs.length) % tabs.length;
  } else if (event.key === "Home") {
    event.preventDefault();
    nextIndex = 0;
  } else if (event.key === "End") {
    event.preventDefault();
    nextIndex = tabs.length - 1;
  } else {
    return;
  }

  setActiveDevPanel(tabs[nextIndex].dataset.devTab, { focusTab: true });
}

function setActiveDevPanel(tabId, { focusTab = false } = {}) {
  const hasActivePanel = Boolean(tabId);
  const buttons = [...devTabButtons];
  devLayoutElement?.classList.toggle("has-dev-panel-open", hasActivePanel);

  for (const [index, button] of buttons.entries()) {
    const isActive = button.dataset.devTab === tabId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive || (!hasActivePanel && index === 0) ? 0 : -1;
    if (isActive && focusTab) {
      button.focus();
    }
  }

  for (const panel of devTabPanels) {
    const isActive = panel.dataset.devPanel === tabId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  }

  if (tabId === "map") {
    window.requestAnimationFrame(() => {
      resizeMapEditorCanvas();
      renderMapEditor();
    });
  }
}

function setupMapEditor() {
  if (!mapCanvas || !mapViewport) {
    return;
  }

  populateMapMaterialControls();

  mapCanvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  mapCanvas.addEventListener("pointerdown", handleMapPointerDown);
  mapCanvas.addEventListener("pointermove", handleMapPointerMove);
  mapCanvas.addEventListener("pointerleave", handleMapPointerLeave);
  mapCanvas.addEventListener("pointerup", handleMapPointerUp);
  mapCanvas.addEventListener("pointercancel", handleMapPointerUp);
  mapCanvas.addEventListener("wheel", handleMapWheel, { passive: false });

  mapZoomOutButton.addEventListener("click", () => {
    setMapZoom(mapEditorState.zoom - mapZoomStep);
  });
  mapZoomResetButton.addEventListener("click", () => {
    setMapZoom(1);
    mapViewport.scrollLeft = 0;
    mapViewport.scrollTop = 0;
  });
  mapZoomInButton.addEventListener("click", () => {
    setMapZoom(mapEditorState.zoom + mapZoomStep);
  });
  applyMapButton.addEventListener("click", () => {
    applyMapEditorState();
  });
  clearMapButton?.addEventListener("click", clearMapEditor);
  generateMapButton?.addEventListener("click", generateMapEditorLayout);
  saveFloorButton?.addEventListener("click", () => {
    saveCurrentMapFloor();
  });
  showTileEdgesInput.addEventListener("change", () => {
    setMapBuildOption("showTileEdges", showTileEdgesInput.checked);
  });
  mapCoveredInput.addEventListener("change", () => {
    setMapBuildOption("isCovered", mapCoveredInput.checked);
  });
  for (const button of mapToolButtons) {
    button.addEventListener("click", () => {
      setMapActiveTool(button.dataset.mapTool);
    });
  }
  for (const [surface, control] of Object.entries(materialControls)) {
    control.select?.addEventListener("change", () => {
      setMapMaterial(surface, control.select.value);
    });
    control.select?.addEventListener("pointerenter", (event) => {
      showMaterialPreviewPopover(surface, event.currentTarget);
    });
    control.select?.addEventListener("focus", (event) => {
      showMaterialPreviewPopover(surface, event.currentTarget);
    });
    control.select?.addEventListener("pointerleave", hideMaterialPreviewPopover);
    control.select?.addEventListener("blur", hideMaterialPreviewPopover);
    control.preview?.addEventListener("pointerenter", (event) => {
      showMaterialPreviewPopover(surface, event.currentTarget);
    });
    control.preview?.addEventListener("pointerleave", hideMaterialPreviewPopover);
  }

  const mapResizeObserver = new ResizeObserver(() => {
    resizeMapEditorCanvas();
  });
  mapResizeObserver.observe(mapViewport);

  resizeMapEditorCanvas();
  updateMapHud();
  updateMapEditorControls();
}

function setupCameraControls() {
  if (!freeCameraInput || !copyCameraButton) {
    return;
  }

  renderer.domElement.tabIndex = 0;
  renderer.domElement.addEventListener("pointerdown", () => {
    renderer.domElement.focus();
  });
  renderer.domElement.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  renderer.domElement.addEventListener("pointerdown", handlePlayerPointerDown);
  window.addEventListener("mousedown", handlePlayerMouseButtonChange);
  window.addEventListener("pointerup", handlePlayerPointerUp);
  window.addEventListener("mouseup", handlePlayerMouseButtonChange);
  window.addEventListener("blur", clearPlayerMouseButtons);
  document.addEventListener("visibilitychange", handlePlayerVisibilityChange);
  document.addEventListener("mousemove", handlePlayerPointerMove);
  document.addEventListener("pointerlockchange", handlePlayerPointerLockChange);
  renderer.domElement.addEventListener("wheel", handleCameraWheel, { capture: true, passive: false });
  window.addEventListener("keydown", handleCameraKeyDown);
  window.addEventListener("keyup", handleCameraKeyUp);

  freeCameraInput.addEventListener("change", () => {
    setFreeCameraEnabled(freeCameraInput.checked);
  });
  cameraSideLeftInput.addEventListener("change", () => {
    setCameraSide(cameraSideLeftInput.checked ? "left" : "right");
  });
  cameraOrbitInput.addEventListener("input", () => {
    setCameraOrbit(cameraOrbitInput.value);
  });
  cameraOffsetXInput.addEventListener("input", () => {
    setCameraOffset("x", cameraOffsetXInput.value);
  });
  cameraOffsetYInput.addEventListener("input", () => {
    setCameraOffset("y", cameraOffsetYInput.value);
  });
  cameraOffsetZInput.addEventListener("input", () => {
    setCameraOffset("z", cameraOffsetZInput.value);
  });
  copyCameraButton.addEventListener("click", () => {
    copyCameraInfo();
  });

  syncCameraControlUI();
  controls.enabled = cameraControlState.freeCamera;
}

function setupMobileControls() {
  if (!runtimeIsMobile || !phoneShellElement) {
    return;
  }

  phoneShellElement.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  phoneShellElement.addEventListener("pointerdown", handleMobilePointerDown);
  phoneShellElement.addEventListener("pointermove", handleMobilePointerMove);
  phoneShellElement.addEventListener("pointerup", handleMobilePointerUp);
  phoneShellElement.addEventListener("pointercancel", handleMobilePointerUp);

  if (mobileFireButton) {
    mobileFireButton.addEventListener("pointerdown", handleMobileFireDown);
    mobileFireButton.addEventListener("pointermove", handleMobileFireMove);
    mobileFireButton.addEventListener("pointerup", handleMobileFireUp);
    mobileFireButton.addEventListener("pointercancel", handleMobileFireUp);
    mobileFireButton.addEventListener("lostpointercapture", handleMobileFireUp);
  }
}

async function enterPreferredFullscreenAndOrientation() {
  if (!runtimeIsMobile) {
    return;
  }

  const fullscreenTarget = phoneShellElement || document.documentElement;
  try {
    if (!document.fullscreenElement && fullscreenTarget.requestFullscreen) {
      await fullscreenTarget.requestFullscreen({ navigationUI: "hide" });
    }
  } catch {
    // Mobile browsers only allow fullscreen from supported gestures; controls retry on touch.
  }

  try {
    if (screen.orientation?.lock) {
      await screen.orientation.lock("landscape");
    }
  } catch {
    // iOS and some embedded browsers do not expose orientation lock.
  }
}

function setupRunSummaryControls() {
  restartRunButton?.addEventListener("click", () => {
    void restartRun();
  });
  exitRunButton?.addEventListener("click", () => {
    void exitRunToStart();
  });
  startRecordsOpenButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openStartRecordsModal();
  });
  startRecordsCloseButton?.addEventListener("click", closeStartRecordsModal);
  startRecordsModalElement?.addEventListener("click", (event) => {
    if (event.target === startRecordsModalElement) {
      closeStartRecordsModal();
    }
  });
  startRecordsModalElement?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeStartRecordsModal();
    }
  });
  syncRunTimerHud();
}

function setupOptionsControls() {
  syncOptionsControls();

  for (const button of optionsOpenButtons) {
    button.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openOptionsMenu(button.dataset.optionsOpen === "game" ? "game" : "start");
    });
  }

  optionsCloseButton?.addEventListener("click", closeOptionsMenu);
  optionsModalElement?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeOptionsMenu();
    }
  });
  optionsRestartButton?.addEventListener("click", () => {
    closeOptionsMenu({ resumeMusic: false });
    void restartRun();
  });
  optionsExitButton?.addEventListener("click", () => {
    closeOptionsMenu({ resumeMusic: false });
    void exitRunToStart();
  });
  musicVolumeInput?.addEventListener("input", () => {
    setOptionVolume("musicVolume", musicVolumeInput.value);
  });
  sfxVolumeInput?.addEventListener("input", () => {
    setOptionVolume("sfxVolume", sfxVolumeInput.value);
  });
}

function openOptionsMenu(context = "game") {
  if (!optionsModalElement) {
    return;
  }

  optionsMenuState.isOpen = true;
  optionsMenuState.context = context;
  optionsModalElement.hidden = false;
  if (optionsGameActionsElement) {
    optionsGameActionsElement.hidden = context !== "game";
  }
  if (context === "game") {
    stopGameplayInputForRunSummary();
    pauseFloorMusicForOptions();
  }
  syncOptionsControls();
  syncCrosshair();
  window.requestAnimationFrame(() => {
    (context === "game" ? optionsCloseButton : musicVolumeInput)?.focus?.();
  });
}

function closeOptionsMenu({ resumeMusic = true } = {}) {
  const wasGameMenu = optionsMenuState.context === "game";
  optionsMenuState.isOpen = false;
  if (optionsModalElement) {
    optionsModalElement.hidden = true;
  }
  syncCrosshair();
  if (resumeMusic && wasGameMenu) {
    resumeFloorMusicAfterOptions();
  }
}

function canOpenGameplayOptionsMenu() {
  return Boolean(
    !runtimeIsMobile
    && document.body.classList.contains("has-started")
    && !runTimingState.resultShown,
  );
}

function setOptionVolume(key, value) {
  optionsMenuState[key] = clampOptionVolume(value);
  saveOptionsMenuState();
  syncOptionsControls();
  applyAudioOptionVolumes();
}

function syncOptionsControls() {
  if (musicVolumeInput) {
    musicVolumeInput.value = String(optionsMenuState.musicVolume);
  }
  if (musicVolumeValue) {
    musicVolumeValue.textContent = formatOptionVolume(optionsMenuState.musicVolume);
  }
  if (sfxVolumeInput) {
    sfxVolumeInput.value = String(optionsMenuState.sfxVolume);
  }
  if (sfxVolumeValue) {
    sfxVolumeValue.textContent = formatOptionVolume(optionsMenuState.sfxVolume);
  }
}

function createOptionsMenuState() {
  const fallback = {
    isOpen: false,
    context: "start",
    musicVolume: 100,
    sfxVolume: 100,
  };

  try {
    const parsed = JSON.parse(window.localStorage.getItem(optionsStorageKey) || "null");
    if (!parsed || typeof parsed !== "object") {
      return fallback;
    }

    return {
      ...fallback,
      musicVolume: clampOptionVolume(parsed.musicVolume),
      sfxVolume: clampOptionVolume(parsed.sfxVolume),
    };
  } catch {
    return fallback;
  }
}

function saveOptionsMenuState() {
  try {
    window.localStorage.setItem(optionsStorageKey, JSON.stringify({
      musicVolume: optionsMenuState.musicVolume,
      sfxVolume: optionsMenuState.sfxVolume,
    }));
  } catch {
    // Private browsing or storage quotas can block option persistence.
  }
}

function clampOptionVolume(value) {
  return THREE.MathUtils.clamp(Math.round(Number(value) || 0), 0, 100);
}

function formatOptionVolume(value) {
  const volume = clampOptionVolume(value);
  return volume === 0 ? "Mute" : String(volume);
}

async function restartRun() {
  enterPreferredFullscreenAndOrientation();
  await startGameplayRun();
}

async function exitRunToStart() {
  stopFloorMusic();
  clearPlayerMouseButtons();
  cancelGameplayCameraIntro();
  cancelGameplayCameraOutro();
  resetCorpseSearchState();
  clearManualMovementPreview();
  hideRunSummaryModal();
  hideStageBanner();
  runTimingState = createRunTimingState();
  syncRunTimerHud();
  if (runtimeIsMobile && document.fullscreenElement && document.exitFullscreen) {
    try {
      await document.exitFullscreen();
    } catch {
      // Some mobile browsers reject fullscreen exit while changing orientation.
    }
  }
  showStartScreenOverlay();
  syncCrosshair();
}

async function startGameplayRun() {
  if (!sceneReady || !characterModel) {
    return;
  }

  stopFloorMusic();
  hideRunSummaryModal();
  hideStageBanner();
  clearPlayerMouseButtons();
  phoneShellElement?.classList.remove("is-player-hit");
  cancelGameplayCameraIntro();
  cancelGameplayCameraOutro();
  playerControlState = createPlayerControlState();
  runTimingState = createRunTimingState();
  resetCorpseSearchState();
  clearManualMovementPreview();
  activeWeapon = weaponById.get(defaultWeaponId) || weaponOptions[0];

  const firstFloor = mapEditorState.floors[0] || createDefaultMapFloorConfig();
  loadMapFloorIntoEditor(firstFloor, 0);
  await equipWeapon(defaultWeaponId);
  playMovement(defaultMovementId, { restart: true });
  syncPlayerHealthHud();
  syncPlayerAmmoHud();
  syncWeaponSlotHud();
  syncCrosshair();
  syncRunTimerHud();
  startGameplayCameraIntro({ startRunTimerOnComplete: true });
  setStatus("Preparando", "done");
}

function setupWeaponSlotHud() {
  for (const element of weaponSlotElements) {
    element.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const weaponId = element.dataset.combatWeaponSlot;
      if (weaponId) {
        switchCombatWeapon(weaponId);
      }
    });
  }
}

function setupCorpseSearchControls() {
  corpseSearchButton?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void enterPreferredFullscreenAndOrientation();
    startCorpseSearchFromPrompt();
  });
}

function handleMobilePointerDown(event) {
  if (
    !runtimeIsMobile
    || isGameplayInputLocked()
    || playerControlState.dead
    || cameraControlState.freeCamera
    || corpseSearchState.active
  ) {
    return;
  }

  if (event.target === mobileFireButton || event.target.closest?.("[data-corpse-search-button]")) {
    return;
  }

  event.preventDefault();
  enterPreferredFullscreenAndOrientation();

  const rect = phoneShellElement.getBoundingClientRect();
  if (event.clientX - rect.left < rect.width * 0.5) {
    startMobileJoystick(event, rect);
  } else {
    startMobileLook(event);
  }
}

function handleMobilePointerMove(event) {
  if (!runtimeIsMobile) {
    return;
  }

  if (event.pointerId === playerControlState.virtualMove.pointerId) {
    event.preventDefault();
    updateMobileJoystick(event);
    return;
  }

  if (event.pointerId === playerControlState.mobileLook.pointerId) {
    event.preventDefault();
    updateMobileLook(event);
  }
}

function handleMobilePointerUp(event) {
  if (!runtimeIsMobile) {
    return;
  }

  if (event.pointerId === playerControlState.virtualMove.pointerId) {
    stopMobileJoystick();
    releasePointerCaptureSafe(phoneShellElement, event.pointerId);
  }

  if (event.pointerId === playerControlState.mobileLook.pointerId) {
    stopMobileLook();
    releasePointerCaptureSafe(phoneShellElement, event.pointerId);
  }
}

function startMobileJoystick(event, rect = phoneShellElement.getBoundingClientRect()) {
  const moveState = playerControlState.virtualMove;
  moveState.active = true;
  moveState.pointerId = event.pointerId;
  moveState.originX = event.clientX;
  moveState.originY = event.clientY;
  moveState.x = 0;
  moveState.y = 0;
  moveState.magnitude = 0;
  clearManualMovementPreview();
  setPointerCaptureSafe(phoneShellElement, event.pointerId);

  if (mobileJoystickElement) {
    mobileJoystickElement.style.left = `${event.clientX - rect.left}px`;
    mobileJoystickElement.style.top = `${event.clientY - rect.top}px`;
    mobileJoystickElement.classList.add("is-active");
  }

  updateMobileJoystickStick(0, 0);
}

function updateMobileJoystick(event) {
  const moveState = playerControlState.virtualMove;
  const deltaX = event.clientX - moveState.originX;
  const deltaY = event.clientY - moveState.originY;
  const distance = Math.hypot(deltaX, deltaY);
  const clampedDistance = Math.min(distance, mobileJoystickRadius);
  const directionX = distance > 0.001 ? deltaX / distance : 0;
  const directionY = distance > 0.001 ? deltaY / distance : 0;
  const rawMagnitude = clampedDistance / mobileJoystickRadius;
  const magnitude = rawMagnitude < mobileJoystickDeadZone ? 0 : rawMagnitude;

  moveState.x = directionX * magnitude;
  moveState.y = directionY * magnitude;
  moveState.magnitude = magnitude;
  updateMobileJoystickStick(directionX * clampedDistance, directionY * clampedDistance);
}

function updateMobileJoystickStick(offsetX, offsetY) {
  if (!mobileJoystickStickElement) {
    return;
  }

  mobileJoystickStickElement.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
}

function stopMobileJoystick() {
  const moveState = playerControlState.virtualMove;
  moveState.active = false;
  moveState.pointerId = null;
  moveState.x = 0;
  moveState.y = 0;
  moveState.magnitude = 0;
  updateMobileJoystickStick(0, 0);
  mobileJoystickElement?.classList.remove("is-active");
}

function startMobileLook(event) {
  const lookState = playerControlState.mobileLook;
  lookState.active = true;
  lookState.pointerId = event.pointerId;
  lookState.lastX = event.clientX;
  lookState.lastY = event.clientY;
  setPointerCaptureSafe(phoneShellElement, event.pointerId);
}

function updateMobileLook(event) {
  const lookState = playerControlState.mobileLook;
  const movementX = event.clientX - lookState.lastX;
  const movementY = event.clientY - lookState.lastY;
  lookState.lastX = event.clientX;
  lookState.lastY = event.clientY;
  applyLookDelta(movementX, movementY, {
    yawSensitivity: mobileLookYawSensitivity,
    pitchSensitivity: mobileLookPitchSensitivity,
  });
}

function stopMobileLook() {
  const lookState = playerControlState.mobileLook;
  lookState.active = false;
  lookState.pointerId = null;
}

function handleMobileFireDown(event) {
  if (!runtimeIsMobile || isGameplayInputLocked() || playerControlState.dead || corpseSearchState.active) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  enterPreferredFullscreenAndOrientation();
  setPointerCaptureSafe(mobileFireButton, event.pointerId);
  startMobileFireLook(event);
  playerControlState.aiming = true;
  playerControlState.shooting = true;
  clearManualMovementPreview();
  mobileFireButton?.classList.add("is-firing");
  syncCrosshair();
  tryFirePlayerWeapon({ force: true });
}

function handleMobileFireMove(event) {
  if (!runtimeIsMobile) {
    return;
  }

  if (event.pointerId !== playerControlState.mobileFire.pointerId) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  updateMobileFireLook(event);
}

function handleMobileFireUp(event) {
  if (!runtimeIsMobile) {
    return;
  }

  event.preventDefault?.();
  event.stopPropagation?.();
  stopMobileFireLook(event.pointerId);
  playerControlState.shooting = false;
  playerControlState.aiming = false;
  mobileFireButton?.classList.remove("is-firing");
  syncCrosshair();
}

function startMobileFireLook(event) {
  const fireState = playerControlState.mobileFire;
  fireState.active = true;
  fireState.pointerId = event.pointerId;
  fireState.lastX = event.clientX;
  fireState.lastY = event.clientY;
}

function updateMobileFireLook(event) {
  const fireState = playerControlState.mobileFire;
  const movementX = event.clientX - fireState.lastX;
  const movementY = event.clientY - fireState.lastY;
  fireState.lastX = event.clientX;
  fireState.lastY = event.clientY;

  if (!movementX && !movementY) {
    return;
  }

  applyLookDelta(movementX, movementY, {
    yawSensitivity: mobileLookYawSensitivity,
    pitchSensitivity: mobileLookPitchSensitivity,
  });
}

function stopMobileFireLook(pointerId = playerControlState.mobileFire.pointerId) {
  const fireState = playerControlState.mobileFire;
  if (pointerId !== null && pointerId !== undefined) {
    releasePointerCaptureSafe(mobileFireButton, pointerId);
  }
  fireState.active = false;
  fireState.pointerId = null;
  fireState.lastX = 0;
  fireState.lastY = 0;
}

function setPointerCaptureSafe(element, pointerId) {
  try {
    element?.setPointerCapture?.(pointerId);
  } catch {
    // Pointer capture is not guaranteed on every embedded mobile browser.
  }
}

function releasePointerCaptureSafe(element, pointerId) {
  try {
    if (element?.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
  } catch {
    // Pointer capture release can fail if the pointer was already cancelled.
  }
}

function createCameraControlState() {
  return {
    freeCamera: false,
    side: "right",
    orbitDegrees: anchoredCameraPreset.baseOrbitDegrees,
    offset: { ...defaultCameraOffset },
    anchorTarget: new THREE.Vector3(0, 2.1, 0),
    anchorDistance: anchoredCameraPreset.cameraOffset.distanceTo(anchoredCameraPreset.targetOffset),
    collisionRatio: 1,
    pressedKeys: new Set(),
  };
}

function createGameplayCameraIntroState() {
  return {
    active: false,
    timer: 0,
    duration: gameplayCameraIntroDuration,
    startPosition: new THREE.Vector3(),
    midPosition: new THREE.Vector3(),
    endPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    midTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    startRunTimerOnComplete: false,
    runTimerFloorIndex: 0,
    countdownText: "",
  };
}

function createGameplayCameraOutroState() {
  return {
    active: false,
    timer: 0,
    duration: gameplayCameraOutroDuration,
    startPosition: new THREE.Vector3(),
    nearPosition: new THREE.Vector3(),
    endPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    nearTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
  };
}

function createPlayerControlState() {
  return {
    pressedKeys: new Set(),
    mouseButtons: 0,
    shooting: false,
    aiming: false,
    yawRadians: 0,
    pitchRadians: defaultPlayerAimPitchRadians,
    pointerLocked: false,
    maxHealth: playerMaxHealth,
    health: playerMaxHealth,
    maxAmmo: playerMaxAmmo,
    ammo: playerStartingAmmo,
    ammoByWeapon: Object.fromEntries(
      combatWeaponConfigs.map((config) => [config.id, config.startingAmmo]),
    ),
    unlockedWeapons: new Set([defaultCombatWeaponId]),
    dead: false,
    fireCooldown: 0,
    shotAnimationTimer: 0,
    pendingShotTimer: 0,
    hitReactTimer: 0,
    virtualMove: {
      active: false,
      pointerId: null,
      originX: 0,
      originY: 0,
      x: 0,
      y: 0,
      magnitude: 0,
    },
    mobileLook: {
      active: false,
      pointerId: null,
      lastX: 0,
      lastY: 0,
    },
    mobileFire: {
      active: false,
      pointerId: null,
      lastX: 0,
      lastY: 0,
    },
  };
}

function createCorpseSearchState() {
  return {
    active: false,
    enemy: null,
    timer: 0,
    animationTimer: 0,
    promptEnemy: null,
  };
}

function createCollisionDebugState() {
  return {
    enabled: false,
    group: null,
    playerBox: null,
    enemyBoxes: new Map(),
  };
}

function setFreeCameraEnabled(enabled) {
  if (enabled && isGameplayCameraIntroActive()) {
    completeGameplayCameraIntro();
  }
  if (enabled && isGameplayCameraOutroActive()) {
    completeGameplayCameraOutro();
  }

  cameraControlState.freeCamera = enabled;
  cameraControlState.pressedKeys.clear();
  playerControlState.pressedKeys.clear();
  playerControlState.shooting = false;
  playerControlState.aiming = false;
  playerControlState.mouseButtons = 0;
  stopMobileJoystick();
  stopMobileLook();
  stopMobileFireLook();
  resetCorpseSearchState();
  mobileFireButton?.classList.remove("is-firing");
  controls.autoRotate = false;
  controls.enabled = enabled;

  if (enabled && document.pointerLockElement === renderer.domElement) {
    document.exitPointerLock();
  }

  if (!enabled) {
    applyAnchoredCameraFrame();
  } else {
    renderer.domElement.focus();
  }

  syncCameraControlUI();
  syncCrosshair();
}

function setCameraSide(side) {
  cameraControlState.side = side === "left" ? "left" : "right";
  if (!cameraControlState.freeCamera) {
    applyAnchoredCameraFrame();
  }

  syncCameraControlUI();
}

function setCameraOrbit(value) {
  cameraControlState.orbitDegrees = normalizeDegrees(Number(value) || 0);
  if (!cameraControlState.freeCamera) {
    applyAnchoredCameraFrame();
  }

  syncCameraControlUI();
}

function setCameraOffset(axis, value) {
  const nextValue = Number(value) || 0;
  const previousValue = cameraControlState.offset[axis] || 0;
  const delta = nextValue - previousValue;
  cameraControlState.offset[axis] = nextValue;

  if (cameraControlState.freeCamera) {
    const movement = new THREE.Vector3(
      axis === "x" ? delta : 0,
      axis === "y" ? delta : 0,
      axis === "z" ? delta : 0,
    );
    moveFreeCamera(movement);
  } else {
    applyAnchoredCameraFrame();
  }

  syncCameraControlUI();
}

function applyAnchoredCameraFrame(delta = 1 / 60) {
  if (cameraControlState.freeCamera) {
    return;
  }

  const offset = anchoredCameraManualOffset.set(
    cameraControlState.offset.x,
    cameraControlState.offset.y,
    cameraControlState.offset.z,
  );
  const cameraOffset = transformAnchoredCameraOffset(
    anchoredCameraPreset.cameraOffset,
    anchoredCameraCameraOffset,
  ).add(offset);
  const targetOffset = transformAnchoredCameraOffset(
    anchoredCameraPreset.targetOffset,
    anchoredCameraLookOffset,
  );
  const target = anchoredCameraTargetPosition.copy(cameraControlState.anchorTarget).add(targetOffset);
  const desiredPosition = anchoredCameraDesiredPosition.copy(cameraControlState.anchorTarget).add(cameraOffset);
  const resolvedPosition = resolveAnchoredCameraPosition(cameraControlState.anchorTarget, desiredPosition, delta);
  const viewTarget = resolveAnchoredCameraViewTarget(desiredPosition, target, resolvedPosition);

  controls.target.copy(viewTarget);
  camera.position.copy(resolvedPosition);
  camera.lookAt(viewTarget);
  cameraControlState.anchorDistance = camera.position.distanceTo(target);
  camera.updateProjectionMatrix();
  controls.update();
}

function startGameplayCameraIntro({ startRunTimerOnComplete = false, floorIndex = 0 } = {}) {
  if (!characterModel || cameraControlState.freeCamera) {
    if (startRunTimerOnComplete) {
      startRunTimer(floorIndex);
      playFloorMusic(floorIndex);
    }
    return;
  }

  clearPlayerMouseButtons();
  playerControlState.pressedKeys.clear();
  cameraControlState.pressedKeys.clear();
  stopMobileJoystick();
  stopMobileLook();
  stopMobileFireLook();
  updateCameraAnchorFromCharacter();
  applyAnchoredCameraFrame(1 / 60);

  gameplayCameraIntroState = createGameplayCameraIntroState();
  gameplayCameraIntroState.active = true;
  gameplayCameraIntroState.startRunTimerOnComplete = startRunTimerOnComplete;
  gameplayCameraIntroState.runTimerFloorIndex = floorIndex;
  gameplayCameraIntroState.endPosition.copy(camera.position);
  gameplayCameraIntroState.endTarget.copy(controls.target);

  gameplayCameraIntroForward.set(
    Math.sin(playerControlState.yawRadians),
    0,
    Math.cos(playerControlState.yawRadians),
  );
  if (gameplayCameraIntroForward.lengthSq() <= 0.0001) {
    gameplayCameraIntroForward.set(0, 0, 1);
  }
  gameplayCameraIntroForward.normalize();

  gameplayCameraIntroState.startTarget.set(
    characterModel.position.x,
    gameplayCameraIntroTargetHeight,
    characterModel.position.z,
  );
  gameplayCameraIntroState.midTarget.copy(gameplayCameraIntroState.startTarget);
  gameplayCameraIntroState.startPosition
    .copy(characterModel.position)
    .addScaledVector(gameplayCameraIntroForward, gameplayCameraIntroStartDistance);
  gameplayCameraIntroState.startPosition.y = gameplayCameraIntroStartHeight;
  gameplayCameraIntroState.midPosition
    .copy(characterModel.position)
    .addScaledVector(gameplayCameraIntroForward, gameplayCameraIntroMidDistance);
  gameplayCameraIntroState.midPosition.y = gameplayCameraIntroFaceHeight;

  camera.position.copy(gameplayCameraIntroState.startPosition);
  controls.target.copy(gameplayCameraIntroState.startTarget);
  camera.lookAt(controls.target);
  cameraControlState.anchorDistance = camera.position.distanceTo(controls.target);
  showRunTimerReadyState();
  updateGameplayCameraIntroCountdown(0);
  syncCrosshair();
}

function updateGameplayCameraIntro(delta) {
  if (!gameplayCameraIntroState.active) {
    return;
  }

  gameplayCameraIntroState.timer += Math.max(0, delta);
  const progress = THREE.MathUtils.clamp(
    gameplayCameraIntroState.timer / Math.max(gameplayCameraIntroState.duration, 0.001),
    0,
    1,
  );
  updateGameplayCameraIntroCountdown(progress);

  if (progress < gameplayCameraIntroDollyRatio) {
    const dollyProgress = easeGameplayCameraIntro(progress / gameplayCameraIntroDollyRatio);
    gameplayCameraIntroPosition.lerpVectors(
      gameplayCameraIntroState.startPosition,
      gameplayCameraIntroState.midPosition,
      dollyProgress,
    );
    gameplayCameraIntroTarget.lerpVectors(
      gameplayCameraIntroState.startTarget,
      gameplayCameraIntroState.midTarget,
      dollyProgress,
    );
  } else {
    const orbitProgress = easeGameplayCameraIntro(
      (progress - gameplayCameraIntroDollyRatio) / (1 - gameplayCameraIntroDollyRatio),
    );
    gameplayCameraIntroPosition.lerpVectors(
      gameplayCameraIntroState.midPosition,
      gameplayCameraIntroState.endPosition,
      orbitProgress,
    );
    gameplayCameraIntroTarget.lerpVectors(
      gameplayCameraIntroState.midTarget,
      gameplayCameraIntroState.endTarget,
      orbitProgress,
    );
  }

  camera.position.copy(gameplayCameraIntroPosition);
  controls.target.copy(gameplayCameraIntroTarget);
  camera.lookAt(gameplayCameraIntroTarget);
  cameraControlState.anchorDistance = camera.position.distanceTo(gameplayCameraIntroTarget);

  if (progress >= 1) {
    completeGameplayCameraIntro();
  }
}

function easeGameplayCameraIntro(value) {
  return THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(value, 0, 1), 0, 1);
}

function completeGameplayCameraIntro() {
  if (!gameplayCameraIntroState.active) {
    return;
  }

  const shouldStartTimer = gameplayCameraIntroState.startRunTimerOnComplete;
  const floorIndex = gameplayCameraIntroState.runTimerFloorIndex || 0;
  gameplayCameraIntroState.active = false;
  updateCameraAnchorFromCharacter();
  applyAnchoredCameraFrame(1 / 60);

  if (shouldStartTimer) {
    startRunTimer(floorIndex);
    playFloorMusic(floorIndex);
  }

  showStageBanner("GO", { countdown: true, duration: gameplayCameraIntroGoBannerDuration });
  setStatus("Carregado", "done");
  window.setTimeout(() => hideStatus(), 550);
  syncCrosshair();
}

function cancelGameplayCameraIntro() {
  if (gameplayCameraIntroState.active) {
    hideStageBanner();
  }
  gameplayCameraIntroState.active = false;
}

function isGameplayCameraIntroActive() {
  return Boolean(gameplayCameraIntroState.active);
}

function isGameplayInputLocked() {
  return isGameplayCameraIntroActive()
    || isGameplayCameraOutroActive()
    || runTimingState.resultShown
    || optionsMenuState.isOpen;
}

function showRunTimerReadyState() {
  if (!runTimerElement) {
    return;
  }

  runTimerElement.hidden = false;
  runTimerElement.textContent = formatRunTime(0);
}

function updateGameplayCameraIntroCountdown(progress) {
  if (!stageBannerElement) {
    return;
  }

  const secondsLeft = Math.max(
    1,
    Math.ceil((1 - THREE.MathUtils.clamp(progress, 0, 1)) * gameplayCameraIntroDuration),
  );
  const text = String(secondsLeft);
  if (gameplayCameraIntroState.countdownText === text) {
    return;
  }

  gameplayCameraIntroState.countdownText = text;
  showStageBanner(text, { countdown: true });
}

function startGameplayCameraOutro() {
  if (!characterModel || cameraControlState.freeCamera) {
    advanceToNextFloor();
    return;
  }

  clearPlayerMouseButtons();
  playerControlState.pressedKeys.clear();
  cameraControlState.pressedKeys.clear();
  stopMobileJoystick();
  stopMobileLook();
  stopMobileFireLook();
  updateCameraAnchorFromCharacter();
  applyAnchoredCameraFrame(1 / 60);

  gameplayCameraOutroState = createGameplayCameraOutroState();
  gameplayCameraOutroState.active = true;
  gameplayCameraOutroState.startPosition.copy(camera.position);
  gameplayCameraOutroState.startTarget.copy(controls.target);

  gameplayCameraOutroForward.set(
    Math.sin(playerControlState.yawRadians),
    0,
    Math.cos(playerControlState.yawRadians),
  );
  if (gameplayCameraOutroForward.lengthSq() <= 0.0001) {
    gameplayCameraOutroForward.set(0, 0, 1);
  }
  gameplayCameraOutroForward.normalize();

  gameplayCameraOutroState.nearTarget.set(
    characterModel.position.x,
    gameplayCameraOutroTargetHeight,
    characterModel.position.z,
  );
  gameplayCameraOutroState.endTarget.copy(gameplayCameraOutroState.nearTarget);
  gameplayCameraOutroState.nearPosition
    .copy(characterModel.position)
    .addScaledVector(gameplayCameraOutroForward, gameplayCameraOutroNearDistance);
  gameplayCameraOutroState.nearPosition.y = gameplayCameraOutroFaceHeight;
  gameplayCameraOutroState.endPosition
    .copy(characterModel.position)
    .addScaledVector(gameplayCameraOutroForward, gameplayCameraOutroFarDistance);
  gameplayCameraOutroState.endPosition.y = gameplayCameraOutroFaceHeight;

  playBossClearCelebrationAnimation();
  syncCrosshair();
}

function playBossClearCelebrationAnimation() {
  const availableAnimations = bossClearCelebrationAnimationIds.filter((clipName) => animationActions.has(clipName));
  if (!availableAnimations.length) {
    playMovement(defaultMovementId, { restart: true });
    return;
  }

  const clipName = availableAnimations[Math.floor(Math.random() * availableAnimations.length)];
  playMovement(clipName, { restart: true });
}

function updateGameplayCameraOutro(delta) {
  if (!gameplayCameraOutroState.active) {
    return;
  }

  gameplayCameraOutroState.timer += Math.max(0, delta);
  const progress = THREE.MathUtils.clamp(
    gameplayCameraOutroState.timer / Math.max(gameplayCameraOutroState.duration, 0.001),
    0,
    1,
  );

  if (progress < gameplayCameraOutroPivotRatio) {
    const pivotProgress = easeGameplayCameraIntro(progress / gameplayCameraOutroPivotRatio);
    gameplayCameraOutroPosition.lerpVectors(
      gameplayCameraOutroState.startPosition,
      gameplayCameraOutroState.nearPosition,
      pivotProgress,
    );
    gameplayCameraOutroTarget.lerpVectors(
      gameplayCameraOutroState.startTarget,
      gameplayCameraOutroState.nearTarget,
      pivotProgress,
    );
  } else {
    const pullbackProgress = easeGameplayCameraIntro(
      (progress - gameplayCameraOutroPivotRatio) / (1 - gameplayCameraOutroPivotRatio),
    );
    gameplayCameraOutroPosition.lerpVectors(
      gameplayCameraOutroState.nearPosition,
      gameplayCameraOutroState.endPosition,
      pullbackProgress,
    );
    gameplayCameraOutroTarget.lerpVectors(
      gameplayCameraOutroState.nearTarget,
      gameplayCameraOutroState.endTarget,
      pullbackProgress,
    );
  }

  camera.position.copy(gameplayCameraOutroPosition);
  controls.target.copy(gameplayCameraOutroTarget);
  camera.lookAt(gameplayCameraOutroTarget);
  cameraControlState.anchorDistance = camera.position.distanceTo(gameplayCameraOutroTarget);

  if (progress >= 1) {
    completeGameplayCameraOutro();
  }
}

function completeGameplayCameraOutro() {
  if (!gameplayCameraOutroState.active) {
    return;
  }

  gameplayCameraOutroState.active = false;
  advanceToNextFloor();
}

function cancelGameplayCameraOutro() {
  gameplayCameraOutroState.active = false;
}

function isGameplayCameraOutroActive() {
  return Boolean(gameplayCameraOutroState.active);
}

function resolveAnchoredCameraViewTarget(desiredPosition, target, resolvedPosition) {
  const collisionRatio = Number.isFinite(cameraControlState.collisionRatio)
    ? cameraControlState.collisionRatio
    : 1;
  const closeBlend = 1 - THREE.MathUtils.smoothstep(
    collisionRatio,
    cameraCloseViewRatioEnd,
    cameraCloseViewRatioStart,
  );

  if (closeBlend <= 0.001) {
    return target;
  }

  const idealLookDistance = target.distanceTo(desiredPosition);
  if (idealLookDistance <= 0.001) {
    return target;
  }

  cameraCloseLookDirection.copy(target).sub(desiredPosition).normalize();
  cameraCloseLookTarget
    .copy(resolvedPosition)
    .addScaledVector(cameraCloseLookDirection, idealLookDistance);

  return cameraBlendedLookTarget.copy(target).lerp(cameraCloseLookTarget, closeBlend);
}

function resolveAnchoredCameraPosition(origin, desiredPosition, delta) {
  cameraCollisionDirection.copy(desiredPosition).sub(origin);
  const idealDistance = cameraCollisionDirection.length();

  if (idealDistance <= 0.001 || !mapEditorState.appliedIsCovered || mapEditorState.appliedTiles.size === 0) {
    cameraControlState.collisionRatio = 1;
    return cameraCollisionResolvedPosition.copy(desiredPosition);
  }

  const wallRatio = getWallCollisionCameraRatio(origin, idealDistance);
  const tileRatio = getAppliedTileCameraRatio(origin);
  const allowedRatio = Math.min(wallRatio, tileRatio);
  const currentRatio = Number.isFinite(cameraControlState.collisionRatio)
    ? cameraControlState.collisionRatio
    : 1;

  if (allowedRatio < currentRatio) {
    cameraControlState.collisionRatio = allowedRatio;
  } else {
    const smoothingDelta = Number.isFinite(delta) && delta > 0 ? delta : 1 / 60;
    cameraControlState.collisionRatio = THREE.MathUtils.damp(
      currentRatio,
      allowedRatio,
      cameraCollisionReturnDamping,
      smoothingDelta,
    );

    if (Math.abs(cameraControlState.collisionRatio - allowedRatio) < 0.001) {
      cameraControlState.collisionRatio = allowedRatio;
    }
  }

  return cameraCollisionResolvedPosition
    .copy(origin)
    .addScaledVector(cameraCollisionDirection, cameraControlState.collisionRatio);
}

function getWallCollisionCameraRatio(origin, idealDistance) {
  if (wallOccluderList.length === 0) {
    return 1;
  }

  cameraCollisionRayDirection.copy(cameraCollisionDirection).normalize();
  cameraCollisionRaycaster.set(origin, cameraCollisionRayDirection);
  cameraCollisionRaycaster.near = 0.05;
  cameraCollisionRaycaster.far = idealDistance;

  const [firstHit] = cameraCollisionRaycaster.intersectObjects(wallOccluderList, false);
  if (!firstHit) {
    return 1;
  }

  return THREE.MathUtils.clamp(
    (firstHit.distance - cameraCollisionWallPadding) / idealDistance,
    0,
    1,
  );
}

function getAppliedTileCameraRatio(origin) {
  const paddedRatio = findLargestCameraTileRatio(origin, true);
  if (paddedRatio !== null) {
    return paddedRatio;
  }

  const centerOnlyRatio = findLargestCameraTileRatio(origin, false);
  return centerOnlyRatio ?? 0;
}

function findLargestCameraTileRatio(origin, useCollisionRadius) {
  if (isCameraRatioInsideAppliedTiles(origin, 1, useCollisionRadius)) {
    return 1;
  }

  let unsafeRatio = 1;
  let safeRatio = null;

  for (let step = cameraCollisionSearchSteps - 1; step >= 0; step -= 1) {
    const ratio = step / cameraCollisionSearchSteps;
    if (isCameraRatioInsideAppliedTiles(origin, ratio, useCollisionRadius)) {
      safeRatio = ratio;
      break;
    }

    unsafeRatio = ratio;
  }

  if (safeRatio === null) {
    return null;
  }

  for (let iteration = 0; iteration < cameraCollisionSearchIterations; iteration += 1) {
    const ratio = (safeRatio + unsafeRatio) / 2;
    if (isCameraRatioInsideAppliedTiles(origin, ratio, useCollisionRadius)) {
      safeRatio = ratio;
    } else {
      unsafeRatio = ratio;
    }
  }

  return safeRatio;
}

function isCameraRatioInsideAppliedTiles(origin, ratio, useCollisionRadius) {
  cameraCollisionProbePosition.copy(origin).addScaledVector(cameraCollisionDirection, ratio);
  return isCameraPositionInsideAppliedTiles(cameraCollisionProbePosition, useCollisionRadius);
}

function isCameraPositionInsideAppliedTiles(position, useCollisionRadius) {
  if (!isWorldPointOnAppliedTile(position.x, position.z)) {
    return false;
  }

  if (!useCollisionRadius) {
    return true;
  }

  for (const [offsetX, offsetZ] of cameraCollisionProbeOffsets) {
    if (!isWorldPointOnAppliedTile(
      position.x + offsetX * cameraCollisionRadius,
      position.z + offsetZ * cameraCollisionRadius,
    )) {
      return false;
    }
  }

  return true;
}

function transformAnchoredCameraOffset(offset, target = new THREE.Vector3()) {
  const sideMultiplier = cameraControlState.side === "left" ? -1 : 1;
  const rotation = THREE.MathUtils.degToRad(
    cameraControlState.orbitDegrees - anchoredCameraPreset.baseOrbitDegrees,
  ) + playerControlState.yawRadians;
  const transformedOffset = anchoredCameraOffsetVector
    .set(offset.x * sideMultiplier, offset.y, offset.z)
    .applyAxisAngle(anchoredCameraYawAxis, rotation);
  const pitchAxis = anchoredCameraPitchAxis
    .set(1, 0, 0)
    .applyAxisAngle(anchoredCameraYawAxis, rotation);

  return target
    .copy(transformedOffset)
    .applyAxisAngle(pitchAxis, playerControlState.pitchRadians);
}

function handleCameraKeyDown(event) {
  if (isTypingTarget(event.target)) {
    return;
  }

  const key = event.key.toLowerCase();
  if (optionsMenuState.isOpen) {
    if (key === "escape") {
      event.preventDefault();
      closeOptionsMenu();
    }
    return;
  }

  if (key === "escape" && canOpenGameplayOptionsMenu()) {
    event.preventDefault();
    openOptionsMenu("game");
    return;
  }

  if (isGameplayInputLocked()) {
    event.preventDefault();
    return;
  }

  if (handleCombatWeaponHotkey(key)) {
    event.preventDefault();
    return;
  }

  if (key === "e") {
    if (startCorpseSearchFromPrompt()) {
      event.preventDefault();
    }
    return;
  }

  const isMovementKey = ["w", "a", "s", "d", "shift"].includes(key);
  if (!isMovementKey) {
    return;
  }

  event.preventDefault();
  clearManualMovementPreview();

  if (cameraControlState.freeCamera) {
    if (key !== "shift") {
      cameraControlState.pressedKeys.add(key);
    }
    return;
  }

  playerControlState.pressedKeys.add(key);
}

function handleCombatWeaponHotkey(key) {
  const config = combatWeaponConfigs.find((entry) => entry.slot === key);
  if (!config || isGameplayInputLocked() || cameraControlState.freeCamera || playerControlState.dead) {
    return false;
  }

  if (!isCombatWeaponUnlocked(config.id)) {
    return true;
  }

  switchCombatWeapon(config.id);
  return true;
}

function switchCombatWeapon(weaponId) {
  if (isGameplayInputLocked()) {
    syncWeaponSlotHud();
    return false;
  }

  if (!isCombatWeaponUnlocked(weaponId)) {
    syncWeaponSlotHud();
    return false;
  }

  equipWeapon(weaponId);
  return true;
}

function handleCameraKeyUp(event) {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d"].includes(key)) {
    cameraControlState.pressedKeys.delete(key);
    playerControlState.pressedKeys.delete(key);
  }

  if (key === "shift") {
    playerControlState.pressedKeys.delete(key);
  }
}

function handleCameraWheel(event) {
  if (!cameraControlState.freeCamera) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  const direction = getCameraForwardVector();
  moveFreeCamera(direction.multiplyScalar(-event.deltaY * freeCameraWheelSpeed));
}

function handlePlayerPointerMove(event) {
  if (runtimeIsMobile && event.pointerType !== "mouse") {
    return;
  }

  if (cameraControlState.freeCamera) {
    return;
  }

  if (isGameplayInputLocked()) {
    return;
  }

  const isPointerLocked = document.pointerLockElement === renderer.domElement;
  if (!isPointerLocked && !isEventInsideRenderer(event)) {
    return;
  }

  const movementX = Number(event.movementX) || 0;
  const movementY = Number(event.movementY) || 0;
  if (!movementX && !movementY) {
    return;
  }

  applyLookDelta(movementX, movementY, {
    yawSensitivity: playerMouseYawSensitivity,
    pitchSensitivity: playerMousePitchSensitivity,
  });
}

function handlePlayerPointerDown(event) {
  if (runtimeIsMobile && event.pointerType !== "mouse") {
    return;
  }

  renderer.domElement.focus();

  if (
    isGameplayInputLocked()
    || cameraControlState.freeCamera
    || playerControlState.dead
    || corpseSearchState.active
    || (event.button !== 0 && event.button !== 2)
  ) {
    return;
  }

  if (event.button === 0) {
    event.preventDefault();
  }
  requestPlayerPointerLock();
  syncPlayerMouseButtons(event);
}

function handlePlayerPointerUp(event) {
  if (runtimeIsMobile && event.pointerType !== "mouse") {
    return;
  }

  if (event.button !== 0 && event.button !== 2) {
    return;
  }

  syncPlayerMouseButtons(event);
}

function handlePlayerMouseButtonChange(event) {
  if (runtimeIsMobile && event.pointerType !== "mouse") {
    return;
  }

  if (event.button !== 0 && event.button !== 2) {
    return;
  }

  const isButtonDown = event.type.endsWith("down");
  if (isButtonDown && !isPlayerMouseInputActive(event)) {
    return;
  }

  if (
    isButtonDown
    && (
      isGameplayInputLocked()
      || cameraControlState.freeCamera
      || playerControlState.dead
      || corpseSearchState.active
    )
  ) {
    return;
  }

  if (isButtonDown) {
    event.preventDefault();
    requestPlayerPointerLock();
  }

  syncPlayerMouseButtons(event);
}

function applyLookDelta(movementX, movementY, { yawSensitivity, pitchSensitivity }) {
  const sensitivityMultiplier = playerControlState.aiming ? playerAimMouseSensitivityMultiplier : 1;
  if (movementX) {
    playerControlState.yawRadians = normalizeRadians(
      playerControlState.yawRadians - movementX * yawSensitivity * sensitivityMultiplier,
    );
  }

  if (movementY) {
    playerControlState.pitchRadians = THREE.MathUtils.clamp(
      playerControlState.pitchRadians + movementY * pitchSensitivity * sensitivityMultiplier,
      -playerMousePitchLimit,
      playerMousePitchLimit,
    );
  }

  applyPlayerYaw();
  updateCameraAnchorFromCharacter();
  applyAnchoredCameraFrame();
}

function handlePlayerVisibilityChange() {
  if (document.visibilityState === "hidden") {
    clearPlayerMouseButtons();
  }
}

function handlePlayerPointerLockChange() {
  const wasPointerLocked = playerControlState.pointerLocked;
  playerControlState.pointerLocked = document.pointerLockElement === renderer.domElement;
  if (wasPointerLocked && !playerControlState.pointerLocked) {
    clearPlayerMouseButtons();
    return;
  }

  syncCrosshair();
}

function syncPlayerMouseButtons(event) {
  const previousButtons = playerControlState.mouseButtons || 0;
  const changedButton = mouseButtonMaskFromButton(event.button);
  let buttons = Number.isInteger(event.buttons) ? event.buttons : previousButtons;

  if (event.type.endsWith("down")) {
    buttons |= changedButton;
  } else if (event.type.endsWith("up")) {
    buttons &= ~changedButton;
  }

  buttons &= 3;
  const nextShooting = Boolean(buttons & 1);
  const nextAiming = Boolean(buttons & 2);
  const startedShooting = !playerControlState.shooting && nextShooting;
  const changed = playerControlState.shooting !== nextShooting || playerControlState.aiming !== nextAiming;

  playerControlState.mouseButtons = buttons;
  playerControlState.shooting = nextShooting;
  playerControlState.aiming = nextAiming;

  if (nextShooting || nextAiming) {
    clearManualMovementPreview();
  }

  if (changed) {
    syncCrosshair();
  }

  if (startedShooting) {
    tryFirePlayerWeapon({ force: true });
  }
}

function clearPlayerMouseButtons() {
  const changed = playerControlState.shooting || playerControlState.aiming;
  playerControlState.mouseButtons = 0;
  playerControlState.shooting = false;
  playerControlState.aiming = false;
  stopMobileFireLook();
  mobileFireButton?.classList.remove("is-firing");

  if (changed) {
    syncCrosshair();
  }
}

function mouseButtonMaskFromButton(button) {
  if (button === 0) {
    return 1;
  }

  if (button === 2) {
    return 2;
  }

  return 0;
}

function isPlayerMouseInputActive(event) {
  return document.pointerLockElement === renderer.domElement
    || event.target === renderer.domElement;
}

function requestPlayerPointerLock() {
  if (document.pointerLockElement === renderer.domElement || !renderer.domElement.requestPointerLock) {
    return;
  }

  try {
    const pointerLockRequest = renderer.domElement.requestPointerLock();
    if (pointerLockRequest?.catch) {
      pointerLockRequest.catch(() => {});
    }
  } catch {
    // Some embedded browsers block pointer lock; mouse deltas still work while over the canvas.
  }
}

function isEventInsideRenderer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

function updatePlayerControls(delta) {
  if (!characterModel) {
    return;
  }

  if (playerControlState.dead) {
    updateCameraAnchorFromCharacter();
    applyAnchoredCameraFrame(delta);
    return;
  }

  if (corpseSearchState.active) {
    updateCameraAnchorFromCharacter();
    applyAnchoredCameraFrame(delta);
    return;
  }

  applyPlayerYaw();

  const movement = getPlayerMovementVector();
  const isMoving = movement.lengthSq() > 0.0001;
  const movementAmount = THREE.MathUtils.clamp(movement.length(), 0, 1);
  const virtualMoveState = playerControlState.virtualMove;
  const isVirtualRunning = virtualMoveState.active && virtualMoveState.magnitude >= mobileJoystickRunThreshold;
  const isRunning = !playerControlState.aiming && (
    playerControlState.pressedKeys.has("shift") || isVirtualRunning
  );

  if (isMoving) {
    const baseSpeed = isRunning ? playerRunSpeed : playerWalkSpeed;
    const speed = playerControlState.aiming ? baseSpeed * playerAimMoveSpeedMultiplier : baseSpeed;
    movement.normalize().multiplyScalar(speed * movementAmount * delta);
    moveCharacterWithCollision(movement);
    syncMapPlayerPositionFromCharacter();
  }

  updatePlayerWeaponFire(delta);
  playerControlState.hitReactTimer = Math.max(0, playerControlState.hitReactTimer - delta);
  const isShotAnimating = playerControlState.shotAnimationTimer > 0;
  if (playerControlState.hitReactTimer <= 0) {
    updatePlayerAnimation(isMoving, isRunning, isShotAnimating, playerControlState.aiming);
  }

  updateCameraAnchorFromCharacter();
  applyAnchoredCameraFrame(delta);
}

function updatePlayerWeaponFire(delta) {
  playerControlState.fireCooldown = Math.max(0, playerControlState.fireCooldown - delta);
  playerControlState.shotAnimationTimer = Math.max(0, playerControlState.shotAnimationTimer - delta);

  if (playerControlState.pendingShotTimer > 0) {
    playerControlState.pendingShotTimer = Math.max(0, playerControlState.pendingShotTimer - delta);
    if (playerControlState.pendingShotTimer <= 0) {
      firePreparedPlayerWeapon();
    }
    return;
  }

  tryFirePlayerWeapon();
}

function tryFirePlayerWeapon({ force = false } = {}) {
  if (
    !playerControlState.shooting
    || playerControlState.pendingShotTimer > 0
    || (!force && playerControlState.fireCooldown > 0)
    || isGameplayInputLocked()
    || cameraControlState.freeCamera
    || corpseSearchState.active
  ) {
    return false;
  }

  playerControlState.pendingShotTimer = playerShotWindupDuration;
  playerControlState.shotAnimationTimer = Math.max(
    playerControlState.shotAnimationTimer,
    playerShotWindupDuration + playerShotAnimationDuration,
  );
  return true;
}

function firePreparedPlayerWeapon() {
  const shotStartTime = performanceProfile.perfOverlayEnabled ? performance.now() : 0;
  const weaponId = getActiveCombatWeaponId();
  if (getCombatWeaponAmmo(weaponId) <= 0) {
    playerControlState.fireCooldown = playerFireInterval;
    playerControlState.shotAnimationTimer = playerShotAnimationDuration * 0.55;
    syncPlayerAmmoHud();
    return false;
  }

  if (!firePlayerProjectile()) {
    return false;
  }

  if (weaponId === defaultCombatWeaponId) {
    playPistolShotSound();
  } else if (weaponId === shotgunCombatWeaponId) {
    playShotgunShotSound();
  }
  setCombatWeaponAmmo(weaponId, getCombatWeaponAmmo(weaponId) - 1);
  syncPlayerAmmoHud();
  recordProjectileShotPerf(shotStartTime);
  playerControlState.shotAnimationTimer = playerShotAnimationDuration;
  playerControlState.fireCooldown = playerFireInterval;
  return true;
}

function firePlayerProjectile() {
  if (!characterModel || playerControlState.dead) {
    return false;
  }

  if (getActiveCombatWeaponId() === shotgunCombatWeaponId) {
    return firePlayerShotgunProjectile();
  }

  return firePlayerSingleProjectile();
}

function firePlayerSingleProjectile() {
  camera.getWorldDirection(projectileDirection).normalize();
  createMuzzleFlash(projectileDirection);
  enemyProjectileRaycaster.set(camera.position, projectileDirection);
  enemyProjectileRaycaster.near = 0;
  enemyProjectileRaycaster.far = projectileMaxDistance;

  const wallHits = wallOccluderList.length
    ? enemyProjectileRaycaster.intersectObjects(wallOccluderList, false)
    : [];
  const closestWallDistance = wallHits[0]?.distance ?? Infinity;
  const enemyHit = getClosestProjectileEnemyHit(closestWallDistance);

  if (enemyHit) {
    getShotImpactNormal(enemyHit, shotImpactNormal);
    const damage = enemyHit.headshot
      ? projectileHeadDamage
      : projectileBodyDamage;
    createImpactEffect(enemyHit.point, shotImpactNormal, { hitEnemy: true });
    spawnEnemyDamageNumber(enemyHit.enemy, damage, { headshot: enemyHit.headshot, point: enemyHit.point });
    damageEnemy(enemyHit.enemy, damage, { source: "shot", headshot: enemyHit.headshot });
    return true;
  }

  if (closestWallDistance < Infinity) {
    const wallHit = wallHits[0];
    getShotImpactNormal(wallHit, shotImpactNormal);
    createImpactEffect(wallHit.point, shotImpactNormal, { hitEnemy: false });
  }

  return true;
}

function firePlayerShotgunProjectile() {
  camera.getWorldDirection(projectileDirection).normalize();
  createMuzzleFlash(projectileDirection);
  createShotgunConeTrail(projectileDirection);

  const cameraShotgunMaxDistance = getShotgunCameraMaxDistance();
  enemyProjectileRaycaster.set(camera.position, projectileDirection);
  enemyProjectileRaycaster.near = 0;
  enemyProjectileRaycaster.far = cameraShotgunMaxDistance;

  const wallHits = wallOccluderList.length
    ? enemyProjectileRaycaster.intersectObjects(wallOccluderList, false)
    : [];
  const closestWallDistance = Math.min(wallHits[0]?.distance ?? Infinity, cameraShotgunMaxDistance);
  const enemyHits = getShotgunEnemyHits(closestWallDistance);

  if (enemyHits.length > 0) {
    for (const enemyHit of enemyHits) {
      const damage = getShotgunDamage(enemyHit.distance, enemyHit.headshot);
      createImpactEffect(enemyHit.point, enemyHit.normal, { hitEnemy: true });
      spawnEnemyDamageNumber(enemyHit.enemy, damage, { headshot: enemyHit.headshot, point: enemyHit.point });
      damageEnemy(enemyHit.enemy, damage, { source: "shot", headshot: enemyHit.headshot });
    }
    return true;
  }

  if (wallHits[0] && wallHits[0].distance <= cameraShotgunMaxDistance) {
    const wallHit = wallHits[0];
    getShotImpactNormal(wallHit, shotImpactNormal);
    createImpactEffect(wallHit.point, shotImpactNormal, { hitEnemy: false });
  }

  return true;
}

function getShotgunCameraMaxDistance() {
  const playerDistanceFromCamera = characterModel
    ? camera.position.distanceTo(characterModel.position)
    : 0;
  return shotgunMaxDistance + playerDistanceFromCamera + platformTileSize;
}

function getClosestProjectileEnemyHit(maxDistance) {
  let closestDistance = maxDistance;
  projectileEnemyHit.enemy = null;
  projectileEnemyHit.distance = Infinity;
  projectileEnemyHit.headshot = false;

  for (const enemy of activeEnemies) {
    if (!isEnemyTargetable(enemy)) {
      continue;
    }

    if (intersectProjectileEnemyHitboxes(enemy, closestDistance)) {
      closestDistance = projectileEnemyHit.distance;
    }
  }

  return projectileEnemyHit.enemy ? projectileEnemyHit : null;
}

function getShotgunEnemyHits(maxDistance) {
  shotgunEnemyHits.length = 0;

  for (const enemy of activeEnemies) {
    if (!isEnemyTargetable(enemy)) {
      continue;
    }

    const hit = getShotgunEnemyHit(enemy, maxDistance);
    if (hit) {
      shotgunEnemyHits.push(hit);
    }
  }

  shotgunEnemyHits.sort((a, b) => a.distance - b.distance);
  return shotgunEnemyHits;
}

function getShotgunEnemyHit(enemy, maxDistance) {
  if (!enemy.hitbox) {
    return null;
  }

  updateEnemyProjectileBoxes(enemy);

  const headHit = getShotgunConeHitForBox(enemy, projectileHeadBox, maxDistance, true);
  if (headHit) {
    return headHit;
  }

  return getShotgunConeHitForBox(enemy, projectileBodyBox, maxDistance, false);
}

function getShotgunConeHitForBox(enemy, box, maxDistance, headshot) {
  box.getCenter(shotgunConeCenter);
  box.getSize(shotgunConeBoxSize);

  const playerDistance = getShotgunPlayerDistanceToEnemy(enemy);
  if (playerDistance > shotgunMaxDistance) {
    return null;
  }

  const targetRadius = headshot
    ? enemy.hitbox.headRadius * 1.15
    : Math.max(enemy.hitbox.bodyRadius, shotgunConeBoxSize.y * 0.48);
  const projection = shotgunConeOffset
    .copy(shotgunConeCenter)
    .sub(camera.position)
    .dot(projectileDirection);

  if (projection <= 0 || projection > maxDistance) {
    return null;
  }

  shotgunConeClosestPoint.copy(camera.position).addScaledVector(projectileDirection, projection);
  const lateralDistance = shotgunConeClosestPoint.distanceTo(shotgunConeCenter);
  const coneRadius = getShotgunConeRadius(projection);
  if (lateralDistance > coneRadius + targetRadius) {
    return null;
  }

  shotgunConeNormal.copy(shotgunConeClosestPoint).sub(shotgunConeCenter);
  if (shotgunConeNormal.lengthSq() > 0.0001) {
    shotgunConeNormal.normalize();
    shotgunConeImpactPoint.copy(shotgunConeCenter).addScaledVector(
      shotgunConeNormal,
      Math.min(targetRadius, lateralDistance),
    );
  } else {
    shotgunConeNormal.copy(projectileDirection).multiplyScalar(-1).normalize();
    shotgunConeImpactPoint.copy(shotgunConeCenter);
  }

  return {
    enemy,
    distance: playerDistance,
    projection,
    headshot,
    point: shotgunConeImpactPoint.clone(),
    normal: shotgunConeNormal.clone(),
  };
}

function getShotgunPlayerDistanceToEnemy(enemy) {
  if (!characterModel || !enemy?.model) {
    return Infinity;
  }

  return Math.hypot(
    enemy.model.position.x - characterModel.position.x,
    enemy.model.position.z - characterModel.position.z,
  );
}

function getShotgunConeRadius(distance) {
  return shotgunConeBaseRadius + (distance / platformTileSize) * shotgunConeRadiusPerTile;
}

function getShotgunDamage(distance, headshot) {
  const baseDamage = headshot ? projectileHeadDamage : projectileBodyDamage;
  const tiles = distance / platformTileSize;
  const step = shotgunDamageSteps.find((entry) => tiles <= entry.maxTiles)
    || shotgunDamageSteps[shotgunDamageSteps.length - 1];
  return Math.max(1, Math.round(baseDamage * step.multiplier));
}

function getShotImpactNormal(hit, target) {
  if (hit.normal) {
    target.copy(hit.normal).normalize();
    return target;
  }

  if (hit.face?.normal && hit.object?.matrixWorld) {
    target.copy(hit.face.normal).transformDirection(hit.object.matrixWorld).normalize();
    return target;
  }

  return target.copy(projectileDirection).multiplyScalar(-1).normalize();
}

function intersectProjectileEnemyHitboxes(enemy, maxDistance) {
  if (!enemy.hitbox) {
    return false;
  }

  updateEnemyProjectileBoxes(enemy);

  let hitDistance = Infinity;
  let hitHead = false;

  const headPoint = enemyProjectileRaycaster.ray.intersectBox(projectileHeadBox, projectileHitPoint);
  if (headPoint) {
    hitDistance = camera.position.distanceTo(headPoint);
    hitHead = true;
    projectileEnemyHit.point.copy(headPoint);
    getBoxHitNormal(projectileHeadBox, headPoint, projectileEnemyHit.normal);
  }

  const bodyPoint = hitHead ? null : enemyProjectileRaycaster.ray.intersectBox(projectileBodyBox, shotImpactPoint);
  if (!hitHead && bodyPoint) {
    const bodyDistance = camera.position.distanceTo(bodyPoint);
    if (bodyDistance < hitDistance) {
      hitDistance = bodyDistance;
      hitHead = false;
      projectileEnemyHit.point.copy(bodyPoint);
      getBoxHitNormal(projectileBodyBox, bodyPoint, projectileEnemyHit.normal);
    }
  }

  if (hitDistance >= maxDistance || hitDistance > projectileMaxDistance) {
    return false;
  }

  projectileEnemyHit.enemy = enemy;
  projectileEnemyHit.distance = hitDistance;
  projectileEnemyHit.headshot = hitHead;
  return true;
}

function updateEnemyProjectileBoxes(enemy) {
  const { hitbox } = enemy;
  const position = enemy.model.position;
  const bodyRadius = hitbox.bodyRadius;
  const headRadius = hitbox.headRadius;

  projectileBodyBox.min.set(
    position.x - bodyRadius,
    position.y + hitbox.minY,
    position.z - bodyRadius,
  );
  projectileBodyBox.max.set(
    position.x + bodyRadius,
    position.y + hitbox.headMinY,
    position.z + bodyRadius,
  );
  projectileHeadBox.min.set(
    position.x - headRadius,
    position.y + hitbox.headMinY,
    position.z - headRadius,
  );
  projectileHeadBox.max.set(
    position.x + headRadius,
    position.y + hitbox.maxY,
    position.z + headRadius,
  );
}

function getBoxHitNormal(box, point, target) {
  let nearestDistance = Math.abs(point.x - box.min.x);
  target.set(-1, 0, 0);

  const maxXDistance = Math.abs(point.x - box.max.x);
  if (maxXDistance < nearestDistance) {
    nearestDistance = maxXDistance;
    target.set(1, 0, 0);
  }

  const minYDistance = Math.abs(point.y - box.min.y);
  if (minYDistance < nearestDistance) {
    nearestDistance = minYDistance;
    target.set(0, -1, 0);
  }

  const maxYDistance = Math.abs(point.y - box.max.y);
  if (maxYDistance < nearestDistance) {
    nearestDistance = maxYDistance;
    target.set(0, 1, 0);
  }

  const minZDistance = Math.abs(point.z - box.min.z);
  if (minZDistance < nearestDistance) {
    nearestDistance = minZDistance;
    target.set(0, 0, -1);
  }

  const maxZDistance = Math.abs(point.z - box.max.z);
  if (maxZDistance < nearestDistance) {
    target.set(0, 0, 1);
  }

  return target;
}

function prewarmProjectileEffectPools() {
  for (let index = impactEffectPool.length; index < performanceProfile.prewarmImpactEffects; index += 1) {
    impactEffectPool.push(createImpactEffectEntry());
  }

  for (let index = muzzleFlashPool.length; index < performanceProfile.prewarmMuzzleFlashes; index += 1) {
    muzzleFlashPool.push(createMuzzleFlashEntry());
  }

  for (let index = shotgunTrailParticlePool.length; index < shotgunTrailParticleCount; index += 1) {
    shotgunTrailParticlePool.push(createShotgunTrailParticleEntry());
  }
}

function acquireImpactEffect() {
  return impactEffectPool.pop() || createImpactEffectEntry();
}

function releaseImpactEffect(effect) {
  effect.mesh.visible = false;
  effect.mesh.material.opacity = 0;
  if (effect.light) {
    effect.light.visible = false;
    effect.light.intensity = 0;
  }
  effect.age = 0;
  impactEffectPool.push(effect);
}

function createImpactEffectEntry() {
  const mesh = new THREE.Mesh(impactGeometry, impactMaterial.clone());
  const light = performanceProfile.effectLightsEnabled
    ? new THREE.PointLight(0xfff1c1, 0, 3.2, 2)
    : null;
  mesh.visible = false;
  mesh.frustumCulled = true;
  scene.add(mesh);

  if (light) {
    light.visible = false;
    scene.add(light);
  }

  return {
    mesh,
    light,
    age: 0,
    duration: impactEffectDuration,
    baseScale: 1,
  };
}

function acquireMuzzleFlash() {
  return muzzleFlashPool.pop() || createMuzzleFlashEntry();
}

function releaseMuzzleFlash(flash) {
  flash.mesh.visible = false;
  flash.mesh.material.opacity = 0;
  if (flash.light) {
    flash.light.visible = false;
    flash.light.intensity = 0;
  }
  flash.age = 0;
  muzzleFlashPool.push(flash);
}

function createMuzzleFlashEntry() {
  const mesh = new THREE.Mesh(muzzleFlashGeometry, muzzleFlashMaterial.clone());
  const light = performanceProfile.effectLightsEnabled
    ? new THREE.PointLight(0xffe0a8, 0, 4.8, 2)
    : null;
  mesh.visible = false;
  mesh.frustumCulled = true;
  scene.add(mesh);

  if (light) {
    light.visible = false;
    scene.add(light);
  }

  return {
    mesh,
    light,
    age: 0,
    duration: muzzleFlashDuration,
    baseScale: 1.25,
  };
}

function acquireShotgunTrailParticle() {
  return shotgunTrailParticlePool.pop() || createShotgunTrailParticleEntry();
}

function releaseShotgunTrailParticle(particle) {
  particle.mesh.visible = false;
  particle.mesh.material.opacity = 0;
  particle.age = 0;
  particle.velocity.set(0, 0, 0);
  shotgunTrailParticlePool.push(particle);
}

function createShotgunTrailParticleEntry() {
  const mesh = new THREE.Mesh(shotgunTrailParticleGeometry, shotgunTrailParticleMaterial.clone());
  mesh.name = "ShotgunConeParticle";
  mesh.visible = false;
  mesh.frustumCulled = true;
  scene.add(mesh);

  return {
    mesh,
    velocity: new THREE.Vector3(),
    age: 0,
    duration: shotgunTrailParticleDuration,
    baseScale: shotgunTrailParticleBaseScale,
  };
}

function createImpactEffect(point, normal, { hitEnemy = false } = {}) {
  const effect = acquireImpactEffect();
  const { mesh, light } = effect;
  const scale = hitEnemy ? 1.35 : 1;
  const color = hitEnemy ? 0xffd0a8 : 0xfff1c1;

  mesh.name = hitEnemy ? "EnemyImpact" : "WorldImpact";
  mesh.position.copy(point).addScaledVector(normal, 0.04);
  mesh.scale.setScalar(scale);
  mesh.material.color.setHex(color);
  mesh.material.opacity = 0.92;
  mesh.visible = true;
  if (light) {
    light.color.setHex(color);
    light.position.copy(mesh.position).addScaledVector(normal, 0.04);
    light.intensity = impactLightIntensity;
    light.visible = true;
  }
  effect.age = 0;
  effect.duration = impactEffectDuration;
  effect.baseScale = scale;
  activeImpactEffects.push(effect);
}

function createMuzzleFlash(direction) {
  if (!characterModel) {
    return;
  }

  getMuzzleFlashPosition(direction, muzzleFlashPosition);

  const flash = acquireMuzzleFlash();
  const { mesh, light } = flash;

  mesh.name = "WeaponMuzzleFlash";
  mesh.position.copy(muzzleFlashPosition);
  mesh.scale.setScalar(1.25);
  mesh.material.opacity = 0.96;
  mesh.visible = true;
  if (light) {
    light.position.copy(muzzleFlashPosition);
    light.intensity = muzzleFlashLightIntensity;
    light.visible = true;
  }
  flash.age = 0;
  flash.duration = muzzleFlashDuration;
  flash.baseScale = 1.25;
  activeMuzzleFlashes.push(flash);
}

function createShotgunConeTrail(direction) {
  if (!characterModel) {
    return;
  }

  shotgunTrailOrigin.copy(muzzleFlashPosition);
  const trailDistance = getShotgunTrailDistance(direction);
  if (trailDistance <= 0.1) {
    return;
  }

  setShotgunTrailBasis(direction);

  for (let index = 0; index < shotgunTrailParticleCount; index += 1) {
    const progress = 0.08 + Math.random() * 0.92;
    const distance = trailDistance * progress;
    const coneRadius = getShotgunConeRadius(distance) * 0.7;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * coneRadius;
    shotgunTrailRadial
      .copy(shotgunTrailRight)
      .multiplyScalar(Math.cos(angle) * radius)
      .addScaledVector(shotgunTrailUp, Math.sin(angle) * radius);

    const particle = acquireShotgunTrailParticle();
    const { mesh } = particle;
    mesh.position
      .copy(shotgunTrailOrigin)
      .addScaledVector(direction, distance)
      .add(shotgunTrailRadial);
    mesh.scale.setScalar(
      shotgunTrailParticleBaseScale
        * (0.7 + progress * 1.25)
        * (0.75 + Math.random() * 0.5),
    );
    mesh.material.opacity = 0.78;
    mesh.visible = true;

    shotgunTrailVelocity.copy(direction).multiplyScalar(4.5 + Math.random() * 5.5);
    if (shotgunTrailRadial.lengthSq() > 0.0001) {
      shotgunTrailVelocity.addScaledVector(shotgunTrailRadial.normalize(), 1.4 + progress * 2.2);
    }
    particle.velocity.copy(shotgunTrailVelocity);
    particle.age = 0;
    particle.duration = shotgunTrailParticleDuration * (0.75 + Math.random() * 0.5);
    particle.baseScale = mesh.scale.x;
    activeShotgunTrailParticles.push(particle);
  }
}

function getShotgunTrailDistance(direction) {
  if (!wallOccluderList.length) {
    return shotgunMaxDistance;
  }

  enemyProjectileRaycaster.set(shotgunTrailOrigin, direction);
  enemyProjectileRaycaster.near = 0.05;
  enemyProjectileRaycaster.far = shotgunMaxDistance;
  const [firstHit] = enemyProjectileRaycaster.intersectObjects(wallOccluderList, false);
  return Math.min(firstHit?.distance ?? shotgunMaxDistance, shotgunMaxDistance);
}

function setShotgunTrailBasis(direction) {
  shotgunTrailRight.crossVectors(direction, camera.up);
  if (shotgunTrailRight.lengthSq() <= 0.0001) {
    shotgunTrailRight.set(1, 0, 0);
  } else {
    shotgunTrailRight.normalize();
  }

  shotgunTrailUp.crossVectors(shotgunTrailRight, direction).normalize();
}

function getMuzzleFlashPosition(direction, target) {
  const muzzleLocalCenter = currentHeldItem?.userData?.muzzleLocalCenter;
  if (currentHeldItem && muzzleLocalCenter) {
    target.copy(muzzleLocalCenter);
    currentHeldItem.localToWorld(target);
    return target.addScaledVector(direction, currentHeldItem.userData.muzzleForwardOffset ?? 0.42);
  }

  if (currentHeldItem) {
    currentHeldItem.getWorldPosition(target);
    return target.addScaledVector(direction, currentHeldItem.userData.muzzleForwardOffset ?? 0.42);
  }

  if (heldSlot) {
    heldSlot.getWorldPosition(target);
    return target.addScaledVector(direction, 0.48);
  }

  return target.copy(camera.position).addScaledVector(direction, 0.85);
}

function updateImpactEffects(delta) {
  if (!activeImpactEffects.length) {
    updateMuzzleFlashes(delta);
    updateShotgunTrailParticles(delta);
    return;
  }

  for (let index = activeImpactEffects.length - 1; index >= 0; index -= 1) {
    const effect = activeImpactEffects[index];
    effect.age += delta;
    const progress = THREE.MathUtils.clamp(effect.age / effect.duration, 0, 1);
    const fade = 1 - progress;

    effect.mesh.scale.setScalar(effect.baseScale * (1 + progress * 2.8));
    effect.mesh.material.opacity = 0.92 * fade;
    if (effect.light) {
      effect.light.intensity = impactLightIntensity * fade;
    }

    if (progress >= 1) {
      activeImpactEffects.splice(index, 1);
      releaseImpactEffect(effect);
    }
  }

  updateMuzzleFlashes(delta);
  updateShotgunTrailParticles(delta);
}

function updateMuzzleFlashes(delta) {
  if (!activeMuzzleFlashes.length) {
    return;
  }

  for (let index = activeMuzzleFlashes.length - 1; index >= 0; index -= 1) {
    const flash = activeMuzzleFlashes[index];
    flash.age += delta;
    const progress = THREE.MathUtils.clamp(flash.age / flash.duration, 0, 1);
    const fade = 1 - progress;

    flash.mesh.scale.setScalar(flash.baseScale * (1 + progress * 2.2));
    flash.mesh.material.opacity = 0.96 * fade;
    if (flash.light) {
      flash.light.intensity = muzzleFlashLightIntensity * fade;
    }

    if (progress >= 1) {
      activeMuzzleFlashes.splice(index, 1);
      releaseMuzzleFlash(flash);
    }
  }
}

function updateShotgunTrailParticles(delta) {
  if (!activeShotgunTrailParticles.length) {
    return;
  }

  for (let index = activeShotgunTrailParticles.length - 1; index >= 0; index -= 1) {
    const particle = activeShotgunTrailParticles[index];
    particle.age += delta;
    const progress = THREE.MathUtils.clamp(particle.age / particle.duration, 0, 1);
    const fade = 1 - progress;

    particle.mesh.position.addScaledVector(particle.velocity, delta);
    particle.mesh.scale.setScalar(particle.baseScale * (1 + progress * 0.9));
    particle.mesh.material.opacity = 0.78 * fade;

    if (progress >= 1) {
      activeShotgunTrailParticles.splice(index, 1);
      releaseShotgunTrailParticle(particle);
    }
  }
}

function clearImpactEffects() {
  for (const effect of activeImpactEffects) {
    releaseImpactEffect(effect);
  }

  activeImpactEffects = [];

  for (const flash of activeMuzzleFlashes) {
    releaseMuzzleFlash(flash);
  }

  activeMuzzleFlashes = [];

  for (const particle of activeShotgunTrailParticles) {
    releaseShotgunTrailParticle(particle);
  }

  activeShotgunTrailParticles = [];
}

function trySpawnAmmoDrop(enemy) {
  if (enemy.type === "boss" || Math.random() >= ammoDropChance) {
    return;
  }

  const weaponId = pickAmmoDropWeaponId();
  if (!weaponId) {
    return;
  }

  spawnAmmoPickup(enemy.model.position, weaponId);
}

function pickAmmoDropWeaponId() {
  const weaponIds = getUnlockedCombatWeaponIds();
  if (!weaponIds.length) {
    return null;
  }

  return weaponIds[Math.floor(Math.random() * weaponIds.length)];
}

function spawnAmmoPickup(position, weaponId = getActiveCombatWeaponId()) {
  const group = new THREE.Group();
  group.name = "AmmoPickup";
  const config = getCombatWeaponConfig(weaponId);
  const pickupMaterial = config.id === shotgunCombatWeaponId
    ? ammoPickupShotgunMaterial
    : ammoPickupPistolMaterial;
  const box = new THREE.Mesh(ammoPickupGeometry, pickupMaterial);
  const topMark = new THREE.Mesh(ammoPickupTopGeometry, ammoPickupTopMaterial);

  box.name = "AmmoPickupBox";
  topMark.name = "AmmoPickupMark";
  topMark.position.y = (ammoPickupBoxHeight / 2) + 0.016;
  group.add(box, topMark);
  group.position.set(position.x, ammoPickupBoxHeight / 2, position.z);
  group.rotation.y = Math.random() * Math.PI * 2;
  group.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = false;
      node.receiveShadow = false;
      node.frustumCulled = true;
    }
  });

  scene.add(group);
  activeAmmoPickups.push({
    group,
    weaponId: config.id,
    amount: ammoPickupAmount,
    age: 0,
  });
}

function updateAmmoPickups(delta) {
  if (!activeAmmoPickups.length || !characterModel || playerControlState.dead) {
    return;
  }

  for (let index = activeAmmoPickups.length - 1; index >= 0; index -= 1) {
    const pickup = activeAmmoPickups[index];
    pickup.age += delta;
    pickup.group.rotation.y += delta * 1.4;
    pickup.group.position.y = (ammoPickupBoxHeight / 2) + Math.sin(pickup.age * 4.8) * 0.025;

    ammoPickupPosition.copy(pickup.group.position);
    let distanceSq = (
      ((characterModel.position.x - ammoPickupPosition.x) ** 2)
      + ((characterModel.position.z - ammoPickupPosition.z) ** 2)
    );

    if (distanceSq <= ammoPickupMagnetRadius * ammoPickupMagnetRadius) {
      const pull = 1 - Math.exp(-ammoPickupMagnetSpeed * delta);
      pickup.group.position.x += (characterModel.position.x - pickup.group.position.x) * pull;
      pickup.group.position.z += (characterModel.position.z - pickup.group.position.z) * pull;
      ammoPickupPosition.copy(pickup.group.position);
      distanceSq = (
        ((characterModel.position.x - ammoPickupPosition.x) ** 2)
        + ((characterModel.position.z - ammoPickupPosition.z) ** 2)
      );
    }

    if (distanceSq > ammoPickupCollectRadius * ammoPickupCollectRadius) {
      continue;
    }

    collectAmmoPickup(pickup);
    activeAmmoPickups.splice(index, 1);
  }
}

function collectAmmoPickup(pickup) {
  addCombatWeaponAmmo(pickup.weaponId, pickup.amount);
  syncPlayerAmmoHud();
  showAmmoPickupToast(pickup.amount);
  pickup.group.removeFromParent();
}

function clearAmmoPickups() {
  for (const pickup of activeAmmoPickups) {
    pickup.group.removeFromParent();
  }
  activeAmmoPickups = [];
}

function showAmmoPickupToast(amount) {
  if (!ammoPickupToastElement) {
    return;
  }

  ammoPickupToastElement.textContent = `+${amount}`;
  ammoPickupToastElement.hidden = false;
  ammoPickupToastElement.classList.remove("is-visible");
  // Force the transition to replay when pickups happen quickly.
  void ammoPickupToastElement.offsetWidth;
  ammoPickupToastElement.classList.add("is-visible");
  ammoPickupToastTimer = ammoPickupToastDuration;
}

function updateAmmoPickupToast(delta) {
  if (!ammoPickupToastElement || ammoPickupToastTimer <= 0) {
    return;
  }

  ammoPickupToastTimer = Math.max(0, ammoPickupToastTimer - delta);
  if (ammoPickupToastTimer > 0) {
    return;
  }

  ammoPickupToastElement.classList.remove("is-visible");
  window.setTimeout(() => {
    if (ammoPickupToastTimer <= 0) {
      ammoPickupToastElement.hidden = true;
    }
  }, 220);
}

function resetCorpseSearchState() {
  corpseSearchState = createCorpseSearchState();
  syncCorpseSearchButton(null);
}

function updateCorpseSearch(delta) {
  if (!corpseSearchState.active) {
    return;
  }

  if (!characterModel || playerControlState.dead || !corpseSearchState.enemy) {
    resetCorpseSearchState();
    return;
  }

  corpseSearchState.timer = Math.max(0, corpseSearchState.timer - delta);
  corpseSearchState.animationTimer -= delta;
  if (corpseSearchState.animationTimer <= 0) {
    playMovement("PickUp", { restart: true });
    corpseSearchState.animationTimer = corpseSearchAnimationRestartSeconds;
  }

  if (corpseSearchState.timer > 0) {
    return;
  }

  finishCorpseSearch();
}

function updateCorpseSearchPrompt() {
  if (corpseSearchState.active) {
    corpseSearchState.promptEnemy = null;
    syncCorpseSearchButton(null);
    return;
  }

  const enemy = getNearestSearchableCorpse();
  corpseSearchState.promptEnemy = enemy;
  syncCorpseSearchButton(enemy);
}

function syncCorpseSearchButton(enemy) {
  if (!corpseSearchButton) {
    return;
  }

  const canShow = Boolean(enemy);
  corpseSearchButton.hidden = !canShow;
  corpseSearchButton.disabled = !canShow;
}

function startCorpseSearchFromPrompt() {
  const enemy = corpseSearchState.promptEnemy || getNearestSearchableCorpse();
  if (!enemy) {
    return false;
  }

  return startCorpseSearch(enemy);
}

function startCorpseSearch(enemy) {
  if (!canSearchCorpses() || !isSearchableCorpse(enemy)) {
    return false;
  }

  clearManualMovementPreview();
  clearPlayerMouseButtons();
  playerControlState.pressedKeys.clear();
  cameraControlState.pressedKeys.clear();
  stopMobileJoystick();
  stopMobileLook();
  stopMobileFireLook();
  mobileFireButton?.classList.remove("is-firing");

  enemy.searchInProgress = true;
  corpseSearchState.active = true;
  corpseSearchState.enemy = enemy;
  corpseSearchState.timer = corpseSearchDuration;
  corpseSearchState.animationTimer = 0;
  corpseSearchState.promptEnemy = null;
  syncCorpseSearchButton(null);
  playMovement("PickUp", { restart: true });
  return true;
}

function finishCorpseSearch() {
  const enemy = corpseSearchState.enemy;
  const weaponId = Math.random() < corpseSearchFindChance
    ? pickCorpseSearchWeaponId()
    : null;

  resetCorpseSearchState();

  if (enemy) {
    removeSearchedCorpse(enemy);
  }

  if (weaponId) {
    addCombatWeaponAmmo(weaponId, corpseSearchAmmoAmount);
    syncPlayerAmmoHud();
    showCorpseSearchNotice(`+${corpseSearchAmmoAmount} ${getCombatWeaponConfig(weaponId).label}`);
  } else {
    showCorpseSearchNotice("Nada encontrado");
  }
}

function showCorpseSearchNotice(message) {
  setStatus(message, "done");
  window.setTimeout(() => {
    if (getStatusMessage() === message && !playerControlState.dead) {
      hideStatus();
    }
  }, 1200);
}

function pickCorpseSearchWeaponId() {
  const candidates = getUnlockedCombatWeaponIds().filter((weaponId) => {
    const config = getCombatWeaponConfig(weaponId);
    return getCombatWeaponAmmo(weaponId) < config.maxAmmo;
  });
  if (!candidates.length) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getNearestSearchableCorpse() {
  if (!canSearchCorpses()) {
    return null;
  }

  let nearestEnemy = null;
  let nearestDistanceSq = corpseSearchRadius * corpseSearchRadius;
  for (const enemy of activeEnemies) {
    if (!isSearchableCorpse(enemy)) {
      continue;
    }

    const distanceSq = (
      ((characterModel.position.x - enemy.model.position.x) ** 2)
      + ((characterModel.position.z - enemy.model.position.z) ** 2)
    );
    if (distanceSq <= nearestDistanceSq) {
      nearestEnemy = enemy;
      nearestDistanceSq = distanceSq;
    }
  }

  return nearestEnemy;
}

function canSearchCorpses() {
  return Boolean(
    characterModel
      && !playerControlState.dead
      && !isGameplayInputLocked()
      && !cameraControlState.freeCamera
      && !corpseSearchState.active,
  );
}

function getUnlockedCombatWeaponIds() {
  return combatWeaponConfigs
    .filter((config) => isCombatWeaponUnlocked(config.id))
    .map((config) => config.id);
}

function isSearchableCorpse(enemy) {
  return Boolean(
    enemy
      && enemy.type !== "boss"
      && enemy.state === "dead"
      && !enemy.searched
      && !enemy.searchInProgress
      && enemy.model?.parent
      && enemy.model.visible,
  );
}

function removeSearchedCorpse(enemy) {
  enemy.searched = true;
  enemy.searchInProgress = false;
  enemy.model.visible = false;
  enemy.model.removeFromParent();
}

function setupFloorLootChest() {
  clearFloorLootObjects();
  if (
    mapEditorState.activeFloorIndex !== shotgunChestFloorIndex
    || isCombatWeaponUnlocked(shotgunCombatWeaponId)
    || mapEditorState.appliedTiles.size === 0
  ) {
    return;
  }

  const placement = findShotgunChestPlacement(mapEditorState.appliedTiles);
  if (!placement) {
    return;
  }

  activeLootChest = createShotgunChest(placement);
  scene.add(activeLootChest.group);
}

function clearFloorLootObjects() {
  if (activeLootChest) {
    activeLootChest.group.removeFromParent();
    activeLootChest = null;
  }

  if (activeWeaponDrop) {
    activeWeaponDrop.group.removeFromParent();
    activeWeaponDrop = null;
  }
}

function updateFloorLoot(delta) {
  updateShotgunChest(delta);
  updateShotgunWeaponDrop(delta);
}

function updateShotgunChest(delta) {
  if (!activeLootChest || !characterModel) {
    return;
  }

  if (!activeLootChest.opened) {
    const distanceSq = (
      ((characterModel.position.x - activeLootChest.group.position.x) ** 2)
      + ((characterModel.position.z - activeLootChest.group.position.z) ** 2)
    );
    if (distanceSq <= shotgunChestTriggerRadius * shotgunChestTriggerRadius) {
      openShotgunChest(activeLootChest);
    }
  }

  const targetAngle = activeLootChest.opened ? -1.18 : 0;
  activeLootChest.lidPivot.rotation.x = THREE.MathUtils.damp(
    activeLootChest.lidPivot.rotation.x,
    targetAngle,
    9,
    delta,
  );
}

function openShotgunChest(chest) {
  chest.opened = true;
  if (!chest.dropRequested) {
    chest.dropRequested = true;
    spawnShotgunWeaponDrop(chest);
  }
}

async function spawnShotgunWeaponDrop(chest) {
  try {
    const shotgunConfig = weaponById.get(shotgunCombatWeaponId);
    const source = await loadWeapon(shotgunConfig);
    if (!activeLootChest || activeLootChest !== chest || activeWeaponDrop || isCombatWeaponUnlocked(shotgunCombatWeaponId)) {
      return;
    }

    const group = new THREE.Group();
    group.name = "ShotgunPickup";
    const model = source.clone(true);
    model.name = "ShotgunPickupModel";
    prepareHeldItem(model);
    fitWeaponPickupModel(model, 2.35);
    group.add(model);

    weaponDropStartPosition.copy(chest.group.position);
    weaponDropStartPosition.y = 0.82;
    weaponDropStartPosition.addScaledVector(chest.facing, 0.18);
    weaponDropEndPosition.copy(chest.group.position);
    weaponDropEndPosition.y = 0.11;
    weaponDropEndPosition.addScaledVector(chest.facing, 1.12);

    group.position.copy(weaponDropStartPosition);
    group.rotation.y = yawFromDirection(chest.facing) + Math.PI / 2;
    scene.add(group);

    activeWeaponDrop = {
      group,
      weaponId: shotgunCombatWeaponId,
      age: 0,
      duration: shotgunDropDuration,
      start: weaponDropStartPosition.clone(),
      end: weaponDropEndPosition.clone(),
      collectable: false,
    };
  } catch (error) {
    console.error("Falha ao criar drop da shotgun.", error);
  }
}

function updateShotgunWeaponDrop(delta) {
  if (!activeWeaponDrop || !characterModel) {
    return;
  }

  activeWeaponDrop.age += delta;
  const progress = THREE.MathUtils.clamp(activeWeaponDrop.age / activeWeaponDrop.duration, 0, 1);
  activeWeaponDrop.group.position.lerpVectors(activeWeaponDrop.start, activeWeaponDrop.end, progress);
  activeWeaponDrop.group.position.y += Math.sin(progress * Math.PI) * shotgunDropArcHeight;
  activeWeaponDrop.group.rotation.y += delta * 2.8;
  activeWeaponDrop.collectable = progress >= 0.45;

  if (!activeWeaponDrop.collectable) {
    return;
  }

  const distanceSq = (
    ((characterModel.position.x - activeWeaponDrop.group.position.x) ** 2)
    + ((characterModel.position.z - activeWeaponDrop.group.position.z) ** 2)
  );
  if (distanceSq > shotgunPickupRadius * shotgunPickupRadius) {
    return;
  }

  collectShotgunWeaponDrop();
}

function collectShotgunWeaponDrop() {
  if (!activeWeaponDrop) {
    return;
  }

  activeWeaponDrop.group.removeFromParent();
  activeWeaponDrop = null;
  unlockCombatWeapon(shotgunCombatWeaponId, { ammo: getCombatWeaponConfig(shotgunCombatWeaponId).grantAmmo });
  equipWeapon(shotgunCombatWeaponId);
  setStatus("Shotgun equipada", "done");
  window.setTimeout(() => hideStatus(), 700);
}

function createShotgunChest(placement) {
  const group = new THREE.Group();
  group.name = "ShotgunChest";
  const lidPivot = new THREE.Group();
  lidPivot.name = "ShotgunChestLidPivot";

  const addPart = (parent, name, geometry, material, position, rotation = null) => {
    const part = new THREE.Mesh(geometry, material);
    part.name = name;
    part.position.fromArray(position);
    if (rotation) {
      part.rotation.fromArray(rotation);
    }
    parent.add(part);
    return part;
  };

  addPart(group, "ShotgunChestBase", chestBaseGeometry, chestBaseMaterial, [0, 0.34, 0]);
  addPart(group, "ShotgunChestFrontPanel", chestPanelGeometry, chestPanelMaterial, [0, 0.38, 0.565]);
  addPart(group, "ShotgunChestBackPanel", chestPanelGeometry, chestPanelMaterial, [0, 0.38, -0.565]);
  addPart(group, "ShotgunChestLeftPanel", chestSidePanelGeometry, chestPanelMaterial, [-0.985, 0.38, 0]);
  addPart(group, "ShotgunChestRightPanel", chestSidePanelGeometry, chestPanelMaterial, [0.985, 0.38, 0]);
  addPart(group, "ShotgunChestFrontTrim", chestTrimFrontGeometry, chestTrimMaterial, [0, 0.72, 0.59]);
  addPart(group, "ShotgunChestBackTrim", chestTrimFrontGeometry, chestTrimMaterial, [0, 0.72, -0.59]);
  addPart(group, "ShotgunChestBandLeft", chestBandBodyGeometry, chestDarkMetalMaterial, [-0.58, 0.39, 0]);
  addPart(group, "ShotgunChestBandRight", chestBandBodyGeometry, chestDarkMetalMaterial, [0.58, 0.39, 0]);
  addPart(group, "ShotgunChestFootFrontLeft", chestFootGeometry, chestDarkMetalMaterial, [-0.72, 0.06, 0.42]);
  addPart(group, "ShotgunChestFootFrontRight", chestFootGeometry, chestDarkMetalMaterial, [0.72, 0.06, 0.42]);
  addPart(group, "ShotgunChestFootBackLeft", chestFootGeometry, chestDarkMetalMaterial, [-0.72, 0.06, -0.42]);
  addPart(group, "ShotgunChestFootBackRight", chestFootGeometry, chestDarkMetalMaterial, [0.72, 0.06, -0.42]);

  lidPivot.position.set(0, 0.72, -0.56);
  addPart(lidPivot, "ShotgunChestLidCore", chestLidCoreGeometry, chestLidMaterial, [0, 0.08, 0.56]);
  addPart(lidPivot, "ShotgunChestLidTop", chestLidTopGeometry, chestLidMaterial, [0, 0.31, 0.56]);
  addPart(lidPivot, "ShotgunChestLidBackSlope", chestLidSlopeGeometry, chestLidMaterial, [0, 0.22, 0.27], [0.55, 0, 0]);
  addPart(lidPivot, "ShotgunChestLidFrontSlope", chestLidSlopeGeometry, chestLidMaterial, [0, 0.22, 0.85], [-0.55, 0, 0]);
  addPart(lidPivot, "ShotgunChestLidBandLeft", chestBandLidGeometry, chestDarkMetalMaterial, [-0.58, 0.21, 0.56]);
  addPart(lidPivot, "ShotgunChestLidBandRight", chestBandLidGeometry, chestDarkMetalMaterial, [0.58, 0.21, 0.56]);
  addPart(lidPivot, "ShotgunChestLock", chestLockGeometry, chestLockMaterial, [0, -0.05, 1.12]);
  addPart(lidPivot, "ShotgunChestLockInset", chestLockInsetGeometry, chestDarkMetalMaterial, [0, -0.04, 1.178]);
  group.add(lidPivot);

  group.position.copy(placement.position);
  group.rotation.y = yawFromDirection(placement.facing);
  group.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = false;
      node.receiveShadow = false;
      node.frustumCulled = true;
    }
  });

  return {
    group,
    lidPivot,
    facing: placement.facing.clone(),
    opened: false,
    dropRequested: false,
  };
}

function findShotgunChestPlacement(activeTiles) {
  const candidates = [];
  const blockedTiles = createShotgunChestBlockedTiles();
  const wallOptions = [
    { wall: { x: 0, z: -1 }, facing: new THREE.Vector3(0, 0, 1) },
    { wall: { x: 1, z: 0 }, facing: new THREE.Vector3(-1, 0, 0) },
    { wall: { x: 0, z: 1 }, facing: new THREE.Vector3(0, 0, -1) },
    { wall: { x: -1, z: 0 }, facing: new THREE.Vector3(1, 0, 0) },
  ];
  const playerTile = {
    x: Math.floor(mapEditorState.appliedPlayerPosition.x),
    z: Math.floor(mapEditorState.appliedPlayerPosition.z),
  };

  for (const key of activeTiles) {
    const tile = parseTileKey(key);
    if (blockedTiles.has(key)) {
      continue;
    }

    for (const option of wallOptions) {
      const wallKey = tileKey(tile.x + option.wall.x, tile.z + option.wall.z);
      if (activeTiles.has(wallKey)) {
        continue;
      }

      const frontTile = {
        x: tile.x + Math.sign(option.facing.x),
        z: tile.z + Math.sign(option.facing.z),
      };
      const frontKey = tileKey(frontTile.x, frontTile.z);
      const hasFrontSpace = activeTiles.has(frontKey);
      if (hasFrontSpace && blockedTiles.has(frontKey)) {
        continue;
      }

      const playerDistance = Math.abs(tile.x - playerTile.x) + Math.abs(tile.z - playerTile.z);
      const score = (hasFrontSpace ? 100 : 0) + playerDistance;
      const worldCenter = mapTileCenterToWorld(tile);
      const position = lootChestPosition.set(worldCenter.x, 0, worldCenter.z)
        .addScaledVector(option.facing, -platformTileSize * 0.3)
        .clone();
      candidates.push({
        position,
        facing: option.facing.clone(),
        score,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] || null;
}

function createShotgunChestBlockedTiles() {
  const blockedTiles = new Set();
  for (const enemy of mapEditorState.appliedEnemies) {
    blockedTiles.add(tileKeyFromMapPoint(enemy));
  }

  if (mapEditorState.appliedPlayerPosition) {
    blockedTiles.add(tileKeyFromMapPoint(mapEditorState.appliedPlayerPosition));
  }

  return blockedTiles;
}

function fitWeaponPickupModel(model, targetSize) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z, 0.001);
  model.scale.multiplyScalar(targetSize / maxSize);
  model.rotation.set(0, 0, THREE.MathUtils.degToRad(-16));

  const fittedBox = new THREE.Box3().setFromObject(model);
  const center = fittedBox.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= fittedBox.min.y;
}

function getPlayerMovementVector() {
  playerMoveVector.set(0, 0, 0);
  getPlayerAimDirection(playerForwardVector);

  playerRightVector.crossVectors(camera.up, playerForwardVector).normalize();

  if (playerControlState.pressedKeys.has("w")) {
    playerMoveVector.add(playerForwardVector);
  }

  if (playerControlState.pressedKeys.has("s")) {
    playerMoveVector.sub(playerForwardVector);
  }

  if (playerControlState.pressedKeys.has("a")) {
    playerMoveVector.add(playerRightVector);
  }

  if (playerControlState.pressedKeys.has("d")) {
    playerMoveVector.sub(playerRightVector);
  }

  const virtualMoveState = playerControlState.virtualMove;
  if (virtualMoveState.active && virtualMoveState.magnitude > 0) {
    playerMoveVector.addScaledVector(playerForwardVector, -virtualMoveState.y);
    playerMoveVector.addScaledVector(playerRightVector, -virtualMoveState.x);
  }

  return playerMoveVector;
}

function moveCharacterWithCollision(displacement) {
  const nextX = characterModel.position.x + displacement.x;
  const nextZ = characterModel.position.z + displacement.z;

  if (canCharacterOccupyWorldPosition(nextX, nextZ)) {
    characterModel.position.x = nextX;
    characterModel.position.z = nextZ;
    return;
  }

  if (canCharacterOccupyWorldPosition(nextX, characterModel.position.z)) {
    characterModel.position.x = nextX;
  }

  if (canCharacterOccupyWorldPosition(characterModel.position.x, nextZ)) {
    characterModel.position.z = nextZ;
  }
}

function canCharacterOccupyWorldPosition(x, z) {
  const radius = playerCollisionRadius + playerWallCollisionPadding;
  const diagonal = radius * 0.7071;
  const sampleOffsets = [
    [0, 0],
    [radius, 0],
    [-radius, 0],
    [0, radius],
    [0, -radius],
    [diagonal, diagonal],
    [-diagonal, diagonal],
    [diagonal, -diagonal],
    [-diagonal, -diagonal],
  ];

  for (const [offsetX, offsetZ] of sampleOffsets) {
    if (!isWorldPointOnAppliedTile(x + offsetX, z + offsetZ)) {
      return false;
    }
  }

  return true;
}

function isWorldPointOnAppliedTile(x, z) {
  if (!mapEditorState.appliedTiles.size) {
    return false;
  }

  const point = worldToMapPoint({ x, z });
  const tileX = Math.floor(point.x);
  const tileZ = Math.floor(point.z);

  if (tileX < 0 || tileZ < 0 || tileX >= mapSize || tileZ >= mapSize) {
    return false;
  }

  return mapEditorState.appliedTiles.has(tileKey(tileX, tileZ));
}

function syncMapPlayerPositionFromCharacter() {
  const nextPosition = worldToMapPoint(characterModel.position);
  const previousPosition = mapEditorState.playerPosition;
  if (
    Math.abs(previousPosition.x - nextPosition.x) < 0.001 &&
    Math.abs(previousPosition.z - nextPosition.z) < 0.001
  ) {
    return;
  }

  mapEditorState.playerPosition = nextPosition;
  mapEditorState.appliedPlayerPosition = { ...nextPosition };
  mapEditorState.playerDirection = directionFromYaw(playerControlState.yawRadians);
  mapEditorState.appliedPlayerDirection = mapEditorState.playerDirection;
  scheduleMapEditorRuntimeSync();
}

function scheduleMapEditorRuntimeSync() {
  if (performanceProfile.mapEditorSyncInterval <= 0) {
    renderMapEditor();
    updateMapEditorControls();
    return;
  }

  mapEditorSyncPending = true;
}

function updateDeferredMapEditorSync(delta) {
  if (!mapEditorSyncPending) {
    return;
  }

  mapEditorSyncTimer += delta;
  if (mapEditorSyncTimer < performanceProfile.mapEditorSyncInterval) {
    return;
  }

  mapEditorSyncTimer = 0;
  mapEditorSyncPending = false;
  renderMapEditor();
  updateMapEditorControls();
}

function applyPlayerYaw() {
  if (characterModel) {
    characterModel.rotation.y = yawFromDirection(getPlayerAimDirection(playerForwardVector));
  }
}

function getPlayerAimDirection(target) {
  camera.getWorldDirection(target);
  target.y = 0;

  if (target.lengthSq() <= 0.0001) {
    target.set(
      Math.sin(playerControlState.yawRadians),
      0,
      Math.cos(playerControlState.yawRadians),
    );
  }

  return target.normalize();
}

function yawFromDirection(direction) {
  return Math.atan2(direction.x, direction.z);
}

function updatePlayerAnimation(isMoving, isRunning, isShooting, isAiming) {
  if (!mixer) {
    return;
  }

  if (manualMovementPreviewId) {
    if (activeMovementId !== manualMovementPreviewId) {
      playMovement(manualMovementPreviewId);
    }
    return;
  }

  const motion = getActiveWeaponAnimationMotion();
  let movementId = defaultMovementId;
  if (isMoving && isShooting && isRunning) {
    movementId = motion.runningShooting;
  } else if (isMoving && isShooting) {
    movementId = motion.walkingShooting;
  } else if (isMoving && isAiming && isRunning) {
    movementId = motion.runningAiming;
  } else if (isMoving && isAiming) {
    movementId = motion.walkingAiming;
  } else if (isMoving && isRunning) {
    movementId = motion.running;
  } else if (isMoving) {
    movementId = motion.walking;
  } else if (isShooting) {
    movementId = motion.shooting;
  } else if (isAiming || motion.holdWhenIdle) {
    movementId = motion.aiming;
  }

  playMovement(movementId);
}

function setManualMovementPreview(clipName) {
  manualMovementPreviewId = clipName;
  playMovement(clipName, { restart: true });
}

function clearManualMovementPreview() {
  manualMovementPreviewId = null;
}

function getActiveWeaponAnimationMotion() {
  if (activeWeapon?.holdStyle === "twoHand") {
    return {
      walking: "Walking_A",
      running: "Running_HoldingRifle",
      walkingAiming: "Combo_Walking_A_Ranged_2H_Aiming",
      runningAiming: "Combo_Running_B_Ranged_2H_Aiming",
      walkingShooting: "Combo_Walking_A_Ranged_2H_Shooting",
      runningShooting: "Combo_Running_B_Ranged_2H_Shooting",
      aiming: "Ranged_2H_Aiming",
      shooting: "Ranged_2H_Shooting",
      holdWhenIdle: false,
    };
  }

  return {
    walking: "Walking_A",
    running: "Running_B",
    walkingAiming: "Combo_Walking_A_Ranged_1H_Aiming",
    runningAiming: "Combo_Running_B_Ranged_1H_Aiming",
    walkingShooting: "Combo_Walking_A_Ranged_1H_Shooting",
    runningShooting: "Combo_Running_B_Ranged_1H_Shooting",
    aiming: "Ranged_1H_Aiming",
    shooting: "Ranged_1H_Shooting",
    holdWhenIdle: false,
  };
}

function updateCameraAnchorFromCharacter() {
  if (!characterModel) {
    return;
  }

  cameraControlState.anchorTarget.set(
    characterModel.position.x,
    2.34,
    characterModel.position.z,
  );
}

function updatePlayerCameraFade() {
  if (!characterModel) {
    return;
  }

  const targetOpacity = getPlayerCameraTargetOpacity();
  if (targetOpacity === playerCameraOpacity) {
    return;
  }

  playerCameraOpacity = targetOpacity;
  applyPlayerCameraOpacity(playerCameraOpacity);
}

function getPlayerCameraTargetOpacity() {
  if (cameraControlState.freeCamera || isGameplayCameraIntroActive() || isGameplayCameraOutroActive()) {
    return 1;
  }

  const cameraDistance = camera.position.distanceTo(cameraControlState.anchorTarget);
  const collisionRatio = Number.isFinite(cameraControlState.collisionRatio)
    ? cameraControlState.collisionRatio
    : 1;
  const shouldHidePlayer = cameraDistance <= playerCameraFadeStartDistance
    || collisionRatio <= playerCameraFadeStartCollisionRatio;

  return shouldHidePlayer ? 0 : 1;
}

function applyPlayerCameraOpacity(opacity) {
  const clampedOpacity = THREE.MathUtils.clamp(opacity, 0, 1);
  const isHidden = clampedOpacity <= 0;

  characterModel.traverse((node) => {
    if (!node.isMesh || !node.material) {
      return;
    }

    node.visible = !isHidden;

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (!material) {
        continue;
      }

      const original = getPlayerFadeMaterialState(material);
      const isFaded = clampedOpacity < 0.999;
      material.transparent = original.transparent || isFaded;
      material.opacity = original.opacity * clampedOpacity;
      material.depthWrite = isFaded ? false : original.depthWrite;
      material.needsUpdate = true;
    }
  });
}

function getPlayerFadeMaterialState(material) {
  if (!playerFadeMaterialState.has(material)) {
    playerFadeMaterialState.set(material, {
      opacity: Number.isFinite(material.opacity) ? material.opacity : 1,
      transparent: Boolean(material.transparent),
      depthWrite: material.depthWrite !== false,
    });
  }

  return playerFadeMaterialState.get(material);
}

function updateFreeCamera(delta) {
  const movement = new THREE.Vector3();
  const forward = getCameraForwardVector();
  const right = new THREE.Vector3().crossVectors(camera.up, forward).normalize();

  if (cameraControlState.pressedKeys.has("w")) {
    movement.y += 1;
  }

  if (cameraControlState.pressedKeys.has("s")) {
    movement.y -= 1;
  }

  if (cameraControlState.pressedKeys.has("a")) {
    movement.addScaledVector(right, -1);
  }

  if (cameraControlState.pressedKeys.has("d")) {
    movement.add(right);
  }

  if (movement.lengthSq() > 0) {
    movement.normalize().multiplyScalar(freeCameraMoveSpeed * delta);
    moveFreeCamera(movement);
  }

  controls.update(delta);
}

function moveFreeCamera(movement) {
  camera.position.add(movement);
  controls.target.add(movement);
}

function getCameraForwardVector() {
  return camera.getWorldDirection(new THREE.Vector3()).normalize();
}

function syncCameraControlUI() {
  freeCameraInput.checked = cameraControlState.freeCamera;
  freeCameraValue.textContent = cameraControlState.freeCamera ? "Sim" : "Nao";
  cameraStatus.textContent = cameraControlState.freeCamera ? "Livre" : "Ancorada";
  cameraSideLeftInput.checked = cameraControlState.side === "left";
  cameraSideLeftValue.textContent = cameraControlState.side === "left" ? "Sim" : "Nao";

  cameraOrbitInput.value = Math.round(cameraControlState.orbitDegrees);
  cameraOrbitInput.disabled = cameraControlState.freeCamera;
  cameraOrbitValue.textContent = `${Math.round(cameraControlState.orbitDegrees)}`;
  cameraOffsetXInput.value = cameraControlState.offset.x.toFixed(1);
  cameraOffsetYInput.value = cameraControlState.offset.y.toFixed(1);
  cameraOffsetZInput.value = cameraControlState.offset.z.toFixed(1);
  cameraOffsetXValue.textContent = cameraControlState.offset.x.toFixed(1);
  cameraOffsetYValue.textContent = cameraControlState.offset.y.toFixed(1);
  cameraOffsetZValue.textContent = cameraControlState.offset.z.toFixed(1);
}

async function copyCameraInfo() {
  const forward = getCameraForwardVector();
  const text = JSON.stringify(
    {
      mode: cameraControlState.freeCamera ? "free" : "anchored",
      anchoredTo: characterModel ? "HUNK" : "platform",
      side: cameraControlState.side,
      anchor: vectorToPlainObject(cameraControlState.anchorTarget),
      orbitDegrees: Number(cameraControlState.orbitDegrees.toFixed(3)),
      aimPitchDegrees: Number(THREE.MathUtils.radToDeg(playerControlState.pitchRadians).toFixed(3)),
      distance: Number(cameraControlState.anchorDistance.toFixed(3)),
      preset: {
        cameraOffset: vectorToPlainObject(transformAnchoredCameraOffset(anchoredCameraPreset.cameraOffset)),
        targetOffset: vectorToPlainObject(transformAnchoredCameraOffset(anchoredCameraPreset.targetOffset)),
      },
      offset: {
        x: Number(cameraControlState.offset.x.toFixed(3)),
        y: Number(cameraControlState.offset.y.toFixed(3)),
        z: Number(cameraControlState.offset.z.toFixed(3)),
      },
      cameraPosition: vectorToPlainObject(camera.position),
      controlsTarget: vectorToPlainObject(controls.target),
      forward: vectorToPlainObject(forward),
      rotation: {
        x: Number(camera.rotation.x.toFixed(6)),
        y: Number(camera.rotation.y.toFixed(6)),
        z: Number(camera.rotation.z.toFixed(6)),
        order: camera.rotation.order,
      },
      fov: camera.fov,
      near: camera.near,
      far: Number(camera.far.toFixed(3)),
    },
    null,
    2,
  );

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    copyTextFallback(text);
  }

  cameraStatus.textContent = "Copiada";
  window.setTimeout(() => syncCameraControlUI(), 900);
}

function vectorToPlainObject(vector) {
  return {
    x: Number(vector.x.toFixed(3)),
    y: Number(vector.y.toFixed(3)),
    z: Number(vector.z.toFixed(3)),
  };
}

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function normalizeRadians(value) {
  const fullTurn = Math.PI * 2;
  return ((value % fullTurn) + fullTurn) % fullTurn;
}

function isTypingTarget(target) {
  return ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target?.tagName);
}

function createInitialMapEditorState() {
  const floors = createDefaultMapFloors();
  const floor = floors[0] || createBlankMapFloorConfig();
  const activeTiles = normalizeMapConfigTiles(floor.tiles);
  const playerPosition = createDefaultMapPlayerPosition(activeTiles, floor.playerPosition);
  const playerDirection = normalizeMapDirection(floor.playerDirection);
  const enemies = createDefaultMapEnemies(activeTiles, floor.enemies);
  const materials = createDefaultMapMaterials(floor.materials);
  const appliedShowTileEdges = false;
  const appliedIsCovered = true;

  return {
    floors,
    activeFloorIndex: 0,
    activeTiles,
    appliedTiles: cloneTileSet(activeTiles),
    playerPosition,
    appliedPlayerPosition: { ...playerPosition },
    playerDirection,
    appliedPlayerDirection: playerDirection,
    enemies,
    appliedEnemies: cloneMapEnemies(enemies),
    materials,
    appliedMaterials: { ...materials },
    activeTool: "tile",
    pendingDirection: null,
    hoverTile: null,
    zoom: 1,
    baseCanvasSize: 256,
    interactionMode: null,
    pointerId: null,
    showTileEdges: appliedShowTileEdges,
    appliedShowTileEdges,
    isCovered: appliedIsCovered,
    appliedIsCovered,
    dirty: false,
    persisting: false,
    feedbackMessage: null,
    feedbackIsError: false,
  };
}

function createDefaultMapFloors() {
  const sourceFloors = Array.isArray(defaultMapConfig.floors) && defaultMapConfig.floors.length > 0
    ? defaultMapConfig.floors
    : [defaultMapConfig];
  const floors = sourceFloors
    .map((floor) => normalizeMapFloorConfig(floor))
    .filter(Boolean);

  return floors.length ? floors : [createDefaultMapFloorConfig()];
}

function normalizeMapFloorConfig(source = {}) {
  const activeTiles = normalizeMapConfigTiles(source.tiles);
  if (activeTiles.size === 0) {
    return null;
  }

  const playerPosition = createDefaultMapPlayerPosition(activeTiles, source.playerPosition);
  const playerDirection = normalizeMapDirection(source.playerDirection);
  const enemies = createDefaultMapEnemies(activeTiles, source.enemies);
  const materials = createDefaultMapMaterials(source.materials);

  return {
    tiles: tileSetToSortedArray(activeTiles),
    playerPosition,
    playerDirection,
    enemies,
    materials,
    showTileEdges: false,
    isCovered: true,
  };
}

function createDefaultMapFloorConfig() {
  const activeTiles = createDefaultMapTiles();
  return {
    tiles: tileSetToSortedArray(activeTiles),
    playerPosition: createDefaultMapPlayerPosition(activeTiles, defaultMapConfig.playerPosition),
    playerDirection: normalizeMapDirection(defaultMapConfig.playerDirection),
    enemies: createDefaultMapEnemies(activeTiles, defaultMapConfig.enemies),
    materials: createDefaultMapMaterials(defaultMapConfig.materials),
    showTileEdges: false,
    isCovered: true,
  };
}

function createBlankMapFloorConfig() {
  return {
    tiles: [],
    playerPosition: { x: mapCenter, z: mapCenter },
    playerDirection: defaultMapDirection,
    enemies: [],
    materials: createDefaultMapMaterials(),
    showTileEdges: false,
    isCovered: true,
  };
}

function createDefaultMapTiles() {
  const configuredTiles = normalizeMapConfigTiles(defaultMapConfig.tiles);
  if (configuredTiles.size > 0) {
    return configuredTiles;
  }

  const left = mapCenter - 1;
  const right = mapCenter;
  return new Set([
    tileKey(left, left),
    tileKey(right, left),
    tileKey(left, right),
    tileKey(right, right),
  ]);
}

function normalizeMapConfigTiles(tiles) {
  const normalized = new Set();
  if (!Array.isArray(tiles)) {
    return normalized;
  }

  for (const tile of tiles) {
    const source = Array.isArray(tile) ? { x: tile[0], z: tile[1] } : tile;
    const x = Number(source?.x);
    const z = Number(source?.z);

    if (Number.isInteger(x) && Number.isInteger(z) && x >= 0 && z >= 0 && x < mapSize && z < mapSize) {
      normalized.add(tileKey(x, z));
    }
  }

  return normalized;
}

function createDefaultMapPlayerPosition(activeTiles, configuredPosition = defaultMapConfig.playerPosition || {}) {
  const position = {
    x: Number(configuredPosition.x),
    z: Number(configuredPosition.z),
  };

  if (
    Number.isFinite(position.x) &&
    Number.isFinite(position.z) &&
    isMapPointInsideTiles(position, activeTiles)
  ) {
    return {
      x: THREE.MathUtils.clamp(position.x, 0, mapSize),
      z: THREE.MathUtils.clamp(position.z, 0, mapSize),
    };
  }

  const [firstTileKey] = activeTiles;
  if (firstTileKey) {
    const tile = parseTileKey(firstTileKey);
    return {
      x: tile.x + 0.5,
      z: tile.z + 0.5,
    };
  }

  return { x: mapCenter, z: mapCenter };
}

function createDefaultMapEnemies(activeTiles, enemies = defaultMapConfig.enemies) {
  if (!Array.isArray(enemies)) {
    return [];
  }

  return enemies
    .map((enemy) => normalizeMapEnemy(enemy, activeTiles))
    .filter(Boolean);
}

function createDefaultMapMaterials(configuredMaterials = defaultMapConfig.materials || {}) {
  return {
    floor: normalizeMapMaterialId("floor", configuredMaterials.floor),
    wall: normalizeMapMaterialId("wall", configuredMaterials.wall),
    ceiling: normalizeMapMaterialId("ceiling", configuredMaterials.ceiling),
  };
}

function normalizeMapEnemy(enemy, activeTiles = mapEditorState?.activeTiles) {
  const position = Array.isArray(enemy) ? { x: enemy[0], z: enemy[1] } : enemy;
  const x = Number(position?.x);
  const z = Number(position?.z);

  if (!Number.isFinite(x) || !Number.isFinite(z)) {
    return null;
  }

  const normalizedPosition = {
    x: roundMapCoordinate(THREE.MathUtils.clamp(x, 0, mapSize)),
    z: roundMapCoordinate(THREE.MathUtils.clamp(z, 0, mapSize)),
  };

  if (activeTiles && !isMapPointInsideTiles(normalizedPosition, activeTiles)) {
    return null;
  }

  return {
    x: normalizedPosition.x,
    z: normalizedPosition.z,
    direction: normalizeMapDirection(position?.direction),
    type: normalizeMapEnemyType(position?.type),
  };
}

function normalizeMapEnemyType(value) {
  return value === "boss" ? "boss" : "skeleton";
}

function normalizeMapMaterialId(surface, value) {
  return sewerMaterialIdsBySurface[surface]?.has(value) ? value : defaultMapMaterials[surface];
}

function normalizeMapDirection(value) {
  return mapDirectionOptions.some((direction) => direction.id === value) ? value : defaultMapDirection;
}

function cloneTileSet(source) {
  return new Set(source);
}

function cloneMapEnemies(enemies) {
  return enemies.map((enemy) => ({ ...enemy }));
}

function tileSetToSortedArray(tiles) {
  return [...tiles]
    .map((key) => {
      const tile = parseTileKey(key);
      return [tile.x, tile.z];
    })
    .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

function createAppliedMapSnapshot() {
  return {
    activeTiles: cloneTileSet(mapEditorState.appliedTiles),
    playerPosition: { ...mapEditorState.appliedPlayerPosition },
    playerDirection: mapEditorState.appliedPlayerDirection,
    enemies: cloneMapEnemies(mapEditorState.appliedEnemies),
    materials: { ...mapEditorState.appliedMaterials },
    showTileEdges: mapEditorState.appliedShowTileEdges,
    isCovered: mapEditorState.appliedIsCovered,
  };
}

function createMapFloorConfigFromEditor({ applied = false } = {}) {
  const tiles = applied ? mapEditorState.appliedTiles : mapEditorState.activeTiles;
  const playerPosition = applied ? mapEditorState.appliedPlayerPosition : mapEditorState.playerPosition;
  const playerDirection = applied ? mapEditorState.appliedPlayerDirection : mapEditorState.playerDirection;
  const enemies = applied ? mapEditorState.appliedEnemies : mapEditorState.enemies;
  const materials = applied ? mapEditorState.appliedMaterials : mapEditorState.materials;

  return {
    tiles: tileSetToSortedArray(tiles),
    playerPosition: {
      x: roundMapCoordinate(playerPosition.x),
      z: roundMapCoordinate(playerPosition.z),
    },
    playerDirection: normalizeMapDirection(playerDirection),
    enemies: cloneMapEnemies(enemies)
      .sort((a, b) => a.z - b.z || a.x - b.x || enemyTypeSortValue(a.type) - enemyTypeSortValue(b.type))
      .map((enemy) => ({
        x: roundMapCoordinate(enemy.x),
        z: roundMapCoordinate(enemy.z),
        direction: normalizeMapDirection(enemy.direction),
        type: normalizeMapEnemyType(enemy.type),
      })),
    materials: { ...materials },
    showTileEdges: false,
    isCovered: true,
  };
}

function enemyTypeSortValue(type) {
  return normalizeMapEnemyType(type) === "boss" ? 1 : 0;
}

function loadMapFloorIntoEditor(floor, floorIndex) {
  const activeTiles = normalizeMapConfigTiles(floor.tiles);
  mapEditorState.activeFloorIndex = floorIndex;
  mapEditorState.activeTiles = activeTiles;
  mapEditorState.appliedTiles = cloneTileSet(activeTiles);
  mapEditorState.playerPosition = createDefaultMapPlayerPosition(activeTiles, floor.playerPosition);
  mapEditorState.appliedPlayerPosition = { ...mapEditorState.playerPosition };
  mapEditorState.playerDirection = normalizeMapDirection(floor.playerDirection);
  mapEditorState.appliedPlayerDirection = mapEditorState.playerDirection;
  mapEditorState.enemies = createDefaultMapEnemies(activeTiles, floor.enemies);
  mapEditorState.appliedEnemies = cloneMapEnemies(mapEditorState.enemies);
  mapEditorState.materials = createDefaultMapMaterials(floor.materials);
  mapEditorState.appliedMaterials = { ...mapEditorState.materials };
  mapEditorState.showTileEdges = false;
  mapEditorState.appliedShowTileEdges = false;
  mapEditorState.isCovered = true;
  mapEditorState.appliedIsCovered = true;
  mapEditorState.pendingDirection = null;
  mapEditorState.hoverTile = null;
  mapEditorState.interactionMode = null;
  mapEditorState.pointerId = null;
  mapEditorState.dirty = false;
  mapEditorState.feedbackMessage = null;
  mapEditorState.feedbackIsError = false;
  mapCanvas?.classList.remove("is-picking-direction", "is-dragging-player");

  rebuildPlatformFromAppliedMap();
  positionCharacterOnMap(mapEditorState.appliedPlayerPosition, mapEditorState.appliedPlayerDirection);
  renderAppliedEnemies();
  setupFloorLootChest();
  frameScene();
  updateMapHud();
  renderMapEditor();
  updateMapEditorControls();
}

function beginNewMapFloor() {
  const blankFloor = createBlankMapFloorConfig();
  mapEditorState.activeFloorIndex = mapEditorState.floors.length;
  loadMapFloorIntoEditor(blankFloor, mapEditorState.activeFloorIndex);
  mapEditorState.feedbackMessage = "Novo andar";
  updateMapEditorControls();
}

function setMapBuildOption(option, value) {
  if (mapEditorState[option] === value) {
    return;
  }

  mapEditorState[option] = value;
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function markMapDirty() {
  mapEditorState.dirty = true;
  mapEditorState.feedbackMessage = null;
  mapEditorState.feedbackIsError = false;
}

function populateMapMaterialControls() {
  for (const [surface, control] of Object.entries(materialControls)) {
    if (!control.select) {
      continue;
    }

    control.select.replaceChildren();
    for (const variant of getSewerSurfaceOptions(surface)) {
      const option = document.createElement("option");
      option.value = variant.id;
      option.textContent = variant.label;
      control.select.append(option);
    }
  }

  syncMapMaterialControls();
}

function setMapActiveTool(tool) {
  if (!mapTools.has(tool) || mapEditorState.activeTool === tool) {
    return;
  }

  mapEditorState.activeTool = tool;
  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  syncMapToolControls();
  renderMapEditor();
}

function setMapMaterial(surface, materialId) {
  const nextMaterialId = normalizeMapMaterialId(surface, materialId);
  if (mapEditorState.materials[surface] === nextMaterialId) {
    syncMapMaterialControls();
    return;
  }

  mapEditorState.materials[surface] = nextMaterialId;
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function clearMapEditor() {
  mapEditorState.activeTiles = new Set();
  mapEditorState.enemies = [];
  mapEditorState.playerPosition = { x: mapCenter, z: mapCenter };
  mapEditorState.playerDirection = defaultMapDirection;
  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function generateMapEditorLayout() {
  const generatedFloor = createGeneratedMapFloor();
  mapEditorState.activeTiles = normalizeMapConfigTiles(generatedFloor.tiles);
  mapEditorState.playerPosition = { ...generatedFloor.playerPosition };
  mapEditorState.playerDirection = generatedFloor.playerDirection;
  mapEditorState.enemies = [];
  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  markMapDirty();
  mapEditorState.feedbackMessage = "Mapa gerado";
  renderMapEditor();
  updateMapEditorControls();
}

function createGeneratedMapFloor() {
  const activeTiles = new Set();
  const horizontal = Math.random() < 0.5;
  const reverse = Math.random() < 0.5;
  const bands = createGeneratedBands();

  if (horizontal) {
    carveGeneratedHorizontalSnake(activeTiles, bands, reverse);
  } else {
    carveGeneratedVerticalSnake(activeTiles, bands, reverse);
  }

  const startBand = bands[0];
  const startPoint = getGeneratedSnakeEndpoint(startBand, horizontal, reverse, true);
  const nextPoint = getGeneratedSnakeEndpoint(startBand, horizontal, reverse, false);
  const playerPosition = {
    x: startPoint.x,
    z: startPoint.z,
  };

  return {
    tiles: tileSetToSortedArray(activeTiles),
    playerPosition,
    playerDirection: directionFromMapPoints(
      playerPosition,
      nextPoint,
      defaultMapDirection,
    ),
    enemies: [],
    materials: { ...mapEditorState.materials },
    showTileEdges: false,
    isCovered: true,
  };
}

function createGeneratedBands() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const bands = [];
    let cursor = 0;

    while (cursor <= mapSize - 2) {
      const remaining = mapSize - cursor;
      let width = Math.random() < 0.92 ? 3 : 2;
      if (remaining < width) {
        width = remaining >= 2 ? remaining : 0;
      }

      if (width < 2) {
        break;
      }

      bands.push({ start: cursor, width });
      cursor += width + 1;
    }

    if (bands.length >= 4 && getGeneratedBandCoverage(bands) >= 11) {
      return bands;
    }
  }

  return [
    { start: 0, width: 3 },
    { start: 4, width: 3 },
    { start: 8, width: 3 },
    { start: 12, width: 3 },
  ];
}

function getGeneratedBandCoverage(bands) {
  return bands.reduce((total, band) => total + band.width, 0);
}

function carveGeneratedHorizontalSnake(activeTiles, bands, reverse) {
  for (let index = 0; index < bands.length; index += 1) {
    const band = bands[index];
    carveGeneratedTileBlock(activeTiles, 0, band.start, mapSize, band.width);

    if (index < bands.length - 1) {
      const atRight = reverse ? index % 2 === 1 : index % 2 === 0;
      const connectorX = atRight ? mapSize - 2 : 0;
      const nextBand = bands[index + 1];
      carveGeneratedTileBlock(
        activeTiles,
        connectorX,
        band.start,
        2,
        nextBand.start + nextBand.width - band.start,
      );

      if (Math.random() < 0.82) {
        carveGeneratedTurnRoom(activeTiles, connectorX, band.start, 2, nextBand.start + nextBand.width - band.start);
      }
    }
  }
}

function carveGeneratedVerticalSnake(activeTiles, bands, reverse) {
  for (let index = 0; index < bands.length; index += 1) {
    const band = bands[index];
    carveGeneratedTileBlock(activeTiles, band.start, 0, band.width, mapSize);

    if (index < bands.length - 1) {
      const atBottom = reverse ? index % 2 === 1 : index % 2 === 0;
      const connectorZ = atBottom ? mapSize - 2 : 0;
      const nextBand = bands[index + 1];
      carveGeneratedTileBlock(
        activeTiles,
        band.start,
        connectorZ,
        nextBand.start + nextBand.width - band.start,
        2,
      );

      if (Math.random() < 0.82) {
        carveGeneratedTurnRoom(activeTiles, band.start, connectorZ, nextBand.start + nextBand.width - band.start, 2);
      }
    }
  }
}

function carveGeneratedTurnRoom(activeTiles, x, z, width, depth) {
  const roomX = THREE.MathUtils.clamp(x + Math.floor(width / 2) - 2, 0, mapSize - 4);
  const roomZ = THREE.MathUtils.clamp(z + Math.floor(depth / 2) - 2, 0, mapSize - 4);
  carveGeneratedTileBlock(activeTiles, roomX, roomZ, 4, 4);
}

function getGeneratedSnakeEndpoint(band, horizontal, reverse, start) {
  const edgeLow = 1.5;
  const edgeHigh = mapSize - 1.5;
  const along = start
    ? (reverse ? edgeHigh : edgeLow)
    : (reverse ? edgeLow : edgeHigh);
  const cross = band.start + Math.floor(band.width / 2);

  if (horizontal) {
    return { x: along, z: cross + 0.5 };
  }

  return { x: cross + 0.5, z: along };
}

function carveGeneratedTileBlock(activeTiles, x, z, width, depth) {
  for (let tileZ = z; tileZ < z + depth; tileZ += 1) {
    for (let tileX = x; tileX < x + width; tileX += 1) {
      if (tileX >= 0 && tileZ >= 0 && tileX < mapSize && tileZ < mapSize) {
        activeTiles.add(tileKey(tileX, tileZ));
      }
    }
  }
}

async function saveCurrentMapFloor() {
  if (!isMapPlayerPlacementValid()) {
    updateMapEditorControls();
    return;
  }

  const floor = createMapFloorConfigFromEditor();
  const nextIndex = Math.min(mapEditorState.activeFloorIndex, mapEditorState.floors.length);
  if (nextIndex === mapEditorState.floors.length) {
    mapEditorState.floors.push(floor);
  } else {
    mapEditorState.floors[nextIndex] = floor;
  }

  mapEditorState.activeFloorIndex = nextIndex;
  mapEditorState.feedbackMessage = `Andar ${nextIndex + 1} salvo`;
  mapEditorState.feedbackIsError = false;
  mapEditorState.dirty = false;
  renderFloorStack();
  updateMapEditorControls();

  try {
    await persistAppliedMapConfig(createMapConfigPayloadFromFloors());
  } catch (error) {
    console.error("Falha ao salvar andar.", error);
    mapEditorState.feedbackMessage = "Andar salvo; codigo nao salvo";
    mapEditorState.feedbackIsError = true;
    updateMapEditorControls();
  }
}

function syncMapToolControls() {
  for (const button of mapToolButtons) {
    const isActive = button.dataset.mapTool === mapEditorState.activeTool;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function renderFloorStack() {
  if (!floorStackElement) {
    return;
  }

  floorStackElement.replaceChildren();
  const newFloorButton = document.createElement("button");
  newFloorButton.type = "button";
  newFloorButton.className = "is-new-floor";
  newFloorButton.setAttribute("aria-label", "Novo andar");
  newFloorButton.textContent = "+";
  newFloorButton.addEventListener("click", beginNewMapFloor);
  floorStackElement.append(newFloorButton);

  for (let index = 0; index < mapEditorState.floors.length; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `Andar ${index + 1}`);
    button.classList.toggle("is-active", index === mapEditorState.activeFloorIndex);
    button.addEventListener("click", () => {
      loadMapFloorIntoEditor(mapEditorState.floors[index], index);
    });
    floorStackElement.append(button);
  }
}

function syncMapMaterialControls() {
  for (const [surface, control] of Object.entries(materialControls)) {
    const materialId = normalizeMapMaterialId(surface, mapEditorState.materials[surface]);
    const variant = getSewerSurfaceVariant(surface, materialId);
    if (control.select) {
      control.select.value = materialId;
    }

    if (control.preview && variant) {
      control.preview.style.backgroundImage = `url("${variant.url}")`;
      control.preview.style.backgroundColor = `#${(variant.color ?? 0x555555).toString(16).padStart(6, "0")}`;
    }
  }
}

function showMaterialPreviewPopover(surface, anchor) {
  if (!materialPreviewPopover || !materialPreviewPopoverImage || !materialPreviewPopoverLabel) {
    return;
  }

  const variant = getSewerSurfaceVariant(surface, mapEditorState.materials[surface]);
  if (!variant) {
    return;
  }

  const rect = anchor.getBoundingClientRect();
  materialPreviewPopoverImage.style.backgroundImage = `url("${variant.url}")`;
  materialPreviewPopoverImage.style.backgroundColor = `#${(variant.color ?? 0x555555).toString(16).padStart(6, "0")}`;
  materialPreviewPopoverLabel.textContent = variant.label;
  materialPreviewPopover.style.left = `${Math.min(rect.right + 10, window.innerWidth - 148)}px`;
  materialPreviewPopover.style.top = `${Math.min(rect.top, window.innerHeight - 112)}px`;
  materialPreviewPopover.classList.add("is-visible");
  materialPreviewPopover.setAttribute("aria-hidden", "false");
}

function hideMaterialPreviewPopover() {
  if (!materialPreviewPopover) {
    return;
  }

  materialPreviewPopover.classList.remove("is-visible");
  materialPreviewPopover.setAttribute("aria-hidden", "true");
}

function resizeMapEditorCanvas() {
  const nextBaseSize = Math.max(220, Math.floor(mapViewport.clientWidth || 256));
  if (nextBaseSize !== mapEditorState.baseCanvasSize) {
    mapEditorState.baseCanvasSize = nextBaseSize;
  }

  renderMapEditor();
}

function setMapZoom(nextZoom, anchorEvent = null) {
  const previousZoom = mapEditorState.zoom;
  const zoom = THREE.MathUtils.clamp(nextZoom, mapZoomMin, mapZoomMax);
  if (Math.abs(zoom - previousZoom) < 0.001) {
    return;
  }

  const previousSize = mapEditorState.baseCanvasSize * previousZoom;
  const viewportRect = mapViewport.getBoundingClientRect();
  const anchorX = anchorEvent ? anchorEvent.clientX - viewportRect.left : viewportRect.width / 2;
  const anchorY = anchorEvent ? anchorEvent.clientY - viewportRect.top : viewportRect.height / 2;
  const ratioX = (mapViewport.scrollLeft + anchorX) / Math.max(previousSize, 1);
  const ratioY = (mapViewport.scrollTop + anchorY) / Math.max(previousSize, 1);

  mapEditorState.zoom = zoom;
  renderMapEditor();

  const nextSize = mapEditorState.baseCanvasSize * zoom;
  mapViewport.scrollLeft = ratioX * nextSize - anchorX;
  mapViewport.scrollTop = ratioY * nextSize - anchorY;
  updateMapEditorControls();
}

function handleMapWheel(event) {
  event.preventDefault();
  const direction = event.deltaY > 0 ? -1 : 1;
  setMapZoom(mapEditorState.zoom + direction * mapZoomStep, event);
}

function handleMapPointerDown(event) {
  event.preventDefault();
  const point = mapPointFromEvent(event);
  const tile = tileFromMapPoint(point);

  if (mapEditorState.pendingDirection) {
    if (event.button === 2) {
      cancelMapPendingDirection();
    } else if (event.button === 0) {
      commitMapPendingDirection(point);
    }

    return;
  }

  if (event.button === 0 && isPointerOnMapPlayer(point)) {
    mapCanvas.setPointerCapture(event.pointerId);
    mapEditorState.pointerId = event.pointerId;
    mapEditorState.interactionMode = "drag-player";
    mapCanvas.classList.add("is-dragging-player");
    moveMapPlayer(point);
    return;
  }

  if (mapEditorState.activeTool === "enemy" || mapEditorState.activeTool === "boss") {
    if (event.button === 2) {
      removeMapEnemyAtPoint(point);
    } else if (event.button === 0) {
      beginMapEnemyPlacement(tile, point);
    }

    return;
  }

  if (event.button === 2) {
    mapCanvas.setPointerCapture(event.pointerId);
    mapEditorState.pointerId = event.pointerId;
    mapEditorState.interactionMode = "erase";
    setMapTileActive(tile, false);
    return;
  }

  if (event.button !== 0) {
    return;
  }

  mapCanvas.setPointerCapture(event.pointerId);
  mapEditorState.pointerId = event.pointerId;
  mapEditorState.interactionMode = "paint";
  setMapTileActive(tile, true);
}

function handleMapPointerMove(event) {
  const point = mapPointFromEvent(event);
  const tile = tileFromMapPoint(point);
  setMapHoverTile(tile);

  if (mapEditorState.pendingDirection) {
    updateMapPendingDirection(point);
    return;
  }

  if (mapEditorState.interactionMode === "drag-player") {
    moveMapPlayer(point);
    return;
  }

  if (mapEditorState.interactionMode === "paint") {
    setMapTileActive(tile, true);
    return;
  }

  if (mapEditorState.interactionMode === "erase") {
    setMapTileActive(tile, false);
    return;
  }

  mapCanvas.style.cursor = isPointerOnMapPlayer(point) ? "grab" : cursorForMapTool();
}

function handleMapPointerLeave() {
  if (!mapEditorState.interactionMode && !mapEditorState.pendingDirection) {
    setMapHoverTile(null);
  }
}

function handleMapPointerUp(event) {
  const completedInteractionMode = mapEditorState.interactionMode;
  const point = mapPointFromEvent(event);

  if (mapEditorState.pointerId !== null && mapCanvas.hasPointerCapture(mapEditorState.pointerId)) {
    mapCanvas.releasePointerCapture(mapEditorState.pointerId);
  }

  mapEditorState.pointerId = null;
  mapEditorState.interactionMode = null;
  mapCanvas.classList.remove("is-dragging-player");
  mapCanvas.style.cursor = cursorForMapTool();

  if (completedInteractionMode === "drag-player") {
    beginMapPlayerDirectionPick(point);
  }

  updateMapEditorControls();
  renderMapEditor();
}

function mapPointFromEvent(event) {
  const rect = mapCanvas.getBoundingClientRect();
  return {
    x: THREE.MathUtils.clamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * mapSize, 0, mapSize),
    z: THREE.MathUtils.clamp(((event.clientY - rect.top) / Math.max(rect.height, 1)) * mapSize, 0, mapSize),
  };
}

function tileFromMapPoint(point) {
  return {
    x: THREE.MathUtils.clamp(Math.floor(Math.min(point.x, mapSize - 0.0001)), 0, mapSize - 1),
    z: THREE.MathUtils.clamp(Math.floor(Math.min(point.z, mapSize - 0.0001)), 0, mapSize - 1),
  };
}

function setMapHoverTile(tile) {
  const nextKey = tile ? tileKey(tile.x, tile.z) : null;
  const currentKey = mapEditorState.hoverTile ? tileKey(mapEditorState.hoverTile.x, mapEditorState.hoverTile.z) : null;
  if (nextKey === currentKey) {
    return;
  }

  mapEditorState.hoverTile = tile;
  renderMapEditor();
}

function setMapTileActive(tile, active) {
  const key = tileKey(tile.x, tile.z);
  const hasTile = mapEditorState.activeTiles.has(key);
  if (active === hasTile) {
    return;
  }

  if (active) {
    mapEditorState.activeTiles.add(key);
  } else {
    mapEditorState.activeTiles.delete(key);
    mapEditorState.enemies = mapEditorState.enemies.filter((enemy) => tileKeyFromMapPoint(enemy) !== key);
  }

  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function beginMapEnemyPlacement(tile, point) {
  const key = tileKey(tile.x, tile.z);
  if (!mapEditorState.activeTiles.has(key)) {
    return;
  }

  const position = { x: tile.x + 0.5, z: tile.z + 0.5 };
  mapEditorState.pendingDirection = {
    kind: mapEditorState.activeTool === "boss" ? "boss" : "enemy",
    position,
    direction: directionFromMapPoints(position, point, defaultMapDirection),
    mousePoint: point,
  };
  mapCanvas.classList.add("is-picking-direction");
  renderMapEditor();
  updateMapEditorControls();
}

function beginMapPlayerDirectionPick(point) {
  mapEditorState.pendingDirection = {
    kind: "player",
    position: { ...mapEditorState.playerPosition },
    direction: directionFromMapPoints(mapEditorState.playerPosition, point, mapEditorState.playerDirection),
    mousePoint: point,
  };
  mapCanvas.classList.add("is-picking-direction");
  renderMapEditor();
}

function updateMapPendingDirection(point) {
  const pending = mapEditorState.pendingDirection;
  if (!pending) {
    return;
  }

  pending.mousePoint = point;
  pending.direction = directionFromMapPoints(pending.position, point, pending.direction);
  renderMapEditor();
}

function commitMapPendingDirection(point) {
  const pending = mapEditorState.pendingDirection;
  if (!pending) {
    return;
  }

  const direction = directionFromMapPoints(pending.position, point, pending.direction);
  if (pending.kind === "player") {
    mapEditorState.playerDirection = direction;
  } else if (pending.kind === "enemy" || pending.kind === "boss") {
    if (pending.kind === "boss") {
      mapEditorState.enemies = mapEditorState.enemies.filter((enemy) => normalizeMapEnemyType(enemy.type) !== "boss");
    }
    mapEditorState.enemies.push({
      x: roundMapCoordinate(pending.position.x),
      z: roundMapCoordinate(pending.position.z),
      direction,
      type: pending.kind === "boss" ? "boss" : "skeleton",
    });
  }

  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function cancelMapPendingDirection() {
  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  renderMapEditor();
  updateMapEditorControls();
}

function removeMapEnemyAtPoint(point) {
  const enemyIndex = findMapEnemyIndexAtPoint(point);
  if (enemyIndex < 0) {
    return;
  }

  mapEditorState.enemies.splice(enemyIndex, 1);
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function findMapEnemyIndexAtPoint(point) {
  for (let index = mapEditorState.enemies.length - 1; index >= 0; index -= 1) {
    const enemy = mapEditorState.enemies[index];
    if (Math.hypot(point.x - enemy.x, point.z - enemy.z) <= 0.48) {
      return index;
    }
  }

  return -1;
}

function tileKeyFromMapPoint(point) {
  const tile = tileFromMapPoint(point);
  return tileKey(tile.x, tile.z);
}

function cursorForMapTool() {
  if (mapEditorState.pendingDirection) {
    return "alias";
  }

  if (mapEditorState.activeTool === "enemy" || mapEditorState.activeTool === "boss") {
    return "cell";
  }

  return "crosshair";
}

function moveMapPlayer(point) {
  const nextPosition = magnetizeMapPlayerPosition({
    x: THREE.MathUtils.clamp(point.x, 0, mapSize),
    z: THREE.MathUtils.clamp(point.z, 0, mapSize),
  });

  if (
    Math.abs(nextPosition.x - mapEditorState.playerPosition.x) < 0.001 &&
    Math.abs(nextPosition.z - mapEditorState.playerPosition.z) < 0.001
  ) {
    return;
  }

  mapEditorState.playerPosition = nextPosition;
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function magnetizeMapPlayerPosition(position) {
  const tile = tileFromMapPoint(position);
  const center = { x: tile.x + 0.5, z: tile.z + 0.5 };
  const distance = Math.hypot(position.x - center.x, position.z - center.z);
  if (distance <= mapPlayerMagnetRadius) {
    return center;
  }

  return position;
}

function isPointerOnMapPlayer(point) {
  return Math.hypot(point.x - mapEditorState.playerPosition.x, point.z - mapEditorState.playerPosition.z) <= 0.48;
}

function isMapPlayerPlacementValid(activeTiles = mapEditorState.activeTiles) {
  if (activeTiles.size === 0) {
    return false;
  }

  return isMapPointInsideTiles(mapEditorState.playerPosition, activeTiles);
}

function isMapPointInsideTiles(position, activeTiles) {
  for (const x of candidateMapIndices(position.x)) {
    for (const z of candidateMapIndices(position.z)) {
      if (activeTiles.has(tileKey(x, z))) {
        return true;
      }
    }
  }

  return false;
}

function directionFromMapPoints(origin, target, fallback = defaultMapDirection) {
  const dx = target.x - origin.x;
  const dz = target.z - origin.z;
  const length = Math.hypot(dx, dz);
  if (length < 0.05) {
    return normalizeMapDirection(fallback);
  }

  let bestDirection = mapDirectionOptions[0];
  let bestScore = -Infinity;
  for (const direction of mapDirectionOptions) {
    const directionLength = Math.hypot(direction.x, direction.z) || 1;
    const score = (dx / length) * (direction.x / directionLength) + (dz / length) * (direction.z / directionLength);
    if (score > bestScore) {
      bestDirection = direction;
      bestScore = score;
    }
  }

  return bestDirection.id;
}

function getMapDirectionVector(directionId) {
  return mapDirectionOptions.find((direction) => direction.id === directionId)
    || mapDirectionOptions.find((direction) => direction.id === defaultMapDirection);
}

function directionToYaw(directionId) {
  const direction = getMapDirectionVector(directionId);
  return Math.atan2(direction.x, direction.z);
}

function directionFromYaw(yawRadians) {
  const point = {
    x: Math.sin(yawRadians),
    z: Math.cos(yawRadians),
  };
  return directionFromMapPoints({ x: 0, z: 0 }, point, defaultMapDirection);
}

function candidateMapIndices(value) {
  const clamped = THREE.MathUtils.clamp(value, 0, mapSize);
  const base = Math.floor(Math.min(clamped, mapSize - 0.0001));
  const candidates = new Set([base]);
  const rounded = Math.round(clamped);
  if (Math.abs(clamped - rounded) < 0.0001) {
    candidates.add(rounded);
    candidates.add(rounded - 1);
  }

  return [...candidates].filter((index) => index >= 0 && index < mapSize);
}

function renderMapEditor() {
  if (!mapCanvas) {
    return;
  }

  const cssSize = Math.max(1, Math.round(mapEditorState.baseCanvasSize * mapEditorState.zoom));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelSize = Math.round(cssSize * pixelRatio);

  if (mapCanvas.width !== pixelSize || mapCanvas.height !== pixelSize) {
    mapCanvas.width = pixelSize;
    mapCanvas.height = pixelSize;
  }

  mapCanvas.style.width = `${cssSize}px`;
  mapCanvas.style.height = `${cssSize}px`;

  const ctx = mapCanvas.getContext("2d");
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawMapEditor(ctx, cssSize);
}

function drawMapEditor(ctx, size) {
  const cellSize = size / mapSize;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#0d0e0c";
  ctx.fillRect(0, 0, size, size);

  for (let z = 0; z < mapSize; z += 1) {
    for (let x = 0; x < mapSize; x += 1) {
      const isActive = mapEditorState.activeTiles.has(tileKey(x, z));
      const px = x * cellSize;
      const py = z * cellSize;

      ctx.fillStyle = isActive ? "#5d5a46" : (x + z) % 2 === 0 ? "#151711" : "#12140f";
      ctx.fillRect(px, py, cellSize, cellSize);

      if (!isActive) {
        ctx.fillStyle = "rgba(224, 208, 133, 0.08)";
        ctx.fillRect(px + cellSize * 0.42, py + cellSize * 0.42, cellSize * 0.16, cellSize * 0.16);
      }
    }
  }

  drawMapLines(ctx, size, cellSize);
  drawMapWallPreview(ctx, cellSize);
  drawMapEnemies(ctx, cellSize);
  drawMapHover(ctx, cellSize);
  drawMapPendingDirection(ctx, cellSize);
  drawMapPlayer(ctx, cellSize);
}

function drawMapLines(ctx, size, cellSize) {
  ctx.lineWidth = 1;
  for (let index = 0; index <= mapSize; index += 1) {
    const coordinate = Math.round(index * cellSize) + 0.5;
    ctx.strokeStyle = index === mapCenter ? "rgba(230, 208, 120, 0.72)" : "rgba(224, 208, 133, 0.18)";
    ctx.beginPath();
    ctx.moveTo(coordinate, 0);
    ctx.lineTo(coordinate, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, coordinate);
    ctx.lineTo(size, coordinate);
    ctx.stroke();
  }
}

function drawMapWallPreview(ctx, cellSize) {
  if (!mapEditorState.isCovered) {
    return;
  }

  ctx.lineWidth = Math.max(2, cellSize * 0.08);
  ctx.strokeStyle = "rgba(228, 211, 131, 0.72)";

  for (const key of mapEditorState.activeTiles) {
    const tile = parseTileKey(key);
    const x = tile.x * cellSize;
    const z = tile.z * cellSize;

    if (!mapEditorState.activeTiles.has(tileKey(tile.x, tile.z - 1))) {
      ctx.beginPath();
      ctx.moveTo(x, z);
      ctx.lineTo(x + cellSize, z);
      ctx.stroke();
    }

    if (!mapEditorState.activeTiles.has(tileKey(tile.x + 1, tile.z))) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, z);
      ctx.lineTo(x + cellSize, z + cellSize);
      ctx.stroke();
    }

    if (!mapEditorState.activeTiles.has(tileKey(tile.x, tile.z + 1))) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, z + cellSize);
      ctx.lineTo(x, z + cellSize);
      ctx.stroke();
    }

    if (!mapEditorState.activeTiles.has(tileKey(tile.x - 1, tile.z))) {
      ctx.beginPath();
      ctx.moveTo(x, z + cellSize);
      ctx.lineTo(x, z);
      ctx.stroke();
    }
  }
}

function drawMapEnemies(ctx, cellSize) {
  for (const enemy of mapEditorState.enemies) {
    drawMapEnemyIcon(ctx, cellSize, enemy);
  }
}

function drawMapEnemyIcon(ctx, cellSize, enemy) {
  const isBoss = normalizeMapEnemyType(enemy.type) === "boss";
  const px = enemy.x * cellSize;
  const py = enemy.z * cellSize;
  const radius = THREE.MathUtils.clamp(cellSize * (isBoss ? 0.29 : 0.24), 6, 16);

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.62)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = isBoss ? "#e4b83a" : "#f3efe1";
  ctx.strokeStyle = isBoss ? "#fff1a8" : "#c8ffd8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px, py - radius * 0.08, radius, Math.PI * 0.08, Math.PI * 0.92, true);
  ctx.lineTo(px - radius * 0.72, py + radius * 0.78);
  ctx.lineTo(px + radius * 0.72, py + radius * 0.78);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.stroke();
  ctx.fillStyle = "#10110f";
  ctx.beginPath();
  ctx.ellipse(px - radius * 0.34, py - radius * 0.12, radius * 0.18, radius * 0.24, -0.2, 0, Math.PI * 2);
  ctx.ellipse(px + radius * 0.34, py - radius * 0.12, radius * 0.18, radius * 0.24, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(px - radius * 0.36, py + radius * 0.45, radius * 0.72, Math.max(1, radius * 0.12));
  drawFacingMarker(ctx, cellSize, enemy, enemy.direction, {
    color: "#11120f",
    lengthScale: isBoss ? 0.5 : 0.42,
    width: Math.max(2, radius * 0.18),
  });
  ctx.restore();
}

function drawMapHover(ctx, cellSize) {
  if (!mapEditorState.hoverTile) {
    return;
  }

  const { x, z } = mapEditorState.hoverTile;
  ctx.lineWidth = 2;
  ctx.strokeStyle = mapEditorState.activeTiles.has(tileKey(x, z))
    ? "rgba(255, 211, 111, 0.92)"
    : "rgba(224, 208, 133, 0.62)";
  ctx.strokeRect(x * cellSize + 1, z * cellSize + 1, cellSize - 2, cellSize - 2);
}

function drawMapPendingDirection(ctx, cellSize) {
  const pending = mapEditorState.pendingDirection;
  if (!pending) {
    return;
  }

  const originX = pending.position.x * cellSize;
  const originY = pending.position.z * cellSize;
  const targetX = pending.mousePoint.x * cellSize;
  const targetY = pending.mousePoint.z * cellSize;

  ctx.save();
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = pending.kind === "boss"
    ? "rgba(228, 184, 58, 0.9)"
    : pending.kind === "enemy"
      ? "rgba(128, 255, 170, 0.8)"
      : "rgba(255, 216, 161, 0.85)";
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();
  ctx.setLineDash([]);
  drawFacingMarker(ctx, cellSize, pending.position, pending.direction, {
    color: pending.kind === "boss" ? "#e4b83a" : pending.kind === "enemy" ? "#c8ffd8" : "#ffd8a1",
    lengthScale: 0.56,
    width: 3,
  });
  ctx.restore();
}

function drawMapPlayer(ctx, cellSize) {
  const valid = isMapPlayerPlacementValid();
  drawMapActor(ctx, cellSize, { ...mapEditorState.playerPosition, direction: mapEditorState.playerDirection }, {
    fill: valid ? "#e31925" : "#6c1f1f",
    stroke: valid ? "#ffd8a1" : "#ffd2c8",
    line: "#1a0b0c",
    radiusScale: 0.28,
    invalid: !valid,
  });
}

function drawMapActor(ctx, cellSize, actor, style) {
  const px = actor.x * cellSize;
  const py = actor.z * cellSize;
  const radius = THREE.MathUtils.clamp(cellSize * style.radiusScale, 5, 14);

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.62)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = style.fill;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = style.invalid ? 3 : 2;
  ctx.strokeStyle = style.stroke;
  ctx.stroke();
  drawFacingMarker(ctx, cellSize, actor, actor.direction, {
    color: style.line,
    lengthScale: 0.42,
    width: Math.max(2, radius * 0.22),
  });
  ctx.restore();
}

function drawFacingMarker(ctx, cellSize, position, directionId, style) {
  const direction = getMapDirectionVector(directionId);
  const length = cellSize * style.lengthScale;
  const directionLength = Math.hypot(direction.x, direction.z) || 1;
  const startX = position.x * cellSize;
  const startY = position.z * cellSize;
  const endX = startX + (direction.x / directionLength) * length;
  const endY = startY + (direction.z / directionLength) * length;

  ctx.lineCap = "round";
  ctx.lineWidth = style.width;
  ctx.strokeStyle = style.color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

async function applyMapEditorState() {
  if (!isMapPlayerPlacementValid()) {
    updateMapEditorControls();
    return;
  }

  mapEditorState.appliedTiles = cloneTileSet(mapEditorState.activeTiles);
  mapEditorState.appliedPlayerPosition = { ...mapEditorState.playerPosition };
  mapEditorState.appliedPlayerDirection = mapEditorState.playerDirection;
  mapEditorState.appliedEnemies = cloneMapEnemies(mapEditorState.enemies);
  mapEditorState.appliedMaterials = { ...mapEditorState.materials };
  mapEditorState.appliedShowTileEdges = mapEditorState.showTileEdges;
  mapEditorState.appliedIsCovered = mapEditorState.isCovered;
  const appliedFloor = createMapFloorConfigFromEditor({ applied: true });
  if (mapEditorState.activeFloorIndex >= 0 && mapEditorState.activeFloorIndex < mapEditorState.floors.length) {
    mapEditorState.floors[mapEditorState.activeFloorIndex] = appliedFloor;
  } else if (mapEditorState.activeFloorIndex === mapEditorState.floors.length) {
    mapEditorState.floors.push(appliedFloor);
  }
  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  mapEditorState.dirty = false;
  mapEditorState.persisting = true;
  mapEditorState.feedbackMessage = "Salvando mapa...";
  mapEditorState.feedbackIsError = false;

  rebuildPlatformFromAppliedMap();
  positionCharacterOnMap(mapEditorState.appliedPlayerPosition, mapEditorState.appliedPlayerDirection);
  renderAppliedEnemies();
  setupFloorLootChest();
  frameScene();
  updateMapHud();
  renderMapEditor();
  updateMapEditorControls();

  try {
    await persistAppliedMapConfig(createAppliedMapConfigPayload());
    mapEditorState.feedbackMessage = "Mapa aplicado e salvo";
    mapEditorState.feedbackIsError = false;
  } catch (error) {
    console.error("Falha ao salvar mapa aplicado.", error);
    mapEditorState.feedbackMessage = "Mapa aplicado; codigo nao salvo";
    mapEditorState.feedbackIsError = true;
  } finally {
    mapEditorState.persisting = false;
    updateMapEditorControls();
  }
}

async function persistAppliedMapConfig(payload = createAppliedMapConfigPayload()) {
  if (runtimeIsStaticHosted) {
    return;
  }

  const response = await fetch("/api/map-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

function createAppliedMapConfigPayload() {
  const appliedFloor = createMapFloorConfigFromEditor({ applied: true });
  const floors = [...mapEditorState.floors];
  if (mapEditorState.activeFloorIndex >= 0 && mapEditorState.activeFloorIndex < floors.length) {
    floors[mapEditorState.activeFloorIndex] = appliedFloor;
  } else if (mapEditorState.activeFloorIndex === floors.length) {
    floors.push(appliedFloor);
  }

  return createMapConfigPayloadFromFloors(floors, Math.min(mapEditorState.activeFloorIndex, floors.length - 1), appliedFloor);
}

function createMapConfigPayloadFromFloors(
  floors = mapEditorState.floors,
  currentFloor = mapEditorState.activeFloorIndex,
  fallbackFloor = createMapFloorConfigFromEditor(),
) {
  const normalizedFloors = floors.length ? floors : [fallbackFloor];
  const selectedFloor = normalizedFloors[Math.max(0, Math.min(currentFloor, normalizedFloors.length - 1))] || fallbackFloor;

  return {
    ...selectedFloor,
    floors: normalizedFloors.map((floor) => ({ ...floor, enemies: cloneMapEnemies(floor.enemies) })),
    currentFloor: Math.max(0, Math.min(currentFloor, normalizedFloors.length - 1)),
    showTileEdges: false,
    isCovered: true,
  };
}

function roundMapCoordinate(value) {
  return Number(Number(value).toFixed(3));
}

function rebuildPlatformFromAppliedMap() {
  const nextPlatform = createPlatform(createAppliedMapSnapshot());

  clearWallOcclusionState();

  if (platformGroup) {
    scene.remove(platformGroup);
    disposeObject3D(platformGroup);
  }

  platformGroup = nextPlatform;
  scene.add(platformGroup);
  collectWallOccluders(platformGroup);
}

function updateMapEditorControls() {
  if (!mapStatus || !mapFeedback || !applyMapButton) {
    return;
  }

  const hasTiles = mapEditorState.activeTiles.size > 0;
  const validPlacement = isMapPlayerPlacementValid();
  mapStatus.textContent = `Andar ${mapEditorState.activeFloorIndex + 1} / ${mapEditorState.activeTiles.size} tiles`;
  applyMapButton.disabled = mapEditorState.persisting || !hasTiles || !validPlacement || Boolean(mapEditorState.pendingDirection);
  if (saveFloorButton) {
    saveFloorButton.disabled = mapEditorState.persisting || !hasTiles || !validPlacement || Boolean(mapEditorState.pendingDirection);
  }
  mapFeedback.classList.toggle("is-error", !hasTiles || !validPlacement || mapEditorState.feedbackIsError);
  showTileEdgesInput.checked = mapEditorState.showTileEdges;
  showTileEdgesValue.textContent = mapEditorState.showTileEdges ? "Sim" : "Nao";
  mapCoveredInput.checked = mapEditorState.isCovered;
  mapCoveredValue.textContent = mapEditorState.isCovered ? "Sim" : "Nao";
  syncMapToolControls();
  syncMapMaterialControls();

  if (!hasTiles) {
    mapFeedback.textContent = "Sem tiles";
  } else if (!validPlacement) {
    mapFeedback.textContent = "Posicao fora dos tiles";
  } else if (mapEditorState.pendingDirection) {
    mapFeedback.textContent = "Clique a direcao";
  } else if (mapEditorState.feedbackMessage) {
    mapFeedback.textContent = mapEditorState.feedbackMessage;
  } else {
    mapFeedback.textContent = mapEditorState.dirty ? "Alteracoes pendentes" : "Mapa aplicado";
  }

  mapZoomOutButton.disabled = mapEditorState.zoom <= mapZoomMin + 0.001;
  mapZoomInButton.disabled = mapEditorState.zoom >= mapZoomMax - 0.001;
  renderFloorStack();
}

function updateMapHud() {
  if (mapHudElement) {
    mapHudElement.textContent = `F${mapEditorState.activeFloorIndex + 1} / ${mapSize} x ${mapSize} / ${mapEditorState.appliedTiles.size} tiles`;
  }
}

function tileKey(x, z) {
  return `${x},${z}`;
}

function parseTileKey(key) {
  const [x, z] = key.split(",").map((value) => Number(value));
  return { x, z };
}

function mapPointToWorld(position) {
  return {
    x: (position.x - mapCenter) * platformTileSize,
    z: (position.z - mapCenter) * platformTileSize,
  };
}

function worldToMapPoint(position) {
  return {
    x: position.x / platformTileSize + mapCenter,
    z: position.z / platformTileSize + mapCenter,
  };
}

function mapTileCenterToWorld(tile) {
  return {
    x: (tile.x + 0.5 - mapCenter) * platformTileSize,
    z: (tile.z + 0.5 - mapCenter) * platformTileSize,
  };
}

function positionCharacterOnMap(position, direction = mapEditorState.appliedPlayerDirection) {
  if (!characterModel) {
    return;
  }

  const worldPosition = mapPointToWorld(position);
  characterModel.position.x = worldPosition.x;
  characterModel.position.z = worldPosition.z;
  playerControlState.yawRadians = directionToYaw(direction);
  characterModel.rotation.y = playerControlState.yawRadians;
}

function renderAppliedEnemies() {
  clearAppliedEnemies();
  clearImpactEffects();
  clearAmmoPickups();

  if (!enemySourceModel || mapEditorState.appliedEnemies.length === 0) {
    return;
  }

  enemyGroup = new THREE.Group();
  enemyGroup.name = "MapEnemies";

  for (const [index, enemy] of mapEditorState.appliedEnemies.entries()) {
    const enemyModel = cloneSkeleton(enemySourceModel);
    const worldPosition = mapPointToWorld(enemy);
    enemyModel.position.x += worldPosition.x;
    enemyModel.position.z += worldPosition.z;
    enemyModel.rotation.y = directionToYaw(enemy.direction);
    const enemyType = normalizeMapEnemyType(enemy.type);
    if (enemyType === "boss") {
      enemyModel.scale.multiplyScalar(bossScaleMultiplier);
      groundEnemyModel(enemyModel);
    }
    enemyModel.name = enemyType === "boss" ? "SkeletonBoss" : "Skeleton";
    prepareStaticModel(enemyModel);
    const enemyRuntime = createEnemyRuntime(enemyModel, enemy, index);
    enemyModel.traverse((node) => {
      node.userData.enemyRuntime = enemyRuntime;
    });
    activeEnemies.push(enemyRuntime);
    enemyGroup.add(enemyModel);
  }

  scene.add(enemyGroup);
}

function clearAppliedEnemies() {
  for (const enemy of activeEnemies) {
    enemy.mixer?.stopAllAction();
    disposeEnemyMovementSound(enemy);
  }

  clearEnemyCombatIndicators();
  resetCorpseSearchState();
  activeEnemies = [];
  stageFlowState = createStageFlowState();
  hideStageBanner();

  if (enemyGroup) {
    scene.remove(enemyGroup);
    enemyGroup = null;
  }
}

function updateEnemyMovementSound(enemy) {
  const shouldPlay = Boolean(
    enemy.active
      && enemy.spawned
      && enemy.model?.visible !== false
      && enemy.state === "chasing"
      && enemy.movedThisFrame
      && !playerControlState.dead,
  );
  const sound = shouldPlay ? ensureEnemyMovementSound(enemy) : enemy.movementSound;

  if (!sound) {
    return;
  }

  if (shouldPlay) {
    if (!sound.isPlaying) {
      unlockGameAudio();
      sound.play();
    }
    return;
  }

  stopEnemyMovementSound(enemy);
}

function ensureEnemyMovementSound(enemy) {
  if (enemy.movementSound) {
    return enemy.movementSound;
  }

  if (!enemyMovementSoundBuffers.length || !enemy?.model) {
    return null;
  }

  const buffer = enemyMovementSoundBuffers[
    enemy.movementSoundBufferIndex % enemyMovementSoundBuffers.length
  ];
  if (!buffer) {
    return null;
  }

  const sound = new THREE.PositionalAudio(audioListener);
  sound.name = "EnemyMovementGroan";
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(getEnemyMovementSoundVolume(enemy));
  sound.setRefDistance(enemyMovementSoundRefDistance);
  sound.setMaxDistance(enemyMovementSoundMaxDistance);
  sound.setRolloffFactor(enemyMovementSoundRolloff);
  sound.setDistanceModel("linear");
  sound.setPlaybackRate(enemy.movementSoundRate || 1);
  sound.position.y = enemy.hitbox ? enemy.hitbox.eyeOffsetY * 0.62 : 1.8;
  enemy.model.add(sound);
  enemy.movementSound = sound;
  return sound;
}

function stopEnemyMovementSound(enemy) {
  const sound = enemy?.movementSound;
  if (sound?.isPlaying) {
    sound.stop();
  }
}

function disposeEnemyMovementSound(enemy) {
  const sound = enemy?.movementSound;
  if (!sound) {
    return;
  }

  stopEnemyMovementSound(enemy);
  sound.removeFromParent();
  try {
    sound.disconnect();
  } catch {
    // Three.js Audio disconnect can throw if the node was never connected.
  }
  enemy.movementSound = null;
}

function createEnemyRuntime(model, mapEnemy, index) {
  const type = normalizeMapEnemyType(mapEnemy.type);
  const isBoss = type === "boss";
  const enemy = {
    id: index,
    type,
    model,
    mapEnemy,
    mixer: new THREE.AnimationMixer(model),
    actions: new Map(),
    activeAction: null,
    activeClipName: null,
    state: "idle",
    stateTimer: 0,
    stateElapsed: 0,
    startsInactiveFloor: !isBoss && Math.random() < enemyInitialInactiveFloorChance,
    health: enemyMaxHealth * (isBoss ? bossHealthMultiplier : 1),
    maxHealth: enemyMaxHealth * (isBoss ? bossHealthMultiplier : 1),
    halfHealthHandled: false,
    canHalfHealthFall: Math.random() < enemyHalfHealthFallChance,
    speedMultiplier: isBoss ? bossSpeedMultiplier : 1,
    attackDamage: enemyAttackDamage * (isBoss ? bossAttackDamageMultiplier : 1),
    attackCooldown: Math.random() * 0.65,
    attackHitApplied: false,
    hitReactTimer: 0,
    hitReactPhase: Math.random() * Math.PI * 2,
    hitbox: createEnemyHitboxMetrics(model),
    distanceToPlayer: Infinity,
    mixerUpdateAccumulator: 0,
    mixerUpdateTimer: Math.random() * performanceProfile.enemyFarMixerInterval,
    lineOfSightTimer: Math.random() * performanceProfile.enemyLosInterval,
    lineOfSightResult: false,
    alerted: false,
    path: [],
    pathStartKey: null,
    pathTargetKey: null,
    pathRepathTimer: 0,
    movedThisFrame: false,
    movementSound: null,
    movementSoundBufferIndex: Math.floor(Math.random() * enemyMovementSoundUrls.length),
    movementSoundRate: THREE.MathUtils.lerp(0.94, 1.06, Math.random()),
    active: !isBoss,
    spawned: !isBoss,
  };

  setupEnemyAnimationActions(enemy);
  if (isBoss) {
    model.visible = false;
  } else {
    startEnemyInitialAnimation(enemy);
    enemy.mixer.update(0.001);
  }
  return enemy;
}

function updateEnemyCombatIndicators(delta) {
  updateEnemyDamageNumbers(delta);
}

function spawnEnemyDamageNumber(enemy, amount, { headshot = false, point = null } = {}) {
  if (!enemy?.model?.visible) {
    return;
  }

  const { sprite, texture, material } = createDamageNumberSprite(amount, headshot);
  const origin = damageNumberPosition;
  if (point) {
    origin.copy(point);
  } else {
    origin.set(
      enemy.model.position.x,
      enemy.model.position.y + enemy.hitbox.maxY * 0.72,
      enemy.model.position.z,
    );
  }

  damageNumberCameraOffset.copy(camera.position).sub(origin);
  if (damageNumberCameraOffset.lengthSq() > 0.001) {
    damageNumberCameraOffset.normalize();
    origin.addScaledVector(damageNumberCameraOffset, 0.28);
  }

  origin.x += (Math.random() - 0.5) * 0.22;
  origin.y += headshot ? 0.28 : 0.12;
  origin.z += (Math.random() - 0.5) * 0.22;

  const baseWidth = headshot ? 0.76 : 0.58;
  const baseHeight = baseWidth * (damageNumberCanvasHeight / damageNumberCanvasWidth);
  sprite.position.copy(origin);
  sprite.scale.set(baseWidth, baseHeight, 1);
  scene.add(sprite);

  activeDamageNumbers.push({
    sprite,
    texture,
    material,
    age: 0,
    duration: damageNumberDuration,
    startPosition: origin.clone(),
    drift: new THREE.Vector3(
      (Math.random() - 0.5) * 0.34,
      damageNumberRise,
      (Math.random() - 0.5) * 0.34,
    ),
    baseScale: sprite.scale.clone(),
  });
}

function createDamageNumberSprite(amount, headshot) {
  const canvas = document.createElement("canvas");
  canvas.width = damageNumberCanvasWidth;
  canvas.height = damageNumberCanvasHeight;
  const context = canvas.getContext("2d");
  const text = String(Math.round(amount));
  const color = headshot ? "#ff3434" : "#ffd84d";

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = `800 ${headshot ? 48 : 42}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineJoin = "round";
  context.strokeStyle = "rgba(0, 0, 0, 0.88)";
  context.lineWidth = headshot ? 9 : 8;
  context.strokeText(text, canvas.width / 2, canvas.height / 2);
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: true,
  });
  const sprite = new THREE.Sprite(material);
  sprite.name = headshot ? "HeadshotDamageNumber" : "BodyDamageNumber";
  sprite.frustumCulled = false;
  sprite.renderOrder = 40;

  return { sprite, texture, material };
}

function updateEnemyDamageNumbers(delta) {
  for (let index = activeDamageNumbers.length - 1; index >= 0; index -= 1) {
    const number = activeDamageNumbers[index];
    number.age += delta;
    const progress = THREE.MathUtils.clamp(number.age / number.duration, 0, 1);
    const easedProgress = 1 - ((1 - progress) * (1 - progress));
    const fade = 1 - progress;

    number.sprite.position.copy(number.startPosition).addScaledVector(number.drift, easedProgress);
    number.sprite.scale.copy(number.baseScale).multiplyScalar(1 + Math.sin(progress * Math.PI) * 0.18);
    number.material.opacity = fade;

    if (progress >= 1) {
      activeDamageNumbers.splice(index, 1);
      disposeDamageNumber(number);
    }
  }
}

function disposeDamageNumber(number) {
  number.sprite.removeFromParent();
  number.texture.dispose();
  number.material.dispose();
}

function clearEnemyCombatIndicators() {
  for (const number of activeDamageNumbers) {
    disposeDamageNumber(number);
  }
  activeDamageNumbers = [];
}

function createEnemyHitboxMetrics(model) {
  enemyBoundsBox.setFromObject(model);
  if (enemyBoundsBox.isEmpty()) {
    return {
      minY: 0,
      maxY: 4.4,
      headMinY: 2.9,
      eyeOffsetY: 3,
      bodyRadius: enemyCollisionRadius,
      headRadius: enemyCollisionRadius * 0.56,
    };
  }

  enemyBoundsBox.getSize(enemyBoundsSize);
  const minY = enemyBoundsBox.min.y - model.position.y;
  const maxY = enemyBoundsBox.max.y - model.position.y;
  const height = Math.max(maxY - minY, 0.1);
  const radius = Math.max(enemyBoundsSize.x, enemyBoundsSize.z, enemyCollisionRadius * 1.35) * 0.5;

  return {
    minY,
    maxY,
    headMinY: minY + height * 0.66,
    eyeOffsetY: minY + height * 0.68,
    bodyRadius: radius,
    headRadius: Math.max(radius * 0.62, enemyCollisionRadius * 0.38),
  };
}

function setupEnemyAnimationActions(enemy) {
  for (const clipName of enemyAnimationIds) {
    const sourceClip = sourceAnimationClips.get(clipName);
    if (!sourceClip) {
      continue;
    }

    const action = enemy.mixer.clipAction(sourceClip);
    configureEnemyAction(action, clipName);
    enemy.actions.set(clipName, action);
  }
}

function configureEnemyAction(action, clipName) {
  action.enabled = true;
  action.timeScale = 1;

  if (enemyLoopingAnimations.has(clipName)) {
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
  } else {
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
  }
}

function startEnemyInitialAnimation(enemy) {
  if (enemy.startsInactiveFloor && startEnemyInactiveFloorPose(enemy)) {
    return;
  }

  startEnemySpawnAnimation(enemy);
}

function startEnemyInactiveFloorPose(enemy) {
  return setEnemyLoopState(enemy, "inactiveFloor", "Skeletons_Inactive_Floor_Pose", { restart: true });
}

function startEnemySpawnAnimation(enemy) {
  if (!setEnemyLoopState(enemy, "idle", "Skeletons_Idle", { restart: true })) {
    console.warn("Animacao Skeletons_Idle nao encontrada para inimigo.");
  }
}

function createStageFlowState() {
  return {
    bossCountdownActive: false,
    bossCountdown: 0,
    clearActive: false,
    clearTimer: 0,
    bannerTimer: 0,
    floorComplete: false,
  };
}

function createRunTimingState() {
  return {
    started: false,
    active: false,
    finished: false,
    dead: false,
    resultShown: false,
    totalStartTime: 0,
    totalElapsedMs: 0,
    currentFloorStartTime: 0,
    currentFloorElapsedMs: 0,
    activeFloorIndex: 0,
    floorTimesMs: [],
    floorCompleted: [],
  };
}

function startRunTimer(floorIndex = mapEditorState.activeFloorIndex) {
  const now = performance.now();
  const floorCount = getRunFloorCount();
  runTimingState = {
    ...createRunTimingState(),
    started: true,
    active: true,
    totalStartTime: now,
    currentFloorStartTime: now,
    activeFloorIndex: floorIndex,
    floorTimesMs: Array.from({ length: floorCount }, () => null),
    floorCompleted: Array.from({ length: floorCount }, () => false),
  };
  syncRunTimerHud();
}

function startRunFloorTimer(floorIndex, now = performance.now()) {
  if (!runTimingState.started || runTimingState.dead || runTimingState.finished) {
    return;
  }

  ensureRunFloorCapacity();
  runTimingState.activeFloorIndex = floorIndex;
  runTimingState.currentFloorStartTime = now;
  runTimingState.currentFloorElapsedMs = 0;
}

function recordCurrentFloorTime({ completed = false, now = performance.now() } = {}) {
  if (!runTimingState.started) {
    return;
  }

  ensureRunFloorCapacity();
  const floorIndex = THREE.MathUtils.clamp(
    runTimingState.activeFloorIndex,
    0,
    Math.max(0, getRunFloorCount() - 1),
  );
  if (completed && runTimingState.floorCompleted[floorIndex]) {
    return;
  }
  if (!completed && runTimingState.floorCompleted[floorIndex]) {
    return;
  }

  const floorElapsedMs = Math.max(0, now - runTimingState.currentFloorStartTime);
  runTimingState.floorTimesMs[floorIndex] = floorElapsedMs;
  runTimingState.floorCompleted[floorIndex] = completed;
  runTimingState.currentFloorElapsedMs = floorElapsedMs;
}

function stopRunTimer(outcome, now = performance.now()) {
  if (!runTimingState.started || (!runTimingState.active && runTimingState.resultShown)) {
    return;
  }

  runTimingState.totalElapsedMs = Math.max(0, now - runTimingState.totalStartTime);
  runTimingState.active = false;
  runTimingState.dead = outcome === "dead";
  runTimingState.finished = outcome === "complete";
  syncRunTimerHud();
}

function updateRunTimer() {
  if (!runTimingState.started || !runTimingState.active) {
    return;
  }

  const now = performance.now();
  runTimingState.totalElapsedMs = Math.max(0, now - runTimingState.totalStartTime);
  runTimingState.currentFloorElapsedMs = Math.max(0, now - runTimingState.currentFloorStartTime);
  syncRunTimerHud();
}

function syncRunTimerHud() {
  if (!runTimerElement) {
    return;
  }

  runTimerElement.hidden = !runTimingState.started;
  runTimerElement.textContent = formatRunTime(runTimingState.totalElapsedMs);
}

function getRunFloorCount() {
  return Math.max(1, mapEditorState.floors.length || 1);
}

function ensureRunFloorCapacity() {
  const floorCount = getRunFloorCount();
  while (runTimingState.floorTimesMs.length < floorCount) {
    runTimingState.floorTimesMs.push(null);
  }
  while (runTimingState.floorCompleted.length < floorCount) {
    runTimingState.floorCompleted.push(false);
  }
}

function isLastRunFloor(floorIndex = mapEditorState.activeFloorIndex) {
  return floorIndex >= getRunFloorCount() - 1;
}

function finishRun(outcome) {
  if (!runTimingState.started || runTimingState.resultShown) {
    return;
  }

  stopFloorMusic();
  stopGameplayInputForRunSummary();
  runTimingState.resultShown = true;
  const recordResult = updateRunRecords(outcome);
  renderRunSummary(outcome, recordResult.records, recordResult);
}

function stopGameplayInputForRunSummary() {
  clearPlayerMouseButtons();
  playerControlState.pressedKeys.clear();
  cameraControlState.pressedKeys.clear();
  stopMobileJoystick();
  stopMobileLook();
  stopMobileFireLook();
  resetCorpseSearchState();
  mobileFireButton?.classList.remove("is-firing");

  if (document.pointerLockElement === renderer.domElement) {
    document.exitPointerLock();
  }
}

function updateRunRecords(outcome) {
  const records = loadRunRecords();
  const improvedFloorIndexes = new Set();
  let improvedTotal = false;
  let changed = false;
  ensureRunFloorCapacity();

  for (let index = 0; index < runTimingState.floorTimesMs.length; index += 1) {
    if (!runTimingState.floorCompleted[index]) {
      continue;
    }

    const runTime = normalizeRecordTime(runTimingState.floorTimesMs[index]);
    if (runTime === null) {
      continue;
    }

    const previous = normalizeRecordTime(records.floorRecordsMs[index]);
    if (previous === null || runTime < previous) {
      records.floorRecordsMs[index] = runTime;
      improvedFloorIndexes.add(index);
      changed = true;
    }
  }

  if (outcome === "complete") {
    const totalTime = normalizeRecordTime(runTimingState.totalElapsedMs);
    const previousTotal = normalizeRecordTime(records.totalRecordMs);
    if (totalTime !== null && (previousTotal === null || totalTime < previousTotal)) {
      records.totalRecordMs = totalTime;
      improvedTotal = true;
      changed = true;
    }
  }

  if (changed) {
    saveRunRecords(records);
  }

  return { records, improvedFloorIndexes, improvedTotal };
}

function loadRunRecords() {
  const fallback = { floorRecordsMs: [], totalRecordMs: null };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(runRecordsStorageKey) || "null");
    if (!parsed || typeof parsed !== "object") {
      return fallback;
    }

    return {
      floorRecordsMs: Array.isArray(parsed.floorRecordsMs)
        ? parsed.floorRecordsMs.map(normalizeRecordTime)
        : [],
      totalRecordMs: normalizeRecordTime(parsed.totalRecordMs),
    };
  } catch {
    return fallback;
  }
}

function saveRunRecords(records) {
  try {
    const floorRecordsMs = records.floorRecordsMs.map(normalizeRecordTime);
    while (floorRecordsMs.length && floorRecordsMs[floorRecordsMs.length - 1] === null) {
      floorRecordsMs.pop();
    }
    window.localStorage.setItem(runRecordsStorageKey, JSON.stringify({
      floorRecordsMs,
      totalRecordMs: normalizeRecordTime(records.totalRecordMs),
    }));
  } catch {
    // Private browsing or storage quotas can block persistence; the run summary still works.
  }
}

function normalizeRecordTime(value) {
  const time = Number(value);
  return Number.isFinite(time) && time > 0 ? time : null;
}

function renderRunSummary(outcome, records = loadRunRecords(), recordResult = null) {
  if (!runSummaryModalElement || !runSummaryBodyElement) {
    return;
  }

  if (runSummaryTitleElement) {
    runSummaryTitleElement.textContent = outcome === "complete" ? "Run Complete" : "Você morreu";
  }

  const table = createRunRecordsTable({
    records,
    includeCurrentRun: true,
    recordResult,
  });
  runSummaryBodyElement.replaceChildren(table);
  runSummaryModalElement.hidden = false;
}

function openStartRecordsModal() {
  if (!startRecordsModalElement || !startRecordsBodyElement) {
    return;
  }

  startRecordsBodyElement.replaceChildren(createRunRecordsTable({
    records: loadRunRecords(),
    includeCurrentRun: false,
  }));
  startRecordsModalElement.hidden = false;
  window.requestAnimationFrame(() => {
    startRecordsCloseButton?.focus?.();
  });
}

function closeStartRecordsModal() {
  if (!startRecordsModalElement) {
    return;
  }

  startRecordsModalElement.hidden = true;
  startRecordsOpenButton?.focus?.();
}

function createRunRecordsTable({ records, includeCurrentRun = true, recordResult = null } = {}) {
  const table = document.createElement("table");
  table.className = "run-summary-table";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const labels = includeCurrentRun ? ["Stage", "Current Run", "Record Time"] : ["Stage", "Record Time"];
  for (const label of labels) {
    const th = document.createElement("th");
    th.textContent = label;
    headRow.append(th);
  }
  thead.append(headRow);
  table.append(thead);

  const tbody = document.createElement("tbody");
  const floorCount = Math.max(getRunFloorCount(), records?.floorRecordsMs?.length || 0);
  for (let index = 0; index < floorCount; index += 1) {
    tbody.append(createRunSummaryRow({
      label: `Floor ${index + 1}`,
      runTime: runTimingState.floorTimesMs[index],
      recordTime: records?.floorRecordsMs?.[index],
      improvedRecord: recordResult?.improvedFloorIndexes?.has?.(index),
      includeCurrentRun,
    }));
  }
  tbody.append(createRunSummaryRow({
    label: "Total Run",
    runTime: runTimingState.totalElapsedMs,
    recordTime: records?.totalRecordMs,
    improvedRecord: Boolean(recordResult?.improvedTotal),
    includeCurrentRun,
  }));
  table.append(tbody);
  return table;
}

function createRunSummaryRow({ label, runTime, recordTime, improvedRecord = false, includeCurrentRun = true } = {}) {
  const row = document.createElement("tr");
  const labelCell = document.createElement("td");
  const recordCell = document.createElement("td");

  labelCell.textContent = label;
  recordCell.textContent = formatNullableRunTime(recordTime);
  recordCell.className = "run-summary-record";
  recordCell.classList.toggle("is-new-record", improvedRecord);

  row.append(labelCell);
  if (includeCurrentRun) {
    const runCell = document.createElement("td");
    runCell.textContent = formatNullableRunTime(runTime);
    row.append(runCell);
  }
  row.append(recordCell);
  return row;
}

function hideRunSummaryModal() {
  if (runSummaryModalElement) {
    runSummaryModalElement.hidden = true;
  }
}

function formatNullableRunTime(value) {
  const time = normalizeRecordTime(value);
  return time === null ? "-" : formatRunTime(time);
}

function formatRunTime(milliseconds) {
  const totalCentiseconds = Math.floor(Math.max(0, Number(milliseconds) || 0) / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${padRunTime(minutes)}:${padRunTime(seconds)}:${padRunTime(centiseconds)}`;
}

function padRunTime(value) {
  return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}

function updateEnemies(delta) {
  if (!activeEnemies.length) {
    return;
  }

  for (const enemy of activeEnemies) {
    if (!enemy.active && !isEnemyTimedState(enemy.state)) {
      continue;
    }

    enemy.movedThisFrame = false;
    refreshEnemyDistanceToPlayer(enemy);
    updateEnemyMixer(enemy, delta);

    if (enemy.state === "dead") {
      stopEnemyMovementSound(enemy);
      updateEnemyHitFeedback(enemy, delta);
      continue;
    }

    updateEnemyState(enemy, delta);
    updateEnemyHitFeedback(enemy, delta);
    updateEnemyMovementSound(enemy);
  }
}

function updateStageFlow(delta) {
  if (stageFlowState.bannerTimer > 0) {
    stageFlowState.bannerTimer = Math.max(0, stageFlowState.bannerTimer - delta);
    if (stageFlowState.bannerTimer <= 0 && !stageFlowState.bossCountdownActive && !stageFlowState.clearActive) {
      hideStageBanner();
    }
  }

  if (playerControlState.dead) {
    return;
  }

  if (!activeEnemies.length) {
    if (enemySourceModel && mapEditorState.appliedEnemies.length === 0) {
      startStageClear();
    }
    return;
  }

  if (stageFlowState.floorComplete) {
    return;
  }

  if (isGameplayCameraOutroActive()) {
    return;
  }

  if (stageFlowState.clearActive) {
    stageFlowState.clearTimer -= delta;
    if (stageFlowState.clearTimer <= 0) {
      advanceToNextFloor();
    }
    return;
  }

  if (stageFlowState.bossCountdownActive) {
    stageFlowState.bossCountdown = Math.max(0, stageFlowState.bossCountdown - delta);
    if (stageFlowState.bossCountdown <= 0) {
      stageFlowState.bossCountdownActive = false;
      showStageBanner("0", { countdown: true, duration: 0.35 });
      spawnPendingBosses();
    } else {
      showStageBanner(String(Math.ceil(stageFlowState.bossCountdown)), { countdown: true });
    }
    return;
  }

  const hasAliveSkeleton = activeEnemies.some((enemy) => enemy.type !== "boss" && enemy.active);
  const pendingBosses = activeEnemies.filter((enemy) => enemy.type === "boss" && !enemy.spawned);
  if (!hasAliveSkeleton && pendingBosses.length > 0) {
    stageFlowState.bossCountdownActive = true;
    stageFlowState.bossCountdown = bossSpawnCountdownSeconds;
    showStageBanner(String(bossSpawnCountdownSeconds), { countdown: true });
    return;
  }

  const hasActiveEnemy = activeEnemies.some((enemy) => enemy.active || (enemy.type === "boss" && !enemy.spawned));
  if (!hasActiveEnemy) {
    startStageClear();
  }
}

function spawnPendingBosses() {
  for (const enemy of activeEnemies) {
    if (enemy.type !== "boss" || enemy.spawned) {
      continue;
    }

    enemy.spawned = true;
    enemy.active = true;
    enemy.model.visible = true;
    enemy.mixerUpdateAccumulator = 0;
    enemy.mixerUpdateTimer = 0;

    if (enemy.actions.has("Skeletons_Spawn_Ground")) {
      startEnemyTimedState(enemy, "spawning", "Skeletons_Spawn_Ground", 1.6);
    } else {
      setEnemyLoopState(enemy, "idle", "Skeletons_Idle", { restart: true });
    }

    enemy.mixer.update(0.001);
  }
}

function startStageClear() {
  if (stageFlowState.clearActive || stageFlowState.floorComplete) {
    return;
  }

  const now = performance.now();
  recordCurrentFloorTime({ completed: true, now });
  if (isLastRunFloor(mapEditorState.activeFloorIndex)) {
    stopRunTimer("complete", now);
  }

  stageFlowState.clearActive = true;
  showStageBanner("FLOOR CLEAR");
  if (shouldPlayBossClearCameraOutro()) {
    stageFlowState.clearTimer = 0;
    startGameplayCameraOutro();
    return;
  }

  stageFlowState.clearTimer = 2.2;
}

function shouldPlayBossClearCameraOutro() {
  return activeEnemies.some((enemy) => (
    enemy.type === "boss"
      && enemy.spawned
      && enemy.health <= 0
      && (enemy.state === "dying" || enemy.state === "dead")
  ));
}

function advanceToNextFloor() {
  stageFlowState.clearActive = false;
  const nextFloorIndex = mapEditorState.activeFloorIndex + 1;
  if (nextFloorIndex < mapEditorState.floors.length) {
    loadMapFloorIntoEditor(mapEditorState.floors[nextFloorIndex], nextFloorIndex);
    startRunFloorTimer(nextFloorIndex);
    playFloorMusic(nextFloorIndex);
    showStageBanner(`FLOOR ${nextFloorIndex + 1}`, { duration: 1.6 });
    return;
  }

  showStageBanner("FLOOR CLEAR", { duration: 0 });
  stageFlowState.floorComplete = true;
  finishRun("complete");
}

function showStageBanner(message, { countdown = false, duration = 0 } = {}) {
  if (!stageBannerElement) {
    return;
  }

  stageBannerElement.textContent = message;
  stageBannerElement.hidden = false;
  stageBannerElement.classList.toggle("is-countdown", countdown);
  stageFlowState.bannerTimer = duration;
}

function hideStageBanner() {
  if (!stageBannerElement) {
    return;
  }

  stageBannerElement.hidden = true;
  stageBannerElement.classList.remove("is-countdown");
  stageBannerElement.textContent = "";
}

function updateEnemyMixer(enemy, delta) {
  if (!enemy.mixer) {
    return;
  }

  const needsFullRate = enemy.distanceToPlayer <= performanceProfile.enemyNearUpdateDistance
    || enemy.state === "attacking"
    || isEnemyTimedState(enemy.state)
    || enemy.hitReactTimer > 0;

  if (needsFullRate) {
    if (enemy.mixerUpdateAccumulator > 0) {
      delta += enemy.mixerUpdateAccumulator;
      enemy.mixerUpdateAccumulator = 0;
    }
    enemy.mixer.update(delta);
    enemy.mixerUpdateTimer = performanceProfile.enemyFarMixerInterval;
    return;
  }

  enemy.mixerUpdateAccumulator += delta;
  enemy.mixerUpdateTimer -= delta;
  if (enemy.mixerUpdateTimer > 0) {
    return;
  }

  enemy.mixer.update(enemy.mixerUpdateAccumulator);
  enemy.mixerUpdateAccumulator = 0;
  enemy.mixerUpdateTimer = performanceProfile.enemyFarMixerInterval;
}

function updateEnemyState(enemy, delta) {
  if (isEnemyTimedState(enemy.state)) {
    updateEnemyTimedState(enemy, delta);
    return;
  }

  if (!characterModel || playerControlState.dead) {
    if (enemy.state !== "inactiveFloor") {
      setEnemyLoopState(enemy, "idle", "Skeletons_Idle");
    }
    return;
  }

  enemy.attackCooldown = Math.max(0, enemy.attackCooldown - delta);

  if (enemy.state === "attacking") {
    updateEnemyAttack(enemy, delta);
    return;
  }

  const canSeePlayer = canEnemySeePlayer(enemy, delta);
  if (enemy.state === "inactiveFloor") {
    if (canSeePlayer) {
      wakeInactiveFloorEnemy(enemy);
    }
    return;
  }

  if (canSeePlayer) {
    alertEnemy(enemy);
  } else if (!enemy.alerted) {
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle");
    return;
  }

  const distanceToPlayer = getEnemyDistanceToPlayer(enemy);
  const hasAttackSight = canSeePlayer || canEnemySeePlayer(enemy, 0, { force: true });

  if (distanceToPlayer <= enemyAttackRange && enemy.attackCooldown <= 0 && hasAttackSight) {
    faceEnemyTowardPlayer(enemy);
    startEnemyAttack(enemy);
    return;
  }

  if (distanceToPlayer > enemyAttackRange * 0.82 || !hasAttackSight) {
    setEnemyLoopState(enemy, "chasing", "Skeletons_Walking");
    moveEnemyTowardPlayer(enemy, delta, distanceToPlayer, { direct: hasAttackSight });
  } else {
    faceEnemyTowardPlayer(enemy);
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle");
  }
}

function alertEnemy(enemy) {
  if (!enemy) {
    return;
  }

  if (enemy.state === "inactiveFloor") {
    wakeInactiveFloorEnemy(enemy);
    return;
  }

  if (enemy.alerted) {
    return;
  }

  enemy.alerted = true;
  enemy.pathRepathTimer = 0;
}

function wakeInactiveFloorEnemy(enemy) {
  if (!enemy || enemy.state !== "inactiveFloor") {
    return false;
  }

  enemy.alerted = true;
  enemy.pathRepathTimer = 0;
  const clipName = pickInactiveFloorWakeAnimation(enemy);
  startEnemyTimedState(enemy, "awakening", clipName, 1.6);
  return true;
}

function pickInactiveFloorWakeAnimation(enemy) {
  const clips = ["Skeletons_Awaken_Floor", "Skeletons_Awaken_Floor_Long"]
    .filter((clipName) => enemy.actions.has(clipName));
  if (!clips.length) {
    return enemy.actions.has("Skeletons_Idle") ? "Skeletons_Idle" : "Skeletons_Awaken_Floor";
  }

  return clips[Math.floor(Math.random() * clips.length)];
}

function updateEnemyHitFeedback(enemy, delta) {
  if (enemy.hitReactTimer <= 0) {
    enemy.model.rotation.z = 0;
    return;
  }

  enemy.hitReactTimer = Math.max(0, enemy.hitReactTimer - delta);
  const progress = enemy.hitReactTimer / enemyHitReactDuration;
  enemy.model.rotation.z = Math.sin((1 - progress) * Math.PI * 8 + enemy.hitReactPhase) * 0.055 * progress;
}

function isEnemyTimedState(state) {
  return state === "spawning"
    || state === "awakening"
    || state === "falling"
    || state === "downed"
    || state === "resurrecting"
    || state === "dying";
}

function updateEnemyTimedState(enemy, delta) {
  enemy.stateElapsed += delta;
  enemy.stateTimer -= delta;

  if (enemy.state === "spawning" && enemy.stateTimer <= 0) {
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle", { restart: true });
    return;
  }

  if (enemy.state === "awakening" && enemy.stateTimer <= 0) {
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle", { restart: true });
    return;
  }

  if (enemy.state === "falling" && enemy.stateTimer <= 0) {
    startEnemyDownedState(enemy);
    return;
  }

  if (enemy.state === "downed" && enemy.stateTimer <= 0) {
    startEnemyTimedState(enemy, "resurrecting", "Skeletons_Death_Resurrect", 1.35);
    return;
  }

  if (enemy.state === "dying" && enemy.stateTimer <= 0) {
    enemy.state = "dead";
    playEnemyAnimation(enemy, "Skeletons_Death_Pose", { loop: true });
    return;
  }

  if (enemy.state === "resurrecting" && enemy.stateTimer <= 0) {
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle", { restart: true });
  }
}

function startEnemyDownedState(enemy) {
  enemy.state = "downed";
  enemy.stateElapsed = 0;
  enemy.stateTimer = THREE.MathUtils.lerp(enemyDownedSecondsMin, enemyDownedSecondsMax, Math.random());
  stopEnemyMovementSound(enemy);
  playEnemyAnimation(enemy, "Skeletons_Death_Pose", { loop: true, restart: true });
}

function setEnemyLoopState(enemy, state, clipName, options = {}) {
  if (enemy.state === state && !options.restart) {
    return true;
  }

  enemy.state = state;
  enemy.stateTimer = 0;
  enemy.stateElapsed = 0;
  enemy.attackHitApplied = false;
  return playEnemyAnimation(enemy, clipName, { loop: true, restart: options.restart });
}

function startEnemyTimedState(enemy, state, clipName, fallbackDuration) {
  enemy.state = state;
  enemy.stateTimer = getEnemyAnimationDuration(enemy, clipName, fallbackDuration);
  enemy.stateElapsed = 0;
  enemy.attackHitApplied = false;
  stopEnemyMovementSound(enemy);
  playEnemyAnimation(enemy, clipName, { loop: false, restart: true });
}

function playEnemyAnimation(enemy, clipName, { loop = false, restart = false } = {}) {
  const action = enemy.actions.get(clipName);
  if (!action) {
    return false;
  }

  if (!restart && enemy.activeClipName === clipName) {
    return true;
  }

  if (loop) {
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
  } else {
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
  }

  action.enabled = true;
  action.paused = false;
  action.reset().setEffectiveWeight(1);

  if (enemy.activeAction && enemy.activeAction !== action) {
    action.fadeIn(0.12);
    enemy.activeAction.fadeOut(0.12);
  }

  action.play();
  enemy.activeAction = action;
  enemy.activeClipName = clipName;
  return true;
}

function getEnemyAnimationDuration(enemy, clipName, fallbackDuration = 1) {
  const action = enemy.actions.get(clipName);
  const duration = action?.getClip?.().duration;
  return Number.isFinite(duration) && duration > 0 ? duration / Math.max(action.timeScale || 1, 0.001) : fallbackDuration;
}

function startEnemyAttack(enemy) {
  const clipName = enemy.actions.has(enemyPrimaryAttackAnimation)
    ? enemyPrimaryAttackAnimation
    : enemyFallbackAttackAnimation;
  const duration = getEnemyAnimationDuration(enemy, clipName, 0.85);

  enemy.state = "attacking";
  enemy.stateTimer = Math.max(duration, enemyAttackHitTime + 0.12);
  enemy.stateElapsed = 0;
  enemy.attackHitApplied = false;
  stopEnemyMovementSound(enemy);
  faceEnemyTowardPlayer(enemy);
  playEnemyAnimation(enemy, clipName, { loop: false, restart: true });
}

function updateEnemyAttack(enemy, delta) {
  enemy.stateElapsed += delta;
  enemy.stateTimer -= delta;
  faceEnemyTowardPlayer(enemy);

  if (!enemy.attackHitApplied && enemy.stateElapsed >= enemyAttackHitTime) {
    enemy.attackHitApplied = true;
    if (isPlayerInEnemyAttackReach(enemy)) {
      damagePlayer(enemy.attackDamage);
    }
  }

  if (enemy.stateTimer <= 0) {
    enemy.attackCooldown = enemyAttackCooldown + Math.random() * 0.35;
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle", { restart: true });
  }
}

function damagePlayer(amount) {
  if (playerControlState.dead) {
    return;
  }

  playerControlState.health = Math.max(0, playerControlState.health - amount);
  syncPlayerHealthHud();
  triggerPlayerDamageFeedback();

  if (playerControlState.health > 0) {
    playerControlState.hitReactTimer = 0.42;
    playMovement(Math.random() < 0.5 ? "Hit_A" : "Hit_B", { restart: true });
    return;
  }

  playerControlState.dead = true;
  clearPlayerMouseButtons();
  resetCorpseSearchState();
  playMovement("Death_A", { restart: true });
  const now = performance.now();
  recordCurrentFloorTime({ completed: false, now });
  stopRunTimer("dead", now);
  hideStageBanner();
  setStatus("Você morreu", "error");
  finishRun("dead");
}

function damageEnemy(enemy, amount, { source = "generic" } = {}) {
  if (!isEnemyTargetable(enemy)) {
    return false;
  }

  const previousHealth = enemy.health;
  enemy.health = Math.max(0, enemy.health - amount);
  enemy.hitReactTimer = enemyHitReactDuration;
  enemy.hitReactPhase = Math.random() * Math.PI * 2;

  if (source === "shot") {
    alertEnemy(enemy);
  }

  if (enemy.health <= 0) {
    killEnemy(enemy);
    return true;
  }

  if (source === "shot") {
    handleEnemyShotDamageThreshold(enemy, previousHealth);
  }

  return true;
}

function handleEnemyShotDamageThreshold(enemy, previousHealth) {
  if (enemy.state === "inactiveFloor" || enemy.state === "awakening") {
    return;
  }

  const halfHealth = enemy.maxHealth * 0.5;
  if (enemy.halfHealthHandled || previousHealth <= halfHealth || enemy.health > halfHealth) {
    return;
  }

  enemy.halfHealthHandled = true;

  if (enemy.canHalfHealthFall) {
    knockDownEnemy(enemy);
  }
}

function knockDownEnemy(enemy) {
  startEnemyTimedState(enemy, "falling", "Skeletons_Death", 1.1);
}

function killEnemy(enemy) {
  enemy.health = 0;
  enemy.active = false;
  stopEnemyMovementSound(enemy);
  trySpawnAmmoDrop(enemy);
  startEnemyTimedState(enemy, "dying", "Skeletons_Death", 1.1);
}

function isEnemyTargetable(enemy) {
  return Boolean(enemy?.active && enemy.state !== "dead" && enemy.state !== "dying");
}

function canEnemySeePlayer(enemy, delta = 0, { force = false } = {}) {
  const distanceToPlayer = getEnemyDistanceToPlayer(enemy);
  if (distanceToPlayer > enemyVisionDistance) {
    enemy.lineOfSightResult = false;
    enemy.lineOfSightTimer = Math.min(enemy.lineOfSightTimer, performanceProfile.enemyFarLosInterval);
    return false;
  }

  const losInterval = distanceToPlayer > enemyVisionDistance * 0.52
    ? performanceProfile.enemyFarLosInterval
    : performanceProfile.enemyLosInterval;
  enemy.lineOfSightTimer -= delta;
  if (!force && enemy.lineOfSightTimer > 0) {
    return enemy.lineOfSightResult;
  }
  enemy.lineOfSightTimer = losInterval + Math.random() * losInterval * 0.35;

  getEnemyEyePosition(enemy, enemyEyePosition);
  getPlayerTargetPosition(enemyPlayerTarget);
  const direction = enemyMoveDirection.copy(enemyPlayerTarget).sub(enemyEyePosition);
  const distance = direction.length();
  if (distance <= 0.001) {
    return true;
  }

  direction.normalize();
  enemyLineOfSightRaycaster.set(enemyEyePosition, direction);
  enemyLineOfSightRaycaster.near = 0.05;
  enemyLineOfSightRaycaster.far = Math.max(0, distance - 0.25);

  const hits = wallOccluderList.length
    ? enemyLineOfSightRaycaster.intersectObjects(wallOccluderList, false)
    : [];
  enemy.lineOfSightResult = hits.length === 0;
  return enemy.lineOfSightResult;
}

function getEnemyEyePosition(enemy, target) {
  if (enemy.hitbox) {
    target.set(
      enemy.model.position.x,
      enemy.model.position.y + enemy.hitbox.eyeOffsetY,
      enemy.model.position.z,
    );
    return target;
  }

  enemyBoundsBox.setFromObject(enemy.model);
  if (enemyBoundsBox.isEmpty()) {
    target.copy(enemy.model.position);
    target.y += 1.6;
    return target;
  }

  enemyBoundsBox.getSize(enemyBoundsSize);
  enemyBoundsBox.getCenter(target);
  target.y = enemyBoundsBox.min.y + enemyBoundsSize.y * 0.68;
  return target;
}

function getPlayerTargetPosition(target) {
  if (!characterModel) {
    target.set(0, 0, 0);
    return target;
  }

  target.copy(characterModel.position);
  target.y += 2.2;
  return target;
}

function getEnemyDistanceToPlayer(enemy) {
  if (Number.isFinite(enemy?.distanceToPlayer)) {
    return enemy.distanceToPlayer;
  }

  return computeEnemyDistanceToPlayer(enemy);
}

function refreshEnemyDistanceToPlayer(enemy) {
  enemy.distanceToPlayer = computeEnemyDistanceToPlayer(enemy);
  return enemy.distanceToPlayer;
}

function computeEnemyDistanceToPlayer(enemy) {
  if (!characterModel) {
    return Infinity;
  }

  return Math.hypot(
    characterModel.position.x - enemy.model.position.x,
    characterModel.position.z - enemy.model.position.z,
  );
}

function faceEnemyTowardPlayer(enemy) {
  if (!characterModel) {
    return;
  }

  enemyMoveDirection.set(
    characterModel.position.x - enemy.model.position.x,
    0,
    characterModel.position.z - enemy.model.position.z,
  );

  if (enemyMoveDirection.lengthSq() > 0.0001) {
    enemy.model.rotation.y = yawFromDirection(enemyMoveDirection.normalize());
  }
}

function moveEnemyTowardPlayer(enemy, delta, distanceToPlayer, { direct = false } = {}) {
  const target = getEnemyChaseTarget(enemy, delta, { direct });
  if (!target) {
    return;
  }

  moveEnemyTowardWorldPoint(
    enemy,
    delta,
    target.x,
    target.z,
    target.isPlayer ? Math.max(0, distanceToPlayer - enemyAttackRange * 0.78) : null,
  );
}

function moveEnemyTowardWorldPoint(enemy, delta, targetX, targetZ, maxStepDistance = null) {
  enemyMoveDirection.set(
    targetX - enemy.model.position.x,
    0,
    targetZ - enemy.model.position.z,
  );

  const distance = enemyMoveDirection.length();
  if (distance <= 0.0001) {
    return;
  }

  enemyMoveDirection.normalize();
  const distanceLimit = maxStepDistance === null ? distance : Math.max(0, maxStepDistance);
  const step = Math.min(enemyWalkSpeed * (enemy.speedMultiplier || 1) * delta, distanceLimit);
  if (step <= 0) {
    return;
  }

  const previousX = enemy.model.position.x;
  const previousZ = enemy.model.position.z;
  enemyNextPosition.copy(enemy.model.position).addScaledVector(enemyMoveDirection, step);
  moveEnemyWithCollision(enemy, enemyNextPosition.x, enemyNextPosition.z);

  enemyMoveDirection.set(
    enemy.model.position.x - previousX,
    0,
    enemy.model.position.z - previousZ,
  );
  if (enemyMoveDirection.lengthSq() > 0.0001) {
    enemy.movedThisFrame = true;
    enemy.model.rotation.y = yawFromDirection(enemyMoveDirection.normalize());
  }
}

function getEnemyChaseTarget(enemy, delta, { direct = false } = {}) {
  if (!characterModel) {
    return null;
  }

  if (direct) {
    clearEnemyPath(enemy);
    return {
      x: characterModel.position.x,
      z: characterModel.position.z,
      isPlayer: true,
    };
  }

  const waypoint = getEnemyPathWaypoint(enemy, delta);
  if (waypoint) {
    return waypoint;
  }

  return {
    x: characterModel.position.x,
    z: characterModel.position.z,
    isPlayer: true,
  };
}

function getEnemyPathWaypoint(enemy, delta) {
  if (!mapEditorState.appliedTiles.size) {
    clearEnemyPath(enemy);
    return null;
  }

  const startTile = getWorldTile(enemy.model.position);
  const targetTile = getWorldTile(characterModel.position);
  if (!startTile || !targetTile) {
    clearEnemyPath(enemy);
    return null;
  }

  const startKey = tileKey(startTile.x, startTile.z);
  const targetKey = tileKey(targetTile.x, targetTile.z);
  if (startKey === targetKey) {
    clearEnemyPath(enemy);
    return null;
  }

  enemy.pathRepathTimer = Math.max(0, enemy.pathRepathTimer - delta);
  if (
    enemy.pathRepathTimer <= 0
    || enemy.pathStartKey !== startKey
    || enemy.pathTargetKey !== targetKey
    || !enemy.path.length
  ) {
    enemy.path = findAppliedTilePath(startTile, targetTile);
    enemy.pathStartKey = startKey;
    enemy.pathTargetKey = targetKey;
    enemy.pathRepathTimer = enemyPathRepathInterval;
  }

  while (enemy.path.length > 0 && enemy.path[0] === startKey) {
    enemy.path.shift();
  }

  if (!enemy.path.length) {
    return null;
  }

  const waypointTile = parseTileKey(enemy.path[0]);
  const waypoint = mapTileCenterToWorld(waypointTile);
  const waypointDistance = Math.hypot(
    waypoint.x - enemy.model.position.x,
    waypoint.z - enemy.model.position.z,
  );

  if (waypointDistance <= enemyPathWaypointRadius) {
    enemy.path.shift();
    return getEnemyPathWaypoint(enemy, 0);
  }

  return {
    x: waypoint.x,
    z: waypoint.z,
    isPlayer: false,
  };
}

function clearEnemyPath(enemy) {
  enemy.path = [];
  enemy.pathStartKey = null;
  enemy.pathTargetKey = null;
  enemy.pathRepathTimer = 0;
}

function findAppliedTilePath(startTile, targetTile) {
  const startKey = tileKey(startTile.x, startTile.z);
  const targetKey = tileKey(targetTile.x, targetTile.z);
  if (
    !mapEditorState.appliedTiles.has(startKey)
    || !mapEditorState.appliedTiles.has(targetKey)
  ) {
    return [];
  }

  const queue = [startTile];
  const cameFrom = new Map([[startKey, null]]);
  for (let index = 0; index < queue.length; index += 1) {
    const tile = queue[index];
    const currentKey = tileKey(tile.x, tile.z);
    if (currentKey === targetKey) {
      break;
    }

    for (const neighbor of getCardinalNeighborTiles(tile)) {
      const neighborKey = tileKey(neighbor.x, neighbor.z);
      if (cameFrom.has(neighborKey) || !mapEditorState.appliedTiles.has(neighborKey)) {
        continue;
      }

      cameFrom.set(neighborKey, currentKey);
      queue.push(neighbor);
    }
  }

  if (!cameFrom.has(targetKey)) {
    return [];
  }

  const path = [];
  let currentKey = targetKey;
  while (currentKey && currentKey !== startKey) {
    path.push(currentKey);
    currentKey = cameFrom.get(currentKey);
  }

  path.reverse();
  return path;
}

function getWorldTile(position) {
  const point = worldToMapPoint(position);
  const x = Math.floor(point.x);
  const z = Math.floor(point.z);
  if (x < 0 || z < 0 || x >= mapSize || z >= mapSize) {
    return null;
  }

  return { x, z };
}

function moveEnemyWithCollision(enemy, nextX, nextZ) {
  if (canEnemyOccupyWorldPosition(nextX, nextZ)) {
    enemy.model.position.x = nextX;
    enemy.model.position.z = nextZ;
    return;
  }

  if (canEnemyOccupyWorldPosition(nextX, enemy.model.position.z)) {
    enemy.model.position.x = nextX;
  }

  if (canEnemyOccupyWorldPosition(enemy.model.position.x, nextZ)) {
    enemy.model.position.z = nextZ;
  }
}

function canEnemyOccupyWorldPosition(x, z) {
  const radius = enemyCollisionRadius + playerWallCollisionPadding;
  const diagonal = radius * 0.7071;
  const sampleOffsets = [
    [0, 0],
    [radius, 0],
    [-radius, 0],
    [0, radius],
    [0, -radius],
    [diagonal, diagonal],
    [-diagonal, diagonal],
    [diagonal, -diagonal],
    [-diagonal, -diagonal],
  ];

  for (const [offsetX, offsetZ] of sampleOffsets) {
    if (!isWorldPointOnAppliedTile(x + offsetX, z + offsetZ)) {
      return false;
    }
  }

  return true;
}

function isPlayerInEnemyAttackReach(enemy) {
  return getEnemyDistanceToPlayer(enemy) <= enemyAttackRange && canEnemySeePlayer(enemy, 0, { force: true });
}

function disposeObject3D(object) {
  const materials = new Set();
  const geometries = new Set();

  object.traverse((node) => {
    if (node.geometry) {
      geometries.add(node.geometry);
    }

    const nodeMaterials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of nodeMaterials) {
      if (material) {
        materials.add(material);
      }
    }
  });

  for (const geometry of geometries) {
    geometry.dispose();
  }

  for (const material of materials) {
    material.dispose();
  }
}

function setCollisionDebugEnabled(enabled) {
  collisionDebugState.enabled = Boolean(enabled);

  if (!collisionDebugState.enabled) {
    clearCollisionDebugBoxes();
  }

  syncCollisionDebugControl();
}

function syncCollisionDebugControl() {
  if (!collisionDebugInput || !collisionDebugValue) {
    return;
  }

  collisionDebugInput.checked = collisionDebugState.enabled;
  collisionDebugValue.textContent = collisionDebugState.enabled ? "Sim" : "Nao";
}

function updateCollisionDebug() {
  if (!collisionDebugState.enabled) {
    return;
  }

  const group = getCollisionDebugGroup();

  if (characterModel) {
    if (!collisionDebugState.playerBox) {
      collisionDebugState.playerBox = createCollisionDebugBox("PlayerCollisionDebug", collisionDebugPlayerColor);
      group.add(collisionDebugState.playerBox);
    }

    updateCollisionDebugBoxTransform(
      collisionDebugState.playerBox,
      characterModel,
      playerCollisionRadius + playerWallCollisionPadding,
      5.2,
    );
  } else if (collisionDebugState.playerBox) {
    removeCollisionDebugBox(collisionDebugState.playerBox);
    collisionDebugState.playerBox = null;
  }

  const liveEnemyIds = new Set();
  for (const enemy of activeEnemies) {
    liveEnemyIds.add(enemy.id);
    let debugBox = collisionDebugState.enemyBoxes.get(enemy.id);
    if (!debugBox) {
      debugBox = createCollisionDebugBox(`EnemyCollisionDebug:${enemy.id}`, collisionDebugEnemyColor);
      collisionDebugState.enemyBoxes.set(enemy.id, debugBox);
      group.add(debugBox);
    }

    updateCollisionDebugBoxTransform(
      debugBox,
      enemy.model,
      enemyCollisionRadius + playerWallCollisionPadding,
      4.68,
    );
  }

  for (const [enemyId, debugBox] of collisionDebugState.enemyBoxes) {
    if (!liveEnemyIds.has(enemyId)) {
      removeCollisionDebugBox(debugBox);
      collisionDebugState.enemyBoxes.delete(enemyId);
    }
  }
}

function getCollisionDebugGroup() {
  if (!collisionDebugState.group) {
    collisionDebugState.group = new THREE.Group();
    collisionDebugState.group.name = "RuntimeCollisionDebug";
  }

  if (!collisionDebugState.group.parent) {
    scene.add(collisionDebugState.group);
  }

  return collisionDebugState.group;
}

function createCollisionDebugBox(name, color) {
  const group = new THREE.Group();
  const fill = new THREE.Mesh(
    collisionDebugBoxGeometry,
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: collisionDebugFillOpacity,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  const edges = new THREE.LineSegments(
    collisionDebugEdgesGeometry,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: collisionDebugEdgeOpacity,
      depthTest: false,
      depthWrite: false,
    }),
  );

  group.name = name;
  fill.name = `${name}:Fill`;
  edges.name = `${name}:Edges`;
  fill.renderOrder = 50;
  edges.renderOrder = 51;
  group.add(fill, edges);
  return group;
}

function updateCollisionDebugBoxTransform(debugBox, model, radius, fallbackHeight) {
  let height = fallbackHeight;
  let centerY = fallbackHeight / 2;

  collisionDebugBoundsBox.setFromObject(model);
  if (!collisionDebugBoundsBox.isEmpty()) {
    collisionDebugBoundsBox.getSize(collisionDebugBoundsSize);
    if (Number.isFinite(collisionDebugBoundsSize.y) && collisionDebugBoundsSize.y > 0.001) {
      height = collisionDebugBoundsSize.y;
      centerY = collisionDebugBoundsBox.min.y + height / 2;
    }
  }

  debugBox.position.set(model.position.x, centerY, model.position.z);
  debugBox.scale.set(radius * 2, height, radius * 2);
}

function clearCollisionDebugBoxes() {
  if (collisionDebugState.playerBox) {
    removeCollisionDebugBox(collisionDebugState.playerBox);
    collisionDebugState.playerBox = null;
  }

  for (const debugBox of collisionDebugState.enemyBoxes.values()) {
    removeCollisionDebugBox(debugBox);
  }
  collisionDebugState.enemyBoxes.clear();

  if (collisionDebugState.group) {
    scene.remove(collisionDebugState.group);
  }
}

function removeCollisionDebugBox(debugBox) {
  debugBox.removeFromParent();
  debugBox.traverse((node) => {
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      material?.dispose?.();
    }
  });
}

function collectWallOccluders(object) {
  wallOccluders.clear();
  wallOccluderList = [];

  object.traverse((node) => {
    if (node.userData?.occludesCharacter) {
      wallOccluders.add(node);
      wallOccluderList.push(node);
    }
  });
}

function clearWallOcclusionState() {
  for (const wall of transparentWallOccluders) {
    setWallOcclusionVisible(wall, false);
  }

  transparentWallOccluders.clear();
  wallOccluders.clear();
  wallOccluderList = [];
}

function updateWallOcclusion() {
  if (!characterModel || wallOccluderList.length === 0) {
    clearTransientWallOcclusion();
    return;
  }

  getCharacterOcclusionTarget(wallOcclusionTarget);
  const rayDirection = wallOcclusionDirection.copy(wallOcclusionTarget).sub(camera.position);
  const rayDistance = rayDirection.length();

  if (rayDistance <= 0.001) {
    clearTransientWallOcclusion();
    return;
  }

  rayDirection.normalize();
  wallOcclusionRaycaster.set(camera.position, rayDirection);
  wallOcclusionRaycaster.near = 0;
  wallOcclusionRaycaster.far = rayDistance;

  wallOcclusionHitSet.clear();
  const hits = wallOcclusionRaycaster.intersectObjects(wallOccluderList, false);
  for (const hit of hits) {
    wallOcclusionHitSet.add(hit.object);
  }

  for (const wall of transparentWallOccluders) {
    if (!wallOcclusionHitSet.has(wall)) {
      setWallOcclusionVisible(wall, false);
    }
  }

  for (const wall of wallOcclusionHitSet) {
    setWallOcclusionVisible(wall, true);
  }

  transparentWallOccluders.clear();
  for (const wall of wallOcclusionHitSet) {
    transparentWallOccluders.add(wall);
  }
}

function clearTransientWallOcclusion() {
  for (const wall of transparentWallOccluders) {
    setWallOcclusionVisible(wall, false);
  }

  transparentWallOccluders.clear();
}

function getCharacterOcclusionTarget(target) {
  target.copy(characterModel?.position || cameraControlState.anchorTarget);
  target.y += 2.35;
  return target;
}

function setWallOcclusionVisible(wall, occluded) {
  const material = wall.material;
  if (!material) {
    return;
  }

  material.transparent = occluded;
  material.opacity = occluded ? wallOcclusionOpacity : 1;
  material.depthWrite = !occluded;
  material.needsUpdate = true;
}

function setupColorControls() {
  colorPanel.addEventListener("input", (event) => {
    const target = event.target;
    if (!target?.matches?.("[data-palette-color-input], [data-palette-hex-input]")) {
      return;
    }

    const slotId = target.dataset.controlId || target.dataset.slotId;
    const normalized = normalizeHexColor(target.value);

    if (!normalized) {
      target.classList.add("is-invalid");
      return;
    }

    target.classList.remove("is-invalid");
    setPaletteControlColor(slotId, normalized);
  });

  resetColorsButton.addEventListener("click", () => {
    paletteDraft = createRoguePaletteDraft();
    renderColorPanel();
    applyCharacterPalette();
    setColorStatus("Padrao");
  });

  copyColorsButton.addEventListener("click", () => {
    copyPaletteInfo();
  });
}

function setupVisualTuningControls() {
  const controls = [
    { key: "exposure", input: visualExposureInput },
    { key: "ambientLight", input: visualAmbientLightInput },
    { key: "directLight", input: visualDirectLightInput },
    { key: "lightDirection", input: visualLightDirectionInput },
    { key: "fog", input: visualFogInput },
  ];

  if (!controls.every((control) => control.input)) {
    return;
  }

  for (const control of controls) {
    control.input.addEventListener("input", () => {
      visualTuningState[control.key] = Number(control.input.value);
      applyVisualTuning();
      setVisualTuningStatus("Ajustado");
    });
  }

  copyVisualTuningButton?.addEventListener("click", () => {
    copyVisualTuningInfo();
  });

  collisionDebugInput?.addEventListener("change", () => {
    setCollisionDebugEnabled(collisionDebugInput.checked);
  });

  syncVisualTuningControls();
  syncCollisionDebugControl();
}

function renderColorPanel() {
  colorPanel.textContent = "";

  for (const control of roguePaletteControls) {
    const controlId = paletteControlId(control);
    const color = colorForPaletteControl(control);
    const row = document.createElement("label");
    row.className = "palette-row";
    row.dataset.controlId = controlId;
    if (control.slots) {
      row.dataset.slotId = control.slots[0];
      row.dataset.slotIds = control.slots.join(",");
    }
    row.style.setProperty("--swatch", color);

    const label = document.createElement("span");
    label.textContent = control.label;

    const controls = document.createElement("span");
    controls.className = "palette-controls";

    const colorInput = document.createElement("input");
    colorInput.className = "palette-color-input";
    colorInput.type = "color";
    colorInput.value = color.toLowerCase();
    colorInput.dataset.paletteColorInput = "";
    colorInput.dataset.controlId = controlId;
    colorInput.setAttribute("aria-label", control.label);

    const hexInput = document.createElement("input");
    hexInput.className = "palette-hex-input";
    hexInput.value = color;
    hexInput.maxLength = 7;
    hexInput.spellcheck = false;
    hexInput.autocomplete = "off";
    hexInput.dataset.paletteHexInput = "";
    hexInput.dataset.controlId = controlId;
    hexInput.setAttribute("aria-label", `Hex ${control.label}`);

    controls.append(colorInput, hexInput);
    row.append(label, controls);
    colorPanel.append(row);
  }
}

function setPaletteControlColor(slotId, color) {
  const control = roguePaletteControls.find((candidate) => {
    return paletteControlId(candidate) === slotId || candidate.slots?.includes(slotId);
  });
  const normalized = normalizeHexColor(color);
  if (!control || !normalized) {
    return false;
  }

  if (control.slots) {
    for (const groupedSlotId of control.slots) {
      paletteDraft[groupedSlotId] = normalized;
    }

    applyCharacterPalette();
  }

  syncPaletteControl(control, normalized);
  return true;
}

function syncPaletteControl(control, color) {
  const row = colorPanel.querySelector(`[data-control-id="${paletteControlId(control)}"]`);
  if (!row) {
    return;
  }

  row.style.setProperty("--swatch", color);
  const colorInput = row.querySelector("[data-palette-color-input]");
  const hexInput = row.querySelector("[data-palette-hex-input]");

  if (colorInput) {
    colorInput.value = color.toLowerCase();
    colorInput.classList.remove("is-invalid");
  }

  if (hexInput) {
    hexInput.value = color;
    hexInput.classList.remove("is-invalid");
  }
}

function createRoguePaletteDraft() {
  return {
    ...rogueDefaultSlots,
  };
}

function createVisualTuningState() {
  return {
    exposure: defaultToneMappingExposure,
    ambientLight: defaultAmbientLightIntensity,
    directLight: defaultDirectLightIntensity,
    lightDirection: defaultLightDirectionDegrees,
    fog: defaultFogDensity,
  };
}

function paletteControlId(control) {
  if (control.id) {
    return control.id;
  }

  if (control.slots?.length) {
    return control.slots[0];
  }

  return control.label.toLowerCase().replace(/\s+/gu, "-");
}

function colorForPaletteControl(control) {
  if (control.slots?.length) {
    return normalizeHexColor(paletteDraft[control.slots[0]]) || "#FFFFFF";
  }

  return "#FFFFFF";
}

function applyCharacterPalette() {
  if (!sourceCharacterTextureImage || paletteMaterials.size === 0) {
    setColorStatus("Aguardando");
    return false;
  }

  const nextTexture = createRoguePaletteTexture(sourceCharacterTextureImage, {
    ...rogueDefaultSlots,
    ...paletteDraft,
  });
  if (!nextTexture) {
    setColorStatus("Canvas indisponivel");
    return false;
  }

  for (const material of paletteMaterials) {
    material.map = nextTexture;
    material.needsUpdate = true;
  }

  if (activePaletteTexture) {
    activePaletteTexture.dispose();
  }

  activePaletteTexture = nextTexture;
  applyMaskAtlasPalette();
  setColorStatus("Aplicada");
  return true;
}

function applyMaskAtlasPalette() {
  if (!sourceCharacterTextureImage || maskAtlasMaterials.size === 0) {
    return false;
  }

  const nextTexture = createRoguePaletteTexture(sourceCharacterTextureImage, {
    ...rogueDefaultSlots,
    ...paletteDraft,
  });
  if (!nextTexture) {
    return false;
  }

  for (const material of maskAtlasMaterials) {
    material.map = nextTexture;
    material.needsUpdate = true;
  }

  if (activeMaskPaletteTexture) {
    activeMaskPaletteTexture.dispose();
  }

  activeMaskPaletteTexture = nextTexture;
  return true;
}

function createRoguePaletteTexture(sourceImage, slots) {
  const canvas = document.createElement("canvas");
  canvas.width = sourceImage.naturalWidth || sourceImage.width || rogueTextureAtlas.size;
  canvas.height = sourceImage.naturalHeight || sourceImage.height || rogueTextureAtlas.size;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return null;
  }

  ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

  for (const [slotId, color] of Object.entries(slots)) {
    recolorPaletteSlot(ctx, canvas, slotId, color);
  }

  const texture = new THREE.CanvasTexture(canvas);
  configureRoguePaletteTexture(texture);
  return texture;
}

function configureRoguePaletteTexture(texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 1;
  // The One RPG palette slot rows are authored for canvas textures with the default Y flip.
  texture.flipY = true;

  if (sourceCharacterTextureSettings) {
    texture.wrapS = sourceCharacterTextureSettings.wrapS;
    texture.wrapT = sourceCharacterTextureSettings.wrapT;
    texture.offset.copy(sourceCharacterTextureSettings.offset);
    texture.repeat.copy(sourceCharacterTextureSettings.repeat);
    texture.center.copy(sourceCharacterTextureSettings.center);
    texture.rotation = sourceCharacterTextureSettings.rotation;
  }

  texture.needsUpdate = true;
}

function recolorPaletteSlot(ctx, canvas, slotId, targetHex) {
  const slot = parsePaletteSlotId(slotId);
  const normalized = normalizeHexColor(targetHex);
  if (!slot || !normalized) {
    return;
  }

  const target = hexToRgb(normalized);
  const cellWidth = Math.round(canvas.width / rogueTextureAtlas.columns);
  const cellHeight = Math.round(canvas.height / rogueTextureAtlas.rows);
  const x = slot.column * cellWidth;
  const y = slot.row * cellHeight;
  const imageData = ctx.getImageData(x, y, cellWidth, cellHeight);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      continue;
    }

    data[index] = target.r;
    data[index + 1] = target.g;
    data[index + 2] = target.b;
  }

  ctx.putImageData(imageData, x, y);
}

function parsePaletteSlotId(slotId) {
  if (typeof slotId !== "string") {
    return null;
  }

  const match = slotId.match(/^r([0-7])c([0-7])$/u);
  if (!match) {
    return null;
  }

  return {
    row: Number(match[1]),
    column: Number(match[2]),
  };
}

function normalizeHexColor(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const shortMatch = trimmed.match(/^#?([0-9a-f]{3})$/iu);
  if (shortMatch) {
    return `#${shortMatch[1].split("").map((char) => `${char}${char}`).join("")}`.toUpperCase();
  }

  const fullMatch = trimmed.match(/^#?([0-9a-f]{6})$/iu);
  return fullMatch ? `#${fullMatch[1].toUpperCase()}` : null;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

async function copyPaletteInfo() {
  const controls = Object.fromEntries(
    roguePaletteControls.map((control) => [control.label, colorForPaletteControl(control)]),
  );
  const slots = Object.fromEntries(
    roguePaletteControls.flatMap((control) =>
      (control.slots || []).map((slotId) => [slotId, paletteDraft[slotId]]),
    ),
  );
  const text = JSON.stringify(
    {
      type: "hunk",
      controls,
      slots,
    },
    null,
    2,
  );

  try {
    await navigator.clipboard.writeText(text);
    setColorStatus("Copiada");
  } catch {
    copyTextFallback(text);
    setColorStatus("Copiada");
  }
}

function applyVisualTuning() {
  const values = getVisualTuningValues();
  visualTuningState = {
    exposure: values.exposure,
    ambientLight: values.ambientLight,
    directLight: values.directLight,
    lightDirection: values.lightDirection,
    fog: values.fog,
  };

  if (sceneElement) {
    sceneElement.style.filter = "";
  }

  renderer.toneMappingExposure = values.exposure;
  baseAmbientLight.intensity = values.ambientLight;
  baseDirectLight.intensity = values.directLight;
  applyDirectLightDirection(values.lightDirection);
  scene.fog = values.fog > 0 ? new THREE.FogExp2(visualFogColor, values.fog) : null;
  syncVisualTuningControls();
}

function syncVisualTuningControls() {
  if (visualExposureInput) {
    visualExposureInput.value = String(visualTuningState.exposure);
  }

  if (visualAmbientLightInput) {
    visualAmbientLightInput.value = String(visualTuningState.ambientLight);
  }

  if (visualDirectLightInput) {
    visualDirectLightInput.value = String(visualTuningState.directLight);
  }

  if (visualLightDirectionInput) {
    visualLightDirectionInput.value = String(visualTuningState.lightDirection);
  }

  if (visualFogInput) {
    visualFogInput.value = String(visualTuningState.fog);
  }

  if (visualExposureValue) {
    visualExposureValue.value = formatVisualDecimal(visualTuningState.exposure);
    visualExposureValue.textContent = formatVisualDecimal(visualTuningState.exposure);
  }

  if (visualAmbientLightValue) {
    visualAmbientLightValue.value = formatVisualDecimal(visualTuningState.ambientLight);
    visualAmbientLightValue.textContent = formatVisualDecimal(visualTuningState.ambientLight);
  }

  if (visualDirectLightValue) {
    visualDirectLightValue.value = formatVisualDecimal(visualTuningState.directLight);
    visualDirectLightValue.textContent = formatVisualDecimal(visualTuningState.directLight);
  }

  if (visualLightDirectionValue) {
    visualLightDirectionValue.value = formatVisualDegrees(visualTuningState.lightDirection);
    visualLightDirectionValue.textContent = formatVisualDegrees(visualTuningState.lightDirection);
  }

  if (visualFogValue) {
    visualFogValue.value = formatVisualFog(visualTuningState.fog);
    visualFogValue.textContent = formatVisualFog(visualTuningState.fog);
  }
}

function getVisualTuningValues() {
  const exposure = roundVisualNumber(clampFiniteNumber(visualTuningState.exposure, 0.4, 2, defaultToneMappingExposure));
  const ambientLight = roundVisualNumber(clampFiniteNumber(
    visualTuningState.ambientLight,
    0,
    3,
    defaultAmbientLightIntensity,
  ));
  const directLight = roundVisualNumber(clampFiniteNumber(
    visualTuningState.directLight,
    0,
    4,
    defaultDirectLightIntensity,
  ));
  const lightDirection = Math.round(clampFiniteNumber(
    visualTuningState.lightDirection,
    0,
    360,
    defaultLightDirectionDegrees,
  ));
  const fog = roundVisualNumber(clampFiniteNumber(visualTuningState.fog, 0, 0.05, defaultFogDensity));
  const isDefault = exposure === defaultToneMappingExposure
    && ambientLight === defaultAmbientLightIntensity
    && directLight === defaultDirectLightIntensity
    && lightDirection === defaultLightDirectionDegrees
    && fog === defaultFogDensity;

  return {
    exposure,
    ambientLight,
    directLight,
    lightDirection,
    fog,
    isDefault,
  };
}

function applyDirectLightDirection(directionDegrees) {
  const angle = THREE.MathUtils.degToRad(directionDegrees);
  const radius = platformTileSize * 4.2;

  baseDirectLight.position.set(
    Math.sin(angle) * radius,
    platformTileSize * 4.8,
    Math.cos(angle) * radius,
  );
  baseDirectLight.target.position.set(0, 0, 0);
  baseDirectLight.target.updateMatrixWorld();
}

async function copyVisualTuningInfo() {
  const values = getVisualTuningValues();
  const text = [
    "Ajustes visuais do jogo",
    `Exposicao: ${formatVisualDecimal(values.exposure)}`,
    `Luz ambiente: ${formatVisualDecimal(values.ambientLight)}`,
    `Luz direta: ${formatVisualDecimal(values.directLight)}`,
    `Direcao da luz: ${formatVisualDegrees(values.lightDirection)}`,
    `Nevoa: ${formatVisualFog(values.fog)}`,
    `renderer.toneMappingExposure: ${formatCssNumber(values.exposure)}`,
    `baseAmbientLight.intensity: ${formatCssNumber(values.ambientLight)}`,
    `baseDirectLight.intensity: ${formatCssNumber(values.directLight)}`,
    `baseDirectLight.directionDegrees: ${Math.round(values.lightDirection)}`,
    `scene.fogDensity: ${formatVisualFog(values.fog)}`,
    "",
    "JSON:",
    JSON.stringify(
      {
        type: "visual-tuning",
        values: {
          exposure: values.exposure,
          ambientLight: values.ambientLight,
          directLight: values.directLight,
          lightDirectionDegrees: values.lightDirection,
          fog: values.fog,
        },
        implementation: {
          toneMappingExposure: values.exposure,
          ambientLightIntensity: values.ambientLight,
          directLightIntensity: values.directLight,
          directLightDirectionDegrees: values.lightDirection,
          fogDensity: values.fog,
        },
      },
      null,
      2,
    ),
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    setVisualTuningStatus("Copiado");
  } catch {
    copyTextFallback(text);
    setVisualTuningStatus("Copiado");
  }
}

function setColorStatus(message) {
  colorStatus.textContent = message;
}

function setVisualTuningStatus(message) {
  if (visualTuningStatus) {
    visualTuningStatus.textContent = message;
  }
}

function clampFiniteNumber(value, min, max, fallback) {
  const number = Number(value);
  return THREE.MathUtils.clamp(Number.isFinite(number) ? number : fallback, min, max);
}

function roundVisualNumber(value) {
  return Number(Number(value).toFixed(3));
}

function formatVisualDecimal(value) {
  return Number(value).toFixed(2);
}

function formatVisualDegrees(value) {
  return `${Math.round(value)}deg`;
}

function formatVisualFog(value) {
  return Number(value).toFixed(3);
}

function formatCssNumber(value) {
  return String(Number(Number(value).toFixed(3)));
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
    configureAction(lowerAction, { ...option, loop: option.combo.lowerLoop ?? option.loop });
    configureAction(upperAction, { ...option, loop: option.combo.upperLoop ?? option.loop });
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
  if (movementSelect.value !== clipName) {
    movementSelect.value = clipName;
  }
  setMovementStatus(`Ativo: ${labelForMovement(clipName)}`);
  return true;
}

function labelForMovement(clipName) {
  return movementById.get(clipName)?.label || formatClipLabel(clipName);
}

function formatClipLabel(clipName) {
  return clipName.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
}

function createPlatform(mapSnapshot) {
  const platform = new THREE.Group();
  platform.name = "TileMapPlatform";
  const materialSelection = {
    floor: normalizeMapMaterialId("floor", mapSnapshot.materials?.floor),
    wall: normalizeMapMaterialId("wall", mapSnapshot.materials?.wall),
    ceiling: normalizeMapMaterialId("ceiling", mapSnapshot.materials?.ceiling),
  };
  const tileSize = mapSnapshot.showTileEdges ? platformTileSize - platformTileGap : platformTileSize;
  const floor = createPlatformFloor(mapSnapshot.activeTiles, materialSelection.floor, tileSize);

  const seams = mapSnapshot.showTileEdges ? createPlatformSeamLines(mapSnapshot.activeTiles) : null;
  const walls = mapSnapshot.isCovered ? createPlatformWalls(mapSnapshot.activeTiles, materialSelection.wall) : null;
  const ceiling = mapSnapshot.isCovered ? createPlatformCeiling(mapSnapshot.activeTiles, materialSelection.ceiling) : null;

  if (floor) {
    platform.add(floor);
  }

  if (seams) {
    platform.add(seams);
  }

  if (walls) {
    platform.add(walls);
  }

  if (ceiling) {
    platform.add(ceiling);
  }

  return platform;
}

function createPlatformFloor(activeTiles, materialId, tileSize) {
  const baseGeometry = new THREE.BoxGeometry(tileSize, platformThickness, tileSize);
  const geometry = createMergedTranslatedGeometry(baseGeometry, activeTiles, (tile, matrix) => {
    const worldCenter = mapTileCenterToWorld(tile);
    matrix.makeTranslation(worldCenter.x, -platformThickness / 2, worldCenter.z);
  });
  baseGeometry.dispose();

  if (!geometry) {
    return null;
  }

  const floor = new THREE.Mesh(geometry, createSewerSurfaceMaterial("floor", materialId));
  floor.name = "SewerFloorMerged";
  return configureShadowMesh(floor, { cast: false, receive: true });
}

function createMergedTranslatedGeometry(baseGeometry, activeTiles, applyTransform) {
  const geometries = [];
  const matrix = new THREE.Matrix4();

  for (const key of activeTiles) {
    const tile = parseTileKey(key);
    const geometry = baseGeometry.clone();
    applyTransform(tile, matrix);
    geometry.applyMatrix4(matrix);
    geometries.push(geometry);
  }

  if (geometries.length === 0) {
    return null;
  }

  const mergedGeometry = mergeGeometries(geometries, false);
  for (const geometry of geometries) {
    geometry.dispose();
  }

  return mergedGeometry;
}

function createSewerSurfacePlan(activeTiles) {
  return {
    floorAreaSeeds: createFloorAreaSeeds(activeTiles),
  };
}

function createFloorAreaSeeds(activeTiles) {
  const areaSeeds = new Map();
  const visited = new Set();
  const sortedKeys = [...activeTiles].sort((a, b) => {
    const tileA = parseTileKey(a);
    const tileB = parseTileKey(b);
    return tileA.z - tileB.z || tileA.x - tileB.x;
  });

  for (const key of sortedKeys) {
    if (visited.has(key)) {
      continue;
    }

    const startTile = parseTileKey(key);
    const zoneKind = getFloorZoneKind(activeTiles, startTile);
    const queue = [startTile];
    const areaKeys = [];
    const bounds = {
      minX: startTile.x,
      maxX: startTile.x,
      minZ: startTile.z,
      maxZ: startTile.z,
    };
    visited.add(key);

    while (queue.length > 0) {
      const tile = queue.shift();
      const currentKey = tileKey(tile.x, tile.z);
      areaKeys.push(currentKey);
      bounds.minX = Math.min(bounds.minX, tile.x);
      bounds.maxX = Math.max(bounds.maxX, tile.x);
      bounds.minZ = Math.min(bounds.minZ, tile.z);
      bounds.maxZ = Math.max(bounds.maxZ, tile.z);

      for (const neighbor of getCardinalNeighborTiles(tile)) {
        const neighborKey = tileKey(neighbor.x, neighbor.z);
        if (
          visited.has(neighborKey) ||
          !activeTiles.has(neighborKey) ||
          getFloorZoneKind(activeTiles, neighbor) !== zoneKind
        ) {
          continue;
        }

        visited.add(neighborKey);
        queue.push(neighbor);
      }
    }

    const seed = [
      "floor-area",
      zoneKind,
      bounds.minX,
      bounds.maxX,
      bounds.minZ,
      bounds.maxZ,
      areaKeys.length,
    ].join(":");

    for (const areaKey of areaKeys) {
      areaSeeds.set(areaKey, seed);
    }
  }

  return areaSeeds;
}

function getFloorZoneKind(activeTiles, tile) {
  const north = activeTiles.has(tileKey(tile.x, tile.z - 1));
  const east = activeTiles.has(tileKey(tile.x + 1, tile.z));
  const south = activeTiles.has(tileKey(tile.x, tile.z + 1));
  const west = activeTiles.has(tileKey(tile.x - 1, tile.z));
  const neighborCount = Number(north) + Number(east) + Number(south) + Number(west);
  const horizontalRun = countTileRun(activeTiles, tile, "x");
  const verticalRun = countTileRun(activeTiles, tile, "z");

  if (neighborCount <= 2) {
    return horizontalRun >= verticalRun ? "corridor-x" : "corridor-z";
  }

  if (
    neighborCount === 3 &&
    Math.max(horizontalRun, verticalRun) >= 4 &&
    Math.abs(horizontalRun - verticalRun) >= 2
  ) {
    return horizontalRun > verticalRun ? "corridor-x" : "corridor-z";
  }

  return "room";
}

function countTileRun(activeTiles, tile, axis) {
  const step = axis === "x" ? { x: 1, z: 0 } : { x: 0, z: 1 };
  let count = 1;

  for (const direction of [-1, 1]) {
    let x = tile.x + step.x * direction;
    let z = tile.z + step.z * direction;
    while (activeTiles.has(tileKey(x, z))) {
      count += 1;
      x += step.x * direction;
      z += step.z * direction;
    }
  }

  return count;
}

function getCardinalNeighborTiles(tile) {
  return [
    { x: tile.x, z: tile.z - 1 },
    { x: tile.x + 1, z: tile.z },
    { x: tile.x, z: tile.z + 1 },
    { x: tile.x - 1, z: tile.z },
  ];
}

function createSewerSurfaceMaterial(surface, materialId) {
  const variant = getSewerSurfaceVariant(surface, materialId);
  return new THREE.MeshStandardMaterial({
    color: variant.color ?? 0xffffff,
    map: variant.texture,
    roughness: variant.roughness ?? 0.94,
    metalness: variant.metalness ?? 0.02,
  });
}

function configureShadowMesh(mesh, { cast = true, receive = true } = {}) {
  mesh.castShadow = Boolean(cast && performanceProfile.shadowsEnabled);
  mesh.receiveShadow = Boolean(receive && performanceProfile.shadowsEnabled);
  return mesh;
}

function getSewerSurfaceVariant(surface, materialId) {
  const variants = sewerSurfaceVariants[surface] || sewerSurfaceVariants.floor;
  return variants.find((variant) => variant.id === materialId)
    || sewerMaterialVariants.find((variant) => variant.id === materialId)
    || variants[0]
    || sewerMaterialVariants[0];
}

function pickSewerSurfaceVariant(surface, seed) {
  const variants = sewerSurfaceVariants[surface] || sewerSurfaceVariants.floor;
  const hash = hashSurfaceSeed(seed);
  return variants[hash % variants.length];
}

function hashSurfaceSeed(seed) {
  const text = String(seed);
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createPlatformSeamLines(activeTiles) {
  const positions = [];

  for (const key of activeTiles) {
    const tile = parseTileKey(key);
    const center = mapTileCenterToWorld(tile);
    const minX = center.x - platformTileSize / 2;
    const maxX = center.x + platformTileSize / 2;
    const minZ = center.z - platformTileSize / 2;
    const maxZ = center.z + platformTileSize / 2;

    positions.push(minX, 0.014, minZ, maxX, 0.014, minZ);
    positions.push(maxX, 0.014, minZ, maxX, 0.014, maxZ);
    positions.push(maxX, 0.014, maxZ, minX, 0.014, maxZ);
    positions.push(minX, 0.014, maxZ, minX, 0.014, minZ);
  }

  if (positions.length === 0) {
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0xe6d078 }));
}

function createPlatformCeiling(activeTiles, materialId) {
  const ceilingGeometry = new THREE.BoxGeometry(
    platformTileSize,
    platformCeilingThickness,
    platformTileSize,
  );
  const geometry = createMergedTranslatedGeometry(ceilingGeometry, activeTiles, (tile, matrix) => {
    const center = mapTileCenterToWorld(tile);
    matrix.makeTranslation(center.x, platformWallHeight + platformCeilingThickness / 2, center.z);
  });
  ceilingGeometry.dispose();

  if (!geometry) {
    return null;
  }

  const ceiling = new THREE.Mesh(geometry, createSewerSurfaceMaterial("ceiling", materialId));
  ceiling.name = "SewerCeilingMerged";
  return configureShadowMesh(ceiling);
}

function createPlatformWalls(activeTiles, materialId) {
  const walls = new THREE.Group();
  walls.name = "PerimeterWalls";

  for (const run of createBoundaryWallRuns(activeTiles)) {
    const wall = createPlatformWallRunMesh(run, materialId);
    wall.userData.occludesCharacter = true;
    walls.add(wall);
  }

  if (walls.children.length === 0) {
    return null;
  }

  return walls;
}

function createBoundaryWallRuns(activeTiles) {
  const runs = [];

  for (const key of activeTiles) {
    const tile = parseTileKey(key);
    for (const side of ["north", "east", "south", "west"]) {
      if (!hasBoundaryWall(activeTiles, tile, side)) {
        continue;
      }

      runs.push(createBoundaryWallRun(activeTiles, tile, side));
    }
  }

  return runs;
}

function createBoundaryWallRun(activeTiles, tile, side) {
  if (side === "north" || side === "south") {
    const boundaryZ = side === "north" ? tile.z : tile.z + 1;
    return {
      orientation: "x",
      width: platformTileSize,
      depth: platformWallThickness,
      x: (tile.x + 0.5 - mapCenter) * platformTileSize,
      z: (boundaryZ - mapCenter) * platformTileSize,
    };
  }

  const boundaryX = side === "west" ? tile.x : tile.x + 1;
  return {
    orientation: "z",
    width: platformWallThickness,
    depth: platformTileSize,
    x: (boundaryX - mapCenter) * platformTileSize,
    z: (tile.z + 0.5 - mapCenter) * platformTileSize,
  };
}

function createPlatformWallRunMesh(run, materialId) {
  const geometry = new THREE.BoxGeometry(run.width, platformWallHeight, run.depth);
  const wall = new THREE.Mesh(geometry, createSewerSurfaceMaterial("wall", materialId));
  wall.name = `PerimeterWallRun:${run.orientation}`;
  wall.position.set(run.x, platformWallHeight / 2, run.z);
  return configureShadowMesh(wall);
}

function getWallRunSeed(activeTiles, tile, side) {
  if (side === "north" || side === "south") {
    let startX = tile.x;
    let endX = tile.x;

    while (hasBoundaryWall(activeTiles, { x: startX - 1, z: tile.z }, side)) {
      startX -= 1;
    }

    while (hasBoundaryWall(activeTiles, { x: endX + 1, z: tile.z }, side)) {
      endX += 1;
    }

    const boundaryZ = side === "north" ? tile.z : tile.z + 1;
    return ["wall-run-x", side, boundaryZ, startX, endX].join(":");
  }

  let startZ = tile.z;
  let endZ = tile.z;

  while (hasBoundaryWall(activeTiles, { x: tile.x, z: startZ - 1 }, side)) {
    startZ -= 1;
  }

  while (hasBoundaryWall(activeTiles, { x: tile.x, z: endZ + 1 }, side)) {
    endZ += 1;
  }

  const boundaryX = side === "west" ? tile.x : tile.x + 1;
  return ["wall-run-z", side, boundaryX, startZ, endZ].join(":");
}

function hasBoundaryWall(activeTiles, tile, side) {
  if (!activeTiles.has(tileKey(tile.x, tile.z))) {
    return false;
  }

  const neighbor = {
    north: { x: tile.x, z: tile.z - 1 },
    east: { x: tile.x + 1, z: tile.z },
    south: { x: tile.x, z: tile.z + 1 },
    west: { x: tile.x - 1, z: tile.z },
  }[side];

  return !activeTiles.has(tileKey(neighbor.x, neighbor.z));
}

function prepareModel(model) {
  model.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    node.castShadow = false;
    node.receiveShadow = false;
    node.frustumCulled = true;

    const maskAtlasTarget = isMaskAtlasTarget(node);
    if (maskAtlasTarget) {
      node.material = cloneMaterialCollection(node.material);
    }

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (material) {
        if (material.map?.image) {
          if (maskAtlasTarget) {
            maskAtlasMaterials.add(material);
          } else {
            paletteMaterials.add(material);
          }
        }

        if (!sourceCharacterTextureImage && material.map?.image) {
          sourceCharacterTextureImage = material.map.image;
          sourceCharacterTextureSettings = snapshotTextureSettings(material.map);
        }

        material.needsUpdate = true;
      }
    }
  });
}

function prepareStaticModel(model) {
  model.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    node.castShadow = false;
    node.receiveShadow = false;
    node.frustumCulled = false;

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (material) {
        material.needsUpdate = true;
      }
    }
  });
}

function groundEnemyModel(model) {
  model.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(model);
  if (box.isEmpty()) {
    return;
  }

  model.position.y -= box.min.y;
}

function fitEnemyModelToTile(model) {
  const sourceBox = new THREE.Box3().setFromObject(model);
  const sourceSize = sourceBox.getSize(new THREE.Vector3());

  if (!Number.isFinite(sourceSize.y) || sourceSize.y <= 0) {
    return;
  }

  const targetHeight = 4.68;
  const maxFootprint = Math.max(sourceSize.x, sourceSize.z);
  let scale = targetHeight / Math.max(sourceSize.y, 0.001);
  if (maxFootprint * scale > platformTileSize * 0.9) {
    scale = (platformTileSize * 0.9) / maxFootprint;
  }

  model.scale.setScalar(THREE.MathUtils.clamp(scale, 0.001, 1000));

  const fittedBox = new THREE.Box3().setFromObject(model);
  const fittedCenter = fittedBox.getCenter(new THREE.Vector3());
  model.position.x -= fittedCenter.x;
  model.position.z -= fittedCenter.z;
  model.position.y -= fittedBox.min.y;
}

function cloneMaterialCollection(material) {
  if (Array.isArray(material)) {
    return material.map((entry) => entry?.clone?.() || entry);
  }

  return material?.clone?.() || material;
}

function isMaskAtlasTarget(node) {
  const name = `${node.name || ""} ${node.geometry?.name || ""}`.toLowerCase();
  return name.includes("roguehooded_mask");
}

function snapshotTextureSettings(texture) {
  return {
    wrapS: texture.wrapS,
    wrapT: texture.wrapT,
    offset: texture.offset.clone(),
    repeat: texture.repeat.clone(),
    center: texture.center.clone(),
    rotation: texture.rotation,
  };
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

function frameScene() {
  if (characterModel) {
    const characterBox = new THREE.Box3().setFromObject(characterModel);
    if (!characterBox.isEmpty()) {
      frameModel(characterBox);
      return;
    }
  }

  if (platformGroup) {
    const platformBox = new THREE.Box3().setFromObject(platformGroup);
    if (!platformBox.isEmpty()) {
      frameModel(platformBox);
    }
  }
}

function frameModel(modelBox) {
  const size = modelBox.getSize(new THREE.Vector3());
  const center = modelBox.getCenter(new THREE.Vector3());
  const target = new THREE.Vector3(center.x, Math.max(1.45, Math.min(size.y * 0.45, 2.7)), center.z);
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const viewHeight = Math.max(size.y * 1.22, 7.2);
  const viewWidth = Math.max(Math.max(size.x, size.z) * 1.2, platformTileSize * 2.4);
  const distanceForHeight = viewHeight / (2 * Math.tan(verticalFov / 2));
  const distanceForWidth = viewWidth / (2 * Math.tan(verticalFov / 2) * Math.max(camera.aspect, 0.32));
  const distance = Math.max(distanceForHeight, distanceForWidth);
  cameraControlState.anchorTarget.copy(target);
  cameraControlState.anchorDistance = distance;

  camera.far = Math.max(120, distance * 2.6);
  camera.updateProjectionMatrix();

  controls.minDistance = Math.max(3.5, Math.min(distance * 0.2, 12));
  controls.maxDistance = Math.max(18, distance * 1.7);
  applyAnchoredCameraFrame();
  syncCameraControlUI();
}

function resize() {
  const width = Math.max(sceneElement.clientWidth, 1);
  const height = Math.max(sceneElement.clientHeight, 1);

  renderer.setSize(width, height, false);
  renderer.setPixelRatio(getRuntimePixelRatio());
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function createPerfOverlayState() {
  if (!performanceProfile.perfOverlayEnabled) {
    return { enabled: false };
  }

  const element = document.createElement("div");
  element.setAttribute("aria-hidden", "true");
  element.style.cssText = [
    "position:fixed",
    "right:10px",
    "bottom:10px",
    "z-index:50",
    "min-width:168px",
    "padding:8px 10px",
    "border:1px solid rgba(255,255,255,0.18)",
    "background:rgba(4,8,6,0.78)",
    "color:#d8ffe1",
    "font:12px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace",
    "white-space:pre",
    "pointer-events:none",
    "box-shadow:0 8px 24px rgba(0,0,0,0.34)",
  ].join(";");
  document.body.appendChild(element);

  return {
    enabled: true,
    element,
    frames: 0,
    elapsed: 0,
    frameMsTotal: 0,
    frameMsMax: 0,
    lastShotMs: 0,
  };
}

function updatePerfOverlay(delta) {
  if (!perfOverlayState?.enabled) {
    return;
  }

  const frameMs = delta * 1000;
  perfOverlayState.frames += 1;
  perfOverlayState.elapsed += delta;
  perfOverlayState.frameMsTotal += frameMs;
  perfOverlayState.frameMsMax = Math.max(perfOverlayState.frameMsMax, frameMs);

  if (perfOverlayState.elapsed < 0.5) {
    return;
  }

  const fps = perfOverlayState.frames / perfOverlayState.elapsed;
  const avgMs = perfOverlayState.frameMsTotal / Math.max(1, perfOverlayState.frames);
  const renderInfo = renderer.info.render;
  const memoryInfo = renderer.info.memory;
  perfOverlayState.element.textContent = [
    `FPS ${fps.toFixed(0)}  avg ${avgMs.toFixed(1)}ms`,
    `max ${perfOverlayState.frameMsMax.toFixed(1)}ms shot ${perfOverlayState.lastShotMs.toFixed(1)}ms`,
    `calls ${renderInfo.calls} tris ${renderInfo.triangles}`,
    `geo ${memoryInfo.geometries} tex ${memoryInfo.textures}`,
    `mobile ${runtimeIsMobile ? "on" : "off"} shadows ${performanceProfile.shadowsEnabled ? "on" : "off"}`,
  ].join("\n");

  perfOverlayState.frames = 0;
  perfOverlayState.elapsed = 0;
  perfOverlayState.frameMsTotal = 0;
  perfOverlayState.frameMsMax = 0;
}

function recordProjectileShotPerf(startTime) {
  if (!perfOverlayState?.enabled || !startTime) {
    return;
  }

  perfOverlayState.lastShotMs = performance.now() - startTime;
}

function setStatus(message, state = "loading") {
  statusTextElement.textContent = message;
  statusElement.classList.toggle("is-error", state === "error");
  statusElement.classList.remove("is-hidden");
}

function getStatusMessage() {
  return statusTextElement.textContent;
}

function setMovementStatus(message) {
  movementStatus.textContent = message;
}

function setWeaponStatus(message) {
  weaponStatus.textContent = message;
}

function syncPlayerHealthHud() {
  if (!healthHudElement && !healthBarFillElement) {
    return;
  }

  const healthRatio = THREE.MathUtils.clamp(
    playerControlState.health / Math.max(playerControlState.maxHealth, 1),
    0,
    1,
  );
  if (healthBarFillElement) {
    healthBarFillElement.style.width = `${healthRatio * 100}%`;
  }
  if (healthHudElement) {
    healthHudElement.setAttribute("aria-label", `Vida ${Math.ceil(playerControlState.health)}`);
  }
}

function syncPlayerAmmoHud() {
  if (!ammoHudElement && !ammoCountElement) {
    return;
  }

  const weaponId = getActiveCombatWeaponId();
  const config = getCombatWeaponConfig(weaponId);
  const ammo = THREE.MathUtils.clamp(
    Math.floor(getCombatWeaponAmmo(weaponId)),
    0,
    config.maxAmmo,
  );
  playerControlState.ammo = ammo;
  if (ammoCountElement) {
    ammoCountElement.textContent = String(ammo);
  }
  if (ammoHudElement) {
    ammoHudElement.classList.toggle("is-empty", ammo <= 0);
    ammoHudElement.classList.toggle("is-weapon-pistol", weaponId === defaultCombatWeaponId);
    ammoHudElement.classList.toggle("is-weapon-shotgun", weaponId === shotgunCombatWeaponId);
    ammoHudElement.setAttribute("aria-label", `Municao ${ammo}`);
  }
}

function syncWeaponSlotHud() {
  if (!weaponSlotHudElement && weaponSlotElements.length === 0) {
    return;
  }

  const activeWeaponId = getActiveCombatWeaponId();
  const unlockedWeaponCount = combatWeaponConfigs
    .filter((config) => isCombatWeaponUnlocked(config.id))
    .length;
  const showWeaponSlots = unlockedWeaponCount > 1;
  let visibleSlotCount = 0;
  for (const element of weaponSlotElements) {
    const weaponId = element.dataset.combatWeaponSlot;
    const unlocked = isCombatWeaponUnlocked(weaponId);
    element.hidden = !showWeaponSlots || !unlocked;
    element.classList.toggle("is-unlocked", unlocked);
    element.classList.toggle("is-active", unlocked && weaponId === activeWeaponId);
    element.setAttribute("aria-disabled", unlocked ? "false" : "true");
    if (showWeaponSlots && unlocked) {
      visibleSlotCount += 1;
    }
  }

  if (weaponSlotHudElement) {
    weaponSlotHudElement.hidden = visibleSlotCount === 0;
  }
}

function getCombatWeaponConfig(weaponId = getActiveCombatWeaponId()) {
  return combatWeaponConfigById.get(weaponId) || combatWeaponConfigById.get(defaultCombatWeaponId);
}

function getActiveCombatWeaponId() {
  return combatWeaponConfigById.has(activeWeapon?.id)
    ? activeWeapon.id
    : defaultCombatWeaponId;
}

function isCombatWeaponUnlocked(weaponId) {
  return Boolean(playerControlState.unlockedWeapons?.has?.(weaponId));
}

function unlockCombatWeapon(weaponId, { ammo = null } = {}) {
  const config = combatWeaponConfigById.get(weaponId);
  if (!config) {
    return false;
  }

  playerControlState.unlockedWeapons.add(weaponId);
  if (ammo !== null) {
    setCombatWeaponAmmo(weaponId, Math.max(getCombatWeaponAmmo(weaponId), ammo));
  }
  syncWeaponSlotHud();
  syncPlayerAmmoHud();
  return true;
}

function getCombatWeaponAmmo(weaponId) {
  const config = getCombatWeaponConfig(weaponId);
  return THREE.MathUtils.clamp(
    Math.floor(playerControlState.ammoByWeapon?.[config.id] ?? config.startingAmmo),
    0,
    config.maxAmmo,
  );
}

function setCombatWeaponAmmo(weaponId, amount) {
  const config = getCombatWeaponConfig(weaponId);
  playerControlState.ammoByWeapon[config.id] = THREE.MathUtils.clamp(
    Math.floor(amount),
    0,
    config.maxAmmo,
  );
  if (config.id === getActiveCombatWeaponId()) {
    playerControlState.ammo = playerControlState.ammoByWeapon[config.id];
  }
}

function addCombatWeaponAmmo(weaponId, amount) {
  setCombatWeaponAmmo(weaponId, getCombatWeaponAmmo(weaponId) + amount);
  if (amount > 0) {
    playAmmoReloadSound();
  }
}

function triggerPlayerDamageFeedback() {
  if (!phoneShellElement || !damageFlashElement) {
    return;
  }

  phoneShellElement.classList.remove("is-player-hit");
  window.requestAnimationFrame(() => {
    phoneShellElement.classList.add("is-player-hit");
    window.setTimeout(() => {
      phoneShellElement.classList.remove("is-player-hit");
    }, 120);
  });
}

function hideStatus() {
  statusElement.classList.add("is-hidden");
}

function syncCrosshair() {
  if (!crosshairElement) {
    return;
  }

  const canShowCrosshair = Boolean(
    characterModel
      && !isGameplayInputLocked()
      && !cameraControlState.freeCamera
      && !playerControlState.dead,
  );
  const isVisible = canShowCrosshair && (runtimeIsMobile || playerControlState.aiming);
  crosshairElement.classList.toggle("is-visible", isVisible);
  crosshairElement.classList.toggle("is-firing", isVisible && playerControlState.shooting);
  crosshairElement.classList.toggle("is-shotgun", getActiveCombatWeaponId() === shotgunCombatWeaponId);
}
