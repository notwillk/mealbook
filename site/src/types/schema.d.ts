import type { FromSchema } from 'json-schema-to-ts';
import menuSchemaJson from '../../../schemas/menu.schema.json';
import recipeSchemaJson from '../../../schemas/recipe.schema.json';

export type Menu = FromSchema<typeof menuSchemaJson>;
export type Recipe = FromSchema<typeof recipeSchemaJson>;
