#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-./schemas}"
mkdir -p "$OUT_DIR"
OUT_DIR_ABS="$(cd "$OUT_DIR" && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

# --- Dockerfile ---
cat > "$TMP_DIR/Dockerfile" <<'EOF'
FROM node:20-alpine
RUN apk add --no-cache git
WORKDIR /app

# 1) Clone community Schema.org → JSON Schema generator
RUN git clone --depth=1 https://github.com/charlestati/schema-org-json-schemas repo

# 2) Build the generated JSON Schemas into /app/repo/schemas
WORKDIR /app/repo
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
RUN node build_schemas.js

# 3) Install a bundler that can dereference custom "schema:*" refs
WORKDIR /app
RUN npm init -y >/dev/null 2>&1
RUN npm install @apidevtools/json-schema-ref-parser@13

# 4) Bundling script
COPY bundle.cjs /app/bundle.cjs

# 5) Run: writes /out/recipe.schema.json and /out/menu.schema.json
CMD ["node", "/app/bundle.cjs"]
EOF

# --- bundle.cjs ---
cat > "$TMP_DIR/bundle.cjs" <<'EOF'
const fs = require("fs");
const path = require("path");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

const REPO_DIR = "/app/repo/schemas";
const OUT_DIR  = "/out";
const TARGETS  = ["Recipe", "Menu"];

// Build an index mapping both $id (e.g. "schema:Recipe") and filenames (Recipe, recipe)
// to absolute file paths.
const index = new Map();
for (const f of fs.readdirSync(REPO_DIR)) {
  if (!f.endsWith(".json")) continue;
  const p = path.join(REPO_DIR, f);
  try {
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    if (j.$id) {
      index.set(j.$id, p);
      if (j.$id.startsWith("https://schema.org/")) {
        const name = j.$id.slice("https://schema.org/".length);
        index.set(`schema:${name}`, p);
        index.set(`schema:${name.toLowerCase()}`, p);
      }
    }
  } catch {}
  const base = path.basename(f, ".json");
  index.set(base, p);
  index.set(base.toLowerCase(), p);
  index.set(`schema:${base}`, p);
  index.set(`schema:${base.toLowerCase()}`, p);
}

// Custom resolver for schema:* URIs
const schemaProtocol = {
  order: 1,
  canRead: u => typeof u.url === "string" && u.url.startsWith("schema:"),
  read: u => {
    const p = index.get(u.url);
    if (!p) throw new Error(`Unknown schema id: ${u.url}`);
    return fs.readFileSync(p, "utf8");
  }
};

