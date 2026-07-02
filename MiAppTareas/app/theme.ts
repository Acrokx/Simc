export const colors = {
  primary: "#0D7377",
  secondary: "#14A095",
  accent: "#1AB8A8",
  light: "#26C4C4",
  background: "#F0FDFB",
  card: "#FFFFFF",
  text: {
    primary: "#0D7377",
    secondary: "#5A7D7C",
    muted: "#6B7280",
    dark: "#0F172A",
  },
  border: "#E0F2F1",
  success: "#14A095",
  error: "#DC2626",
  disabled: "#94A3B8",
};

export const commonStyles = {
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.dark,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "700",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(13, 115, 119, 0.08)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 4,
  },
};

export default {
  colors,
  commonStyles,
};