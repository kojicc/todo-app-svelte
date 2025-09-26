
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/api-demo" | "/api" | "/api/auth" | "/api/auth/logout" | "/api/todos" | "/api/todos/[id]" | "/login" | "/sverdle" | "/sverdle/how-to-play" | "/todos";
		RouteParams(): {
			"/api/todos/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/about": Record<string, never>;
			"/api-demo": Record<string, never>;
			"/api": { id?: string };
			"/api/auth": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/todos": { id?: string };
			"/api/todos/[id]": { id: string };
			"/login": Record<string, never>;
			"/sverdle": Record<string, never>;
			"/sverdle/how-to-play": Record<string, never>;
			"/todos": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/api-demo" | "/api-demo/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | "/api/auth/logout" | "/api/auth/logout/" | "/api/todos" | "/api/todos/" | `/api/todos/${string}` & {} | `/api/todos/${string}/` & {} | "/login" | "/login/" | "/sverdle" | "/sverdle/" | "/sverdle/how-to-play" | "/sverdle/how-to-play/" | "/todos" | "/todos/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | "/robots.txt" | string & {};
	}
}