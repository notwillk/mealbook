type Props = { menus: Record<string, unknown> };

export default function MenusListingPage({ menus }: Props) {
  return <pre>{JSON.stringify(menus, null, 2)}</pre>;
}
