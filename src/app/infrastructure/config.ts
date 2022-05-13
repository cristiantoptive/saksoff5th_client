import { Roles, UserViewModel } from "./interfaces/users";

export const Menues = [
  {
    text: "Products",
    exact: true,
    link: "/",
  },
  {
    text: "Vendors",
    exact: false,
    link: "/vendors",
    roles: [Roles.Merchandiser],
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
