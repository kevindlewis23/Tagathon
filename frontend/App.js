import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import page from "./screens/page";
import page2 from "./screens/page2";

const AppNavigator = createStackNavigator(
    {
        page,
        page2

    },
    {
        headerMode: "none"
    }
);

export default createAppContainer(AppNavigator);