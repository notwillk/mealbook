import type { Menu as MenuSchema } from "../types/schema";

import {
  DollarSign,
  Clock,
  Leaf,
  Tag,
  Globe,
  UtensilsCrossed,
} from "lucide-react";
import MenuLinks from "./MenuLinks";

type Props = {
  menu: MenuSchema;
  url: string | null;
};

interface Offer {
  "@type"?: "Offer";
  price?: string | number;
  priceCurrency?: string;
  availabilityStarts?: string;
  availabilityEnds?: string;
}

interface NutritionInformation {
  "@type"?: "NutritionInformation";
  calories?: string;
  fatContent?: string;
  fiberContent?: string;
  proteinContent?: string;
}

interface MenuItem {
  "@type"?: "MenuItem";
  name: string;
  description?: string;
  image?: string | string[];
  nutrition?: NutritionInformation;
  offers?: Offer;
  suitableForDiet?: string;
}

interface MenuSubSection {
  "@type"?: "MenuSection";
  name: string;
  description?: string;
  image?: string | string[];
  offers?: Offer;
  hasMenuItem?: MenuItem | MenuItem[];
}

interface MenuSection {
  "@type"?: "MenuSection";
  name: string;
  description?: string;
  image?: string | string[];
  offers?: Offer;
  hasMenuItem?: MenuItem | MenuItem[];
  hasMenuSection?: MenuSubSection | MenuSubSection[];
}

interface Menu {
  "@context"?: string;
  "@type"?: "Menu";
  name?: string;
  description?: string;
  image?: string | string[];
  inLanguage?: string;
  hasMenuSection: MenuSection | MenuSection[];
  hasMenuItem?: MenuItem | MenuItem[];
  offers?: Offer;
}

interface Restaurant {
  "@context": string;
  "@type": "Restaurant";
  name: string;
  description?: string;
  url?: string;
  image?: string | string[];
  servesCuisine?: string | string[];
  hasMenu: Menu | Menu[];
}

