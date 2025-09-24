export function isValidUrl(url: string) {
try {
const parsed = new URL(url);
return parsed.protocol === 'http:' || parsed.protocol === 'https:';
} catch (err) {
return false;
}
}