const registry = {};

export function registerModule(category, module, features = []) {
  if (!registry[category]) registry[category] = {};
  registry[category][module] = {
    enabled: true,
    features: features.map(name => ({ name, enabled: true }))
  };
}

export function toggleFeature(category, module, feature, state) {
  const mod = registry[category]?.[module];
  if (!mod) return;
  const f = mod.features.find(f => f.name === feature);
  if (f) f.enabled = state;
}

export function toggleModule(category, module, state) {
  const mod = registry[category]?.[module];
  if (mod) mod.enabled = state;
}

export function toggleCategory(category, state) {
  if (registry[category]) registry[category].enabled = state;
}

export function getRegistry() {
  return registry;
}

export async function loadScript(url) {
  await import(url);
}
