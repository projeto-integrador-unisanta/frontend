import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      brandDark: "#001b3d", // Background Dark Marinho
      brandAccent: "#fadb14", // Amarelo vibrante
    }
  },
  shortcuts: {
    'btn-primary': 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors',
    'btn-accent': 'bg-brandAccent hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-colors',
    'card-base': 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm transition-all',
  }
});
