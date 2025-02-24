import { StyleSheet, Platform, StatusBar } from "react-native";

///
/// Estilos del NavigationMenu
///
export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  menuWrapper: {
    margin: 12,
  },
  blurContainer: {
    overflow: "hidden",
    borderRadius: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 4,
  },
  menuContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
});
