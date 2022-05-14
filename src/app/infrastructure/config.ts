import { Roles, UserViewModel } from "./interfaces/users";

export const Menues = [
  {
    text: "Catalog",
    exact: true,
    link: "/",
  },
  {
    text: "Vendors",
    exact: false,
    link: "/vendors",
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
  {
    text: "Addresses",
    exact: false,
    link: "/addresses",
    roles: [Roles.Customer],
  },
  {
    text: "Cards",
    exact: false,
    link: "/cards",
    roles: [Roles.Customer],
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
