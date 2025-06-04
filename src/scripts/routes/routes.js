import HomePage from "../pages/home/home-page";
import SavedPage from "../pages/about/save-page";
import RegisterPage from "../pages/register/register-page";
import LoginPage from "../pages/login/login-page";
import AddStoryPage from "../pages/add-story/add-story-page";

const routes = {
  "/register": new RegisterPage(),
  "/login": new LoginPage(),
  "/": new HomePage(),
  "/add-story": new AddStoryPage(),
  "/about": new SavedPage(),
};

export default routes;
