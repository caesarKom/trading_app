import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import MainNavigator from "./MainNavigator"
import React from "react"
import { Colors } from "../constants/Colors"
import { navigationRef } from "../utils/NavigationUtil"

const Navigation = () => {
    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: Colors.background,
            text: Colors.text,
            card: Colors.card,
            border: Colors.border,
            notification: Colors.notification_card,
            primary: Colors.themeColor
        }
    }


    return (
        <NavigationContainer ref={navigationRef} theme={MyTheme}>
            <MainNavigator />
        </NavigationContainer>
    )
}

export default Navigation