const buildMealbookRecipeSchema = () => ({
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://notwillk.mealbook/schemas/recipe.schema.json",
  "title": "Mealbook Recipe",
  "description": "Recipe definition for Mealbook files (JSON or YAML).",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "@context",
    "@type",
    "name",
    "description",
    "recipeIngredient",
    "recipeInstructions"
  ],
  "properties": {
    "@context": {
      "type": "string",
      "const": "https://schema.org"
    },
    "@type": {
      "type": "string",
      "const": "Recipe"
    },
    "name": {
      "type": "string",
      "minLength": 1
    },
    "alternateName": {
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 1
      },
      "minItems": 1
    },
    "description": {
      "type": "string",
      "minLength": 1
    },
    "image": {
      "oneOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "uri"
          },
          "minItems": 1
        }
      ]
    },
    "url": {
      "type": "string",
      "format": "uri"
    },
    "inLanguage": {
      "type": "string",
      "minLength": 2
    },
    "recipeCuisine": {
      "type": "string",
      "minLength": 1
    },
    "recipeCategory": {
      "type": "string",
      "minLength": 1
    },
    "keywords": {
      "oneOf": [
        {
          "type": "string",
          "minLength": 1
        },
        {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1
          },
          "minItems": 1
        }
      ]
    },
    "recipeYield": {
      "oneOf": [
        {
          "type": "string",
          "minLength": 1
        },
        {
          "type": "integer",
          "minimum": 0
        }
      ]
    },
    "prepTime": {
      "$ref": "#/$defs/isoDuration"
    },
    "cookTime": {
      "$ref": "#/$defs/isoDuration"
    },
    "totalTime": {
      "$ref": "#/$defs/isoDuration"
    },
    "datePublished": {
      "type": "string",
      "format": "date"
    },
    "author": {
      "oneOf": [
        {
          "type": "string",
          "minLength": 1
        },
        {
          "type": "object",
          "required": [
            "@type",
            "name"
          ],
          "properties": {
            "@type": {
              "type": "string",
              "enum": [
                "Person",
                "Organization"
              ]
            },
            "name": {
              "type": "string",
              "minLength": 1
            },
            "url": {
              "type": "string",
              "format": "uri"
            }
          },
          "additionalProperties": false
        }
      ]
    },
    "recipeIngredient": {
      "type": "array",
      "minItems": 1,
      "items": {
        "oneOf": [
          {
            "type": "string",
            "minLength": 1
          },
          {
            "type": "object",
            "required": [
              "name"
            ],
            "properties": {
              "@type": {
                "type": "string",
                "const": "PropertyValue"
              },
              "name": {
                "type": "string",
                "minLength": 1
              },
              "value": {
                "type": [
                  "string",
                  "number"
                ]
              },
              "unitCode": {
                "type": "string",
                "minLength": 1
              }
            },
            "additionalProperties": false
          }
        ]
      }
    },
    "recipeInstructions": {
      "oneOf": [
        {
          "type": "string",
          "minLength": 1
        },
        {
          "type": "array",
          "minItems": 1,
          "items": {
            "oneOf": [
              {
                "type": "string",
                "minLength": 1
              },
              {
                "type": "object",
                "required": [
                  "@type",
                  "text"
                ],
                "properties": {
                  "@type": {
                    "type": "string",
                    "enum": [
                      "HowToStep"
                    ]
                  },
                  "text": {
                    "type": "string",
                    "minLength": 1
                  },
                  "name": {
                    "type": "string"
                  },
                  "url": {
                    "type": "string",
                    "format": "uri"
                  }
                },
                "additionalProperties": false
              }
            ]
          }
        }
      ]
    },
    "nutrition": {
      "type": "object",
      "required": [
        "@type"
      ],
      "properties": {
        "@type": {
          "type": "string",
          "const": "NutritionInformation"
        },
        "calories": {
          "type": "string"
        },
        "fatContent": {
          "type": "string"
        },
        "carbohydrateContent": {
          "type": "string"
        },
        "proteinContent": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "suitableForDiet": {
      "type": "string",
      "anyOf": [
        {
          "enum": [
            "DiabeticDiet",
            "GlutenFreeDiet",
            "HalalDiet",
            "KosherDiet",
            "LowCalorieDiet",
            "LowFatDiet",
            "LowLactoseDiet",
            "LowSaltDiet",
            "VeganDiet",
            "VegetarianDiet"
          ]
        },
        {
          "pattern": "^https://schema\\.org/[^\\s]+$"
        }
      ]
    },
    "interactionStatistic": {
      "type": "object",
      "required": [
        "@type",
        "userInteractionCount"
      ],
      "properties": {
        "@type": {
          "type": "string",
          "const": "InteractionCounter"
        },
        "interactionType": {
          "type": "string"
        },
        "userInteractionCount": {
          "type": [
            "integer",
            "string"
          ]
        }
      },
      "additionalProperties": false
    },
    "aggregateRating": {
      "type": "object",
      "required": [
        "@type",
        "ratingValue"
      ],
      "properties": {
        "@type": {
          "type": "string",
          "const": "AggregateRating"
        },
        "ratingValue": {
          "type": [
            "number",
            "string"
          ]
        },
        "ratingCount": {
          "type": [
            "integer",
            "string"
          ]
        }
      },
      "additionalProperties": false
    }
  },
  "$defs": {
    "isoDuration": {
      "type": "string",
      "pattern": "^P(?=.+)(\\d+Y)?(\\d+M)?(\\d+W)?(\\d+D)?(T(\\d+H)?(\\d+M)?(\\d+S)?)?$"
    }
  }
});

