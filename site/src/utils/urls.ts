const basePath = import.meta.env.BASE_URL;

export function getRecipeListingUrl() {
  return `${basePath}recipes`;
}

export function getRecipeUrl(slug: string) {
  return `${basePath}recipes/${slug}`;
}

export function getMenuListingUrl() {
  return `${basePath}menus`;
}

export function getMenuUrl(slug: string) {
  return `${basePath}menus/${slug}`;
}
