import { Client } from "pg";
export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
	DB_USERNAME: string | undefined;
	DB_PASSWORD: string | undefined;
	DB_HOST: string | undefined;
	DB_PORT: number | undefined;
	DB_NAME: string | undefined;

}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		console.log(env.DB_PASSWORD)
		const client = new Client({
			user: env.DB_USERNAME,
			password: env.DB_PASSWORD,
			host: env.DB_HOST,
			port: env.DB_PORT,
			database: env.DB_NAME
		});
		await client.connect();

		// Query the products table
		const result = await client.query("SELECT * FROM restaurants");

		// Return the result as JSON
		const resp = new Response(JSON.stringify(result.rows), {
			headers: { "Content-Type": "application/json" },
		});

		// Clean up the client
		ctx.waitUntil(client.end());
		return resp;
	},
};
