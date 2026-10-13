import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	isDark: boolean;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
	isDark: true,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
	);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = getSystemTheme();
			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	const isDark = useMemo(() => {
		if (theme === "system") {
			const systemTheme = getSystemTheme();
			return systemTheme === "dark";
		}

		return theme === "dark";
	}, [theme]);

	const setThemeAndPersist = useCallback(
		(theme: Theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
		[storageKey],
	);

	const value = useMemo(
		() => ({
			theme,
			setTheme: setThemeAndPersist,
			isDark,
		}),
		[theme, setThemeAndPersist, isDark],
	);

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
};

const getSystemTheme = () =>
	window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
