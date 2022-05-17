import { Roles, UserViewModel } from "./interfaces/users";

export const Menues = [
  {
    text: "Catalog",
    exact: true,
    link: "/",
  },
  {
    text: "Cart",
    exact: false,
    link: "/cart",
    isCart: true,
    icon: "shopping_cart",
  },
  {
    text: "My addresses",
    exact: false,
    link: "/addresses",
    roles: [Roles.Admin, Roles.Merchandiser, Roles.Customer],
  },
  {
    text: "My cards",
    exact: false,
    link: "/cards",
    roles: [Roles.Admin, Roles.Merchandiser, Roles.Customer],
  },
  {
    text: "My orders",
    exact: false,
    link: "/orders",
    roles: [Roles.Admin, Roles.Merchandiser, Roles.Customer],
  },
  {
    text: "My vendors",
    exact: false,
    link: "/vendors",
    roles: [Roles.Merchandiser],
  },
  {
    text: "My products",
    exact: false,
    link: "/products",
    roles: [Roles.Merchandiser],
  },
  {
    text: "Categories",
    exact: false,
    link: "/categories",
    roles: [Roles.Admin],
  },
  {
    text: "Users",
    exact: false,
    link: "/users",
    roles: [Roles.Admin],
  },
];

export function getMenuesForUser(user: UserViewModel): any {
  return Menues.filter(menu => {
    if (menu.roles) {
      if (!user || !menu.roles.includes(user.role)) {
        return false;
      }
    }

    return true;
  });
}
