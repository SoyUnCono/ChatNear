import { StyleSheet, Platform, Dimensions } from "react-native";

///
/// Dimensiones
///
const { height, width } = Dimensions.get("window");

///
/// Estilos
///
export const styles = StyleSheet.create({
  message: {
    borderRadius: 14,
    marginTop: height * 0.15,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "System" : undefined,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 14,
    width: Math.min(width * 0.8, 340),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : undefined,
  },
  modalMessage: {
    fontSize: 13,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 18,
    fontFamily: Platform.OS === "ios" ? "System" : undefined,
  },
  buttonContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
  },
  button: {
    flex: 1,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "500",
    fontFamily: Platform.OS === "ios" ? "System" : undefined,
    textAlign: "center",
  },
  buttonSeparator: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  defaultText: {
    color: "#007AFF",
  },
  destructiveText: {
    color: "#FF3B30",
  },
  cancelText: {
    color: "#666666",
    fontWeight: "400",
  },
});
