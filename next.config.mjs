export default {
  // Recommended: this will reduce output
  // Docker image size by 80%+

  output: "standalone",

  // Optional: bring your own cache handler
  // cacheHandler: path.resolve('./cache-handler.mjs'),
  // cacheMaxMemorySize: 0, // Disable default in-memory caching (LRU, Next 15 feature)

  images: {
    // Optional: use a different optimization service, Sharp is built-into Next 15
    // loader: 'custom',
    // loaderFile: './image-loader.ts',
    //
    // Here be Sharp, which is built-into `next start` 15 only....
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
  // Nginx will do gzip compression. We gotta disable
  // compression here so we can prevent buffering
  // streaming responses... hmmm, interesting future lol
  compress: false,
  // look into this later
  // Optional: override the default (1 year) `stale-while-revalidate`
  // header time for static pages
  // swrDelta: 3600 // seconds
};

