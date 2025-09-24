// jest.setup.js
Object.defineProperty(globalThis, "importMeta", {
  value: {
    env: {
      VITE_API_URL: "http://localhost:3000",
    },
  },
});
