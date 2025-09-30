import { Client } from 'mezon-js';
import type { ApiSession } from 'mezon-js/api.gen';

export type CreateMezonClientOptions = {
	ssl: boolean;
	host: string;
	port: string;
	key: string;
};

export type CreateVoiceClientOptions = {
	appID: string;
	roomName: string;
	token: string;
};

export type VoiceConnectionCBFunction = () => void;

let clientInstance: Client;

export function getClient() {
	return clientInstance;
}

export function createClient(options: CreateMezonClientOptions) {
	const { ssl, host, port, key } = options;
	const client = new Client(key, host, port, ssl);
	// TODO: Implement token refresh logic here
	client.onRefreshToken = (session: ApiSession) => {
		// Custom Handler: Token was successfully refreshed!
		console.error(`Stored new token: ${session}`);
	};

	clientInstance = client;

	return client;
}
