// Cargador de avatares de imagen desde `src/assets/avatars/*`
// Coloca aquí tus archivos .png/.jpg/.jpeg/.webp/.svg y se cargarán automáticamente.

export interface ImageAvatar {
	id: string;
	name: string;
	url: string;
}

// Nota: usamos eager + query '?url' para obtener URLs procesadas por Vite
const modules = import.meta.glob('./assets/avatars/*.{png,jpg,jpeg,webp,svg}', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

const toTitleCase = (text: string): string => {
	// 1) Normalizar separadores y eliminar tokens de extensión residuales
	const cleaned = text
		.replace(/[-_]+/g, ' ')
		.replace(/\b(?:png|jpg|jpeg|webp|svg)\b/ig, '')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase();
	// 2) Capitalizar solo la primera letra de cada palabra
	return cleaned
		.split(' ')
		.map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
		.join(' ');
};

export const imageAvatars: ImageAvatar[] = Object.entries(modules)
	.map(([path, url]) => {
		const filename = path.split('/').pop() || path;
		const id = filename.replace(/\.[^.]+$/, '');
		return {
			id,
			name: toTitleCase(id),
			url
		};
	})
	.sort((a, b) => a.name.localeCompare(b.name));