const buildMealbookMenuSchema = () => ({
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://notwillk.mealbook/schemas/menu.schema.json",
  "title": "Mealbook Menu or Restaurant",
  "description": "Allows either a schema.org Menu object or a Restaurant with embedded Menu data.",
  "type": "object",
  "oneOf": [
    {
      "allOf": [
        {
          "properties": {
            "@context": {
              "type": "string",
              "const": "https://schema.org"
            }
          },
          "required": ["@context"]
        },
        { "$ref": "#/$defs/Menu" }
      ]
    },
    { "$ref": "#/$defs/Restaurant" }
  ],
  "$defs": {
    "Menu": {
      "type": "object",
      "required": ["@type", "hasMenuSection"],
      "properties": {
        "@context": {
          "type": "string",
          "const": "https://schema.org"
        },
        "@type": {
          "type": "string",
          "const": "Menu"
        },
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "image": {
          "oneOf": [
            {
              "type": "string",
              "format": "uri"
            },
            {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uri"
              },
              "minItems": 1
            }
          ]
        },
        "inLanguage": {
          "type": "string",
          "minLength": 2
        },
        "hasMenuSection": {
          "oneOf": [
            { "$ref": "#/$defs/MenuSection" },
            {
              "type": "array",
              "items": { "$ref": "#/$defs/MenuSection" },
              "minItems": 1
            }
          ]
        },
        "hasMenuItem": {
          "oneOf": [
            { "$ref": "#/$defs/MenuItem" },
            {
              "type": "array",
              "items": { "$ref": "#/$defs/MenuItem" },
              "minItems": 1
            }
          ]
        },
        "offers": { "$ref": "#/$defs/Offer" }
      },
      "additionalProperties": false
    },
    "MenuSection": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": {
          "type": "string",
          "const": "MenuSection"
        },
        "name": {
          "type": "string",
          "minLength": 1
        },
        "description": {
          "type": "string"
        },
        "image": {
          "oneOf": [
            {
              "type": "string",
              "format": "uri"
            },
            {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uri"
              },
              "minItems": 1
            }
          ]
        },
        "offers": { "$ref": "#/$defs/Offer" },
        "hasMenuItem": {
          "oneOf": [
            { "$ref": "#/$defs/MenuItem" },
            {
              "type": "array",
              "items": { "$ref": "#/$defs/MenuItem" },
              "minItems": 1
            }
          ]
        },
        "hasMenuSection": {
          "oneOf": [
            { "$ref": "#/$defs/MenuSection" },
            {
              "type": "array",
              "items": { "$ref": "#/$defs/MenuSection" },
              "minItems": 1
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "MenuItem": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": {
          "type": "string",
          "const": "MenuItem"
        },
        "name": {
          "type": "string",
          "minLength": 1
        },
        "description": {
          "type": "string"
        },
        "image": {
          "oneOf": [
            {
              "type": "string",
              "format": "uri"
            },
            {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uri"
              },
              "minItems": 1
            }
          ]
        },
        "nutrition": { "$ref": "#/$defs/NutritionInformation" },
        "offers": { "$ref": "#/$defs/Offer" },
        "suitableForDiet": {
          "type": "string",
          "anyOf": [
            {
              "enum": [
                "DiabeticDiet",
                "GlutenFreeDiet",
                "HalalDiet",
                "KosherDiet",
                "LowCalorieDiet",
                "LowFatDiet",
                "LowLactoseDiet",
                "LowSaltDiet",
                "VeganDiet",
                "VegetarianDiet"
              ]
            },
            {
              "pattern": "^https://schema\\.org/[^\\s]+$"
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "Restaurant": {
      "type": "object",
      "required": ["@context", "@type", "name", "hasMenu"],
      "properties": {
        "@context": {
          "type": "string",
          "const": "https://schema.org"
        },
        "@type": {
          "type": "string",
          "const": "Restaurant"
        },
        "name": {
          "type": "string",
          "minLength": 1
        },
        "description": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "image": {
          "oneOf": [
            {
              "type": "string",
              "format": "uri"
            },
            {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uri"
              },
              "minItems": 1
            }
          ]
        },
        "servesCuisine": {
          "oneOf": [
            {
              "type": "string",
              "minLength": 1
            },
            {
              "type": "array",
              "items": {
                "type": "string",
                "minLength": 1
              },
              "minItems": 1
            }
          ]
        },
        "hasMenu": {
          "oneOf": [
            { "$ref": "#/$defs/Menu" },
            {
              "type": "array",
              "items": { "$ref": "#/$defs/Menu" },
              "minItems": 1
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "Offer": {
      "type": "object",
      "required": ["@type"],
      "properties": {
        "@type": {
          "type": "string",
          "const": "Offer"
        },
        "price": {
          "type": ["string", "number"]
        },
        "priceCurrency": {
          "type": "string",
          "minLength": 1
        },
        "availabilityStarts": {
          "type": "string",
          "minLength": 1
        },
        "availabilityEnds": {
          "type": "string",
          "minLength": 1
        }
      },
      "additionalProperties": false
    },
    "NutritionInformation": {
      "type": "object",
      "required": ["@type"],
      "properties": {
        "@type": {
          "type": "string",
          "const": "NutritionInformation"
        },
        "calories": {
          "type": "string"
        },
        "fatContent": {
          "type": "string"
        },
        "fiberContent": {
          "type": "string"
        },
        "proteinContent": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  }
});

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const name of TARGETS) {
    const outPath = path.join(OUT_DIR, `${name.toLowerCase()}.schema.json`);

    if (name === "Recipe") {
      const schema = buildMealbookRecipeSchema();
      fs.writeFileSync(outPath, JSON.stringify(schema, null, 2) + "\n");
      console.log("Wrote", outPath);
      continue;
    }

    if (name === "Menu") {
      const schema = buildMealbookMenuSchema();
      fs.writeFileSync(outPath, JSON.stringify(schema, null, 2) + "\n");
      console.log("Wrote", outPath);
      continue;
    }

    const tryPaths = [
      `schema:${name}`,
      index.get(name) || index.get(name.toLowerCase())
    ].filter(Boolean);

    if (tryPaths.length === 0) {
      throw new Error(`No entry schema found for ${name}`);
    }

    let bundled;
    let lastErr;
    for (const entry of tryPaths) {
      try {
        bundled = await $RefParser.dereference(entry, {
          resolve: { file: true, http: false, schema: schemaProtocol },
          dereference: { circular: "ignore" }
        });
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    if (!bundled) throw lastErr;

    fs.writeFileSync(outPath, JSON.stringify(bundled, null, 2) + "\n");
    console.log("Wrote", outPath);
  }
})().catch(e => { console.error(e); process.exit(1); });
EOF

# --- Build and run
docker build -t schemaorg-bundle "$TMP_DIR"
docker run --rm -v "$OUT_DIR_ABS":/out schemaorg-bundle

echo "Done. Generated in: $OUT_DIR_ABS"
ls -1 "$OUT_DIR_ABS"
