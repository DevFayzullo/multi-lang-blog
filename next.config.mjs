import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: ["http://localhost:3000", "http://192.168.235.1:3000"],
  },
};

export default withNextIntl(nextConfig);