function getDietLabel(diet: string): string {
  const dietMap: Record<string, string> = {
    DiabeticDiet: "Diabetic Friendly",
    GlutenFreeDiet: "Gluten Free",
    HalalDiet: "Halal",
    KosherDiet: "Kosher",
    LowCalorieDiet: "Low Calorie",
    LowFatDiet: "Low Fat",
    LowLactoseDiet: "Low Lactose",
    LowSaltDiet: "Low Salt",
    VeganDiet: "Vegan",
    VegetarianDiet: "Vegetarian",
  };
  return dietMap[diet] || diet.replace(/([A-Z])/g, " $1").trim();
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const images = Array.isArray(item.image)
    ? item.image
    : item.image
      ? [item.image]
      : [];

  return (
    <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {images.length > 0 && (
          <img
            src={images[0] || "/placeholder.svg"}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-foreground text-balance">
              {item.name}
            </h4>
            {item.offers?.price && (
              <div className="flex items-center gap-1 text-primary font-semibold flex-shrink-0">
                <DollarSign className="w-4 h-4" />
                <span>
                  {item.offers.price}
                  {item.offers.priceCurrency && ` ${item.offers.priceCurrency}`}
                </span>
              </div>
            )}
          </div>

          {item.description && (
            <p className="text-sm text-muted-foreground mb-2 text-pretty">
              {item.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {item.suitableForDiet && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/50 text-accent-foreground rounded-full text-xs">
                <Leaf className="w-3 h-3" />
                {getDietLabel(item.suitableForDiet)}
              </span>
            )}
            {item.nutrition?.calories && (
              <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                {item.nutrition.calories}
              </span>
            )}
          </div>

          {item.offers &&
            (item.offers.availabilityStarts ||
              item.offers.availabilityEnds) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Clock className="w-3 h-3" />
                <span>
                  Available: {item.offers.availabilityStarts || "Now"} -{" "}
                  {item.offers.availabilityEnds || "Ongoing"}
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function MenuSubSectionComponent({
  subsection,
}: {
  subsection: MenuSubSection;
}) {
  const items = Array.isArray(subsection.hasMenuItem)
    ? subsection.hasMenuItem
    : subsection.hasMenuItem
      ? [subsection.hasMenuItem]
      : [];

  return (
    <div className="ml-6 mt-4 space-y-3">
      <h4 className="text-lg font-semibold text-foreground">
        {subsection.name}
      </h4>
      {subsection.description && (
        <p className="text-sm text-muted-foreground mb-3">
          {subsection.description}
        </p>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <MenuItemCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

function MenuSectionComponent({ section }: { section: MenuSection }) {
  const items = Array.isArray(section.hasMenuItem)
    ? section.hasMenuItem
    : section.hasMenuItem
      ? [section.hasMenuItem]
      : [];
  const subsections = Array.isArray(section.hasMenuSection)
    ? section.hasMenuSection
    : section.hasMenuSection
      ? [section.hasMenuSection]
      : [];
  const images = Array.isArray(section.image)
    ? section.image
    : section.image
      ? [section.image]
      : [];

  return (
    <div className="mb-8">
      {images.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={images[0] || "/placeholder.svg"}
            alt={section.name}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {section.name}
          </h3>
          {section.description && (
            <p className="text-muted-foreground text-pretty">
              {section.description}
            </p>
          )}
        </div>
        {section.offers?.price && (
          <div className="flex items-center gap-1 text-primary font-bold text-lg flex-shrink-0">
            <DollarSign className="w-5 h-5" />
            <span>
              {section.offers.price}
              {section.offers.priceCurrency &&
                ` ${section.offers.priceCurrency}`}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <MenuItemCard key={index} item={item} />
        ))}
      </div>

      {subsections.length > 0 && (
        <div className="mt-6 space-y-4">
          {subsections.map((subsection, index) => (
            <MenuSubSectionComponent key={index} subsection={subsection} />
          ))}
        </div>
      )}
    </div>
  );
}

function MenuComponent({ menu }: { menu: Menu }) {
  const sections = Array.isArray(menu.hasMenuSection)
    ? menu.hasMenuSection
    : [menu.hasMenuSection];
  const directItems = Array.isArray(menu.hasMenuItem)
    ? menu.hasMenuItem
    : menu.hasMenuItem
      ? [menu.hasMenuItem]
      : [];
  const images = Array.isArray(menu.image)
    ? menu.image
    : menu.image
      ? [menu.image]
      : [];

  return (
    <div className="space-y-6">
      {images.length > 0 && (
        <div className="relative h-64 md:h-80 bg-muted rounded-lg overflow-hidden">
          <img
            src={images[0] || "/placeholder.svg"}
            alt={menu.name || "Menu"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {menu.name && (
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            {menu.name}
          </h2>
          {menu.description && (
            <p className="text-lg text-muted-foreground text-pretty">
              {menu.description}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        {menu.inLanguage && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>{menu.inLanguage}</span>
          </div>
        )}
        {menu.offers?.price && (
          <div className="flex items-center gap-1.5 text-primary font-semibold">
            <Tag className="w-4 h-4" />
            <span>
              Starting at {menu.offers.price}
              {menu.offers.priceCurrency && ` ${menu.offers.priceCurrency}`}
            </span>
          </div>
        )}
      </div>

      {directItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">Featured Items</h3>
          {directItems.map((item, index) => (
            <MenuItemCard key={index} item={item} />
          ))}
        </div>
      )}

      <div className="space-y-8 pt-4">
        {sections.map((section, index) => (
          <MenuSectionComponent key={index} section={section} />
        ))}
      </div>
    </div>
  );
}

export default function MenuDetail({ menu, url }: Props) {
  // Check if it's a Restaurant or Menu
  if ("@type" in menu && menu["@type"] === "Restaurant") {
    const restaurant = menu as Restaurant;
    const menus = Array.isArray(restaurant.hasMenu)
      ? restaurant.hasMenu
      : [restaurant.hasMenu];
    const images = Array.isArray(restaurant.image)
      ? restaurant.image
      : restaurant.image
        ? [restaurant.image]
        : [];
    const cuisines = Array.isArray(restaurant.servesCuisine)
      ? restaurant.servesCuisine
      : restaurant.servesCuisine
        ? [restaurant.servesCuisine]
        : [];

    return (
      <div className="max-w-5xl mx-auto bg-background">
        {images.length > 0 && (
          <div className="relative h-72 md:h-96 bg-muted rounded-lg overflow-hidden mb-8">
            <img
              src={images[0] || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {restaurant.name}
          </h1>
          {restaurant.description && (
            <p className="text-lg text-muted-foreground mb-4 text-pretty">
              {restaurant.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {cuisines.length > 0 && (
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {cuisines.map((cuisine, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-12">
          {menus.map((menu, index) => (
            <div
              key={index}
              className="border-t border-border pt-8 first:border-t-0 first:pt-0"
            >
              <MenuComponent menu={menu} />
            </div>
          ))}
        </div>
        <MenuLinks rawUrl={url} sourceUrl={restaurant.url} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-background">
      <MenuComponent menu={menu as Menu} />
      <MenuLinks rawUrl={url} />
    </div>
  );
}
