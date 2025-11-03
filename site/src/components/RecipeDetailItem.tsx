import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
}>;

export default function RecipeDetailItem({ title, children }: Props) {
  return (
    <>
      <dt>{title}</dt>
      <dd>{children}</dd>
    </>
  );
}